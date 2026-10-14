import { Resend } from "resend";
import { escapeHtml, oneLine } from "./http.js";
import { redis } from "./redis.js";
import { getPackage } from "../../src/data/packages.js";

/**
 * Idempotent fulfilment. Stripe may deliver the same event more than once, and both the webhook and
 * the success page can see the same paid session, so work is guarded by an atomic "set if not exists"
 * claim in Upstash Redis (REST). Without the store configured, checkout is disabled (see checkout-config).
 *
 * The fulfilment action itself is deliberately a placeholder: it notifies the owner by email that a
 * deposit/payment arrived. Anything further (invoice, onboarding link) belongs to the owner's process.
 */
export async function claim(sessionId: string): Promise<boolean> {
  const res = await redis(["SET", `oss:fulfilled:${sessionId}`, "1", "NX", "EX", 60 * 60 * 24 * 90]);
  return res === "OK";
}

export async function release(sessionId: string): Promise<void> {
  await redis(["DEL", `oss:fulfilled:${sessionId}`]);
}

export interface PaidSession {
  id: string;
  packageId: string;
  amountTotal: number;
  currency: string;
  email?: string | null;
}

export async function fulfilOnce(s: PaidSession): Promise<"fulfilled" | "duplicate"> {
  if (!(await claim(s.id))) return "duplicate";
  try {
    await notifyOwner(s);
    return "fulfilled";
  } catch (e) {
    await release(s.id).catch(() => undefined);
    throw e;
  }
}

async function notifyOwner(s: PaidSession) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");
  const to = process.env.ADMIN_EMAIL || "hello@onesimplesite.co.uk";
  const pkg = getPackage(s.packageId);
  const amount = `£${(s.amountTotal / 100).toFixed(2)}`;
  const { error } = await new Resend(key).emails.send({
    from: "OneSimpleSite <noreply@onesimplesite.co.uk>",
    to,
    subject: oneLine(`Payment received: ${pkg?.name ?? s.packageId} (${amount})`),
    html: `<p>A Stripe Checkout payment completed.</p>
<ul><li>Package: ${escapeHtml(pkg?.name ?? s.packageId)}</li><li>Amount: ${escapeHtml(amount)}</li>
<li>Customer email: ${escapeHtml(s.email ?? "not provided")}</li><li>Session: ${escapeHtml(s.id)}</li></ul>
<p>Next step: confirm scope with the customer, then start the project.</p>`,
  });
  if (error) throw new Error("Owner notification failed");
}
