import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { SHIPPING, getProduct, getVariant, priceLines, skuKey } from "../src/data/shop.js";
import { validatePersonalisation } from "../src/lib/shop-rules.js";
import { clientIp, json, originAllowed, siteUrl } from "./_lib/http.js";
import { newRef, saveOrder, type Order, type OrderLine } from "./_lib/orders.js";
import { rateLimit } from "./_lib/rateLimit.js";
import { shopConfig } from "./_lib/shop-config.js";
import { getStripe } from "./_lib/stripe.js";

const body = z.object({
  email: z.string().trim().min(1).email().max(254),
  acceptTerms: z.literal(true),
  items: z
    .array(
      z.object({
        slug: z.string().max(60),
        variantId: z.string().max(30),
        qty: z.number().int().min(1).max(20),
        personalisation: z.record(z.string(), z.unknown()).default({}),
      })
    )
    .min(1)
    .max(10),
});

// Stripe Price lookups are cached per warm instance so checkout doesn't make one API call per line.
const priceCache = new Map<string, { at: number; ok: boolean }>();

async function priceMatches(priceId: string, expectedPence: number): Promise<boolean> {
  const hit = priceCache.get(`${priceId}:${expectedPence}`);
  if (hit && Date.now() - hit.at < 10 * 60_000) return hit.ok;
  const price = await getStripe().prices.retrieve(priceId);
  const ok = price.active === true && price.currency === "gbp" && price.unit_amount === expectedPence && price.type === "one_time" && !price.recurring;
  priceCache.set(`${priceId}:${expectedPence}`, { at: Date.now(), ok });
  return ok;
}

export const _clearPriceCache = () => priceCache.clear();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  if (!originAllowed(req)) return json(res, 403, { error: "Forbidden" });
  const rl = rateLimit(`shop:${clientIp(req)}`, 8, 10 * 60_000);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return json(res, 429, { error: "Too many attempts. Please wait a few minutes." });
  }

  const cfg = shopConfig();
  if (!cfg.open) return json(res, 503, { error: "Ordering isn't open yet.", code: "unavailable" });
  const base = siteUrl();
  if (!base) return json(res, 503, { error: "Ordering isn't open yet.", code: "unavailable" });

  const parsed = body.safeParse(req.body);
  if (!parsed.success) return json(res, 400, { error: "Check your basket and email address.", code: "invalid" });

  // Validate every line against the catalogue; prices are never read from the request.
  const lines: OrderLine[] = [];
  const fieldErrors: Record<string, Record<string, string>> = {};
  const unavailable: string[] = [];
  const wantBySku = new Map<string, number>();
  for (const [i, it] of parsed.data.items.entries()) {
    const product = getProduct(it.slug);
    const variant = product && getVariant(product, it.variantId);
    if (!product || !variant || it.qty > product.maxQty) return json(res, 400, { error: "Your basket contains an item that isn't available.", code: "invalid" });
    const pers = validatePersonalisation(product, it.personalisation);
    if (!pers.ok) {
      fieldErrors[String(i)] = pers.errors;
      continue;
    }
    const sku = `${product.slug}:${variant.id}`;
    const state = cfg.skus[sku];
    if (!state?.available) unavailable.push(sku);
    wantBySku.set(sku, (wantBySku.get(sku) ?? 0) + it.qty);
    lines.push({ lineId: randomUUID(), slug: product.slug, variantId: variant.id, qty: it.qty, unitPence: variant.pricePence, personalisation: pers.clean });
  }
  if (Object.keys(fieldErrors).length) return json(res, 400, { error: "Some personalisation needs fixing.", code: "personalisation", fieldErrors });
  if (unavailable.length) return json(res, 409, { error: "Some items can't be ordered right now.", code: "unavailable", skus: [...new Set(unavailable)] });
  for (const [sku, want] of wantBySku) {
    const st = cfg.skus[sku];
    if (st.stock !== undefined && want > st.stock) return json(res, 409, { error: "There isn't enough stock for part of your basket.", code: "insufficient-stock", skus: [sku] });
  }

  const totals = priceLines(lines.map((l) => ({ slug: l.slug, variantId: l.variantId, qty: l.qty })));
  if (totals.invalid.length) return json(res, 400, { error: "Your basket contains an item that isn't available.", code: "invalid" });

  try {
    // GBP and amount validation: the configured Stripe Price must match the catalogue exactly.
    for (const sku of wantBySku.keys()) {
      const st = cfg.skus[sku];
      const v = getVariant(getProduct(st.slug)!, st.variantId)!;
      if (!st.priceId || !(await priceMatches(st.priceId, v.pricePence))) {
        console.error(`Price mismatch for ${skuKey(st.slug, st.variantId)}: configured Stripe Price does not match the catalogue`);
        return json(res, 503, { error: "Ordering isn't open yet.", code: "unavailable" });
      }
    }

    const ref = newRef();
    const order: Order = {
      ref,
      status: "pending",
      createdAt: new Date().toISOString(),
      email: parsed.data.email,
      lines,
      subtotalPence: totals.subtotalPence,
      shippingPence: totals.shippingPence,
      totalPence: totals.totalPence,
      hasPhysical: totals.hasPhysical,
    };
    await saveOrder(order);

    // Merge identical Prices into one Stripe line; personalisation stays on the stored order.
    const qtyByPrice = new Map<string, number>();
    for (const l of lines) {
      const priceId = cfg.skus[`${l.slug}:${l.variantId}`].priceId as string;
      qtyByPrice.set(priceId, (qtyByPrice.get(priceId) ?? 0) + l.qty);
    }

    const session = await getStripe().checkout.sessions.create(
      {
        mode: "payment",
        line_items: [...qtyByPrice].map(([price, quantity]) => ({ price, quantity })),
        customer_email: parsed.data.email,
        client_reference_id: ref,
        metadata: { kind: "shop", order_ref: ref },
        payment_intent_data: { metadata: { kind: "shop", order_ref: ref } },
        success_url: `${base}/shop/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/shop/order/cancel`,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        ...(totals.hasPhysical
          ? {
              shipping_address_collection: { allowed_countries: [...SHIPPING.countries] },
              shipping_options: [
                {
                  shipping_rate_data: {
                    type: "fixed_amount" as const,
                    fixed_amount: { amount: totals.shippingPence, currency: "gbp" },
                    display_name: totals.shippingPence === 0 ? "Free UK delivery" : SHIPPING.label,
                  },
                },
              ],
            }
          : {}),
      },
      { idempotencyKey: `shop-${ref}` }
    );
    if (!session.url) throw new Error("No checkout URL");
    await saveOrder({ ...order, sessionId: session.id });
    return json(res, 200, { url: session.url, ref });
  } catch (e) {
    console.error("shop-checkout failed", e instanceof Error ? e.message : e);
    return json(res, 502, { error: "We couldn't start payment. Your basket is saved; please try again.", code: "stripe" });
  }
}
