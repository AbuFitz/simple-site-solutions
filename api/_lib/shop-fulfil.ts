import type Stripe from "stripe";
import { Resend } from "resend";
import { getProduct, getVariant, pounds } from "../../src/data/shop.js";
import { escapeHtml, oneLine } from "./http.js";
import { claim, release } from "./fulfilment.js";
import { loadOrder, saveOrder, scrubSensitive, type Order } from "./orders.js";
import { filesForLines } from "./qr.js";

export type ShopVerdict = "paid" | "unpaid" | "expired" | "invalid";

/** A shop session counts as paid only if Stripe says so, in GBP, for exactly the total the server priced. */
export function verifyShopSession(s: Stripe.Checkout.Session, order: Order | null): ShopVerdict {
  if (!order || s.mode !== "payment" || s.metadata?.kind !== "shop" || s.metadata?.order_ref !== order.ref) return "invalid";
  if (s.status === "expired") return "expired";
  if (s.payment_status !== "paid") return "unpaid";
  if (s.currency !== "gbp" || s.amount_total !== order.totalPence) return "invalid";
  return "paid";
}

const FROM = "OneSimpleSite <noreply@onesimplesite.co.uk>";
const adminTo = () => process.env.ADMIN_EMAIL || "hello@onesimplesite.co.uk";

function lineRows(o: Order): string {
  return o.lines
    .map((l) => {
      const p = getProduct(l.slug);
      const v = p && getVariant(p, l.variantId);
      const fields = Object.entries(l.personalisation)
        .map(([k, val]) => `<li><strong>${escapeHtml(p?.fields.find((f) => f.id === k)?.label ?? k)}:</strong> ${escapeHtml(val)}</li>`)
        .join("");
      return `<tr><td style="padding:8px;border-top:1px solid #ddd"><strong>${escapeHtml(p?.name ?? l.slug)}</strong><br>${escapeHtml(v?.label ?? l.variantId)} x ${l.qty} @ ${pounds(l.unitPence)}<ul>${fields}</ul></td></tr>`;
    })
    .join("");
}

function shippingBlock(session: Stripe.Checkout.Session): { text: string; details: Order["shipping"] } {
  const s = session as unknown as {
    collected_information?: { shipping_details?: { name?: string; address?: Record<string, string | null> } };
    shipping_details?: { name?: string; address?: Record<string, string | null> };
  };
  const d = s.collected_information?.shipping_details ?? s.shipping_details;
  if (!d) return { text: "No delivery address (digital order).", details: undefined };
  const a = d.address ?? {};
  const text = [d.name, a.line1, a.line2, a.city, a.state, a.postal_code, a.country].filter(Boolean).join(", ");
  return { text, details: { name: d.name, address: a } };
}

/**
 * Idempotent fulfilment hand-off for a paid shop session:
 * claim once -> mark the order paid -> email the owner a production sheet with print-ready QR files ->
 * email the customer a confirmation (and, for the digital pack, their QR files) -> scrub sensitive data.
 * Any failure before the owner email releases the claim so Stripe's retry can run again.
 */
export async function fulfilShopSession(session: Stripe.Checkout.Session): Promise<"fulfilled" | "duplicate" | "needs-manual"> {
  if (!(await claim(session.id))) return "duplicate";
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const ref = session.metadata?.order_ref ?? "";
    const order = await loadOrder(ref);
    const verdict = verifyShopSession(session, order);

    if (!order || verdict !== "paid") {
      const { error } = await resend.emails.send({
        from: FROM,
        to: adminTo(),
        subject: oneLine(`ACTION NEEDED: paid shop session without a verifiable order (${ref || "no ref"})`),
        html: `<p>A Stripe session was paid but could not be matched to a stored order, or the amount didn't match (verdict: ${escapeHtml(verdict)}).</p><p>Session: ${escapeHtml(session.id)}<br>Amount: ${escapeHtml(String(session.amount_total))} ${escapeHtml(String(session.currency))}<br>Customer: ${escapeHtml(session.customer_details?.email ?? "unknown")}</p><p>Check Stripe and contact the customer. Nothing was sent to them automatically.</p>`,
      });
      if (error) throw new Error("Owner alert failed");
      return "needs-manual";
    }

    const ship = shippingBlock(session);
    const customerEmail = session.customer_details?.email ?? order.email;
    const isDigitalOnly = !order.hasPhysical;

    // 1. Owner production sheet with QR files for every line that needs one.
    const ownerFiles = await filesForLines(order.lines, { png: false });
    const sheet = await resend.emails.send({
      from: FROM,
      to: adminTo(),
      replyTo: customerEmail,
      subject: oneLine(`New shop order ${order.ref} (${pounds(order.totalPence)})`),
      html: `<h2>Order ${escapeHtml(order.ref)}</h2><p>Paid ${pounds(order.totalPence)} (items ${pounds(order.subtotalPence)}, delivery ${pounds(order.shippingPence)}). Customer: ${escapeHtml(customerEmail)}</p><p><strong>Deliver to:</strong> ${escapeHtml(ship.text)}</p><table style="width:100%;border-collapse:collapse">${lineRows(order)}</table><p>Print-ready QR files for each line are attached (static codes). Check each personalisation exactly as entered before producing.</p>`,
      attachments: ownerFiles.map((f) => ({ filename: f.filename, content: f.content })),
    });
    if (sheet.error) throw new Error("Owner hand-off failed");

    // 2. Mark paid and scrub sensitive data now the owner has it.
    await saveOrder(scrubSensitive({ ...order, status: "paid", sessionId: session.id, paidAt: new Date().toISOString(), email: customerEmail, shipping: ship.details }));

    // 3. Customer confirmation. Best effort: the order is safe even if this fails.
    try {
      const custFiles = isDigitalOnly || order.lines.some((l) => l.slug === "digital-qr-pack") ? await filesForLines(order.lines.filter((l) => l.slug === "digital-qr-pack"), { png: true }) : [];
      await resend.emails.send({
        from: FROM,
        to: customerEmail,
        subject: oneLine(`Your OneSimpleSite order ${order.ref}`),
        html: `<p>Thanks for your order. Your reference is <strong>${escapeHtml(order.ref)}</strong>.</p><table style="width:100%;border-collapse:collapse">${lineRows(
          { ...order, lines: order.lines.map((l) => ({ ...l, personalisation: Object.fromEntries(Object.entries(l.personalisation).filter(([k]) => !(getProduct(l.slug)?.fields.find((f) => f.id === k)?.sensitive))) })) }
        )}</table><p>Total paid: ${pounds(order.totalPence)}.</p>${
          order.hasPhysical ? "<p>Your items are made to order. We'll email you to confirm the dispatch date.</p>" : ""
        }${custFiles.length ? "<p>Your QR code files are attached (SVG scales to any size; PNG is 1200 px). Print them at least 2 cm wide, with a clear border, dark on light, and test-scan before printing in bulk.</p>" : ""}<p>Questions? Reply to this email.</p>`,
        attachments: custFiles.map((f) => ({ filename: f.filename, content: f.content })),
      });
    } catch (e) {
      console.error("customer confirmation failed", e instanceof Error ? e.message : e);
    }
    return "fulfilled";
  } catch (e) {
    await release(session.id).catch(() => undefined);
    throw e;
  }
}
