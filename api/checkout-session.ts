import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkoutConfig } from "./_lib/checkout-config.js";
import { clientIp, json } from "./_lib/http.js";
import { rateLimit } from "./_lib/rateLimit.js";
import { getStripe } from "./_lib/stripe.js";
import { verifySession } from "./_lib/verify.js";

/** Success-page lookup. Verifies the session with Stripe server-side; returns only what the page needs. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });
  if (!rateLimit(`session:${clientIp(req)}`, 30, 10 * 60_000).ok) return json(res, 429, { error: "Too many requests" });
  if (!checkoutConfig().enabled) return json(res, 503, { error: "Not available" });

  const id = typeof req.query.session_id === "string" ? req.query.session_id : "";
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(id)) return json(res, 400, { error: "Invalid session" });

  try {
    const session = await getStripe().checkout.sessions.retrieve(id);
    const v = verifySession(session);
    if (v.status === "paid") return json(res, 200, { status: "paid", package: v.paid.packageId, amountTotal: v.paid.amountTotal });
    return json(res, 200, { status: v.status });
  } catch (e) {
    console.error("checkout-session lookup failed", e instanceof Error ? e.message : e);
    return json(res, 502, { error: "We couldn't check your payment just now." });
  }
}
