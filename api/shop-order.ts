import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clientIp, json } from "./_lib/http.js";
import { isRef, loadOrder, summarise } from "./_lib/orders.js";
import { rateLimit } from "./_lib/rateLimit.js";
import { shopConfig } from "./_lib/shop-config.js";
import { verifyShopSession } from "./_lib/shop-fulfil.js";
import { getStripe } from "./_lib/stripe.js";

const NOT_FOUND = { error: "We couldn't find that order. Check the reference and the email address you used." };

/**
 * Order status.
 *  - ?session_id=cs_...   success page: verifies the session with Stripe, never trusts the redirect.
 *  - ?ref=OSS-...&email=  status page: the reference is unguessable and the email must match.
 * Responses contain names, variants, quantities and totals only: no personalisation, no address.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });
  if (!rateLimit(`order:${clientIp(req)}`, 20, 10 * 60_000).ok) return json(res, 429, { error: "Too many requests. Please wait a few minutes." });
  const cfg = shopConfig();
  if (!cfg.open) return json(res, 503, { error: "Not available" });

  try {
    const sid = typeof req.query.session_id === "string" ? req.query.session_id : "";
    if (sid) {
      if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sid)) return json(res, 400, { error: "Invalid session" });
      const session = await getStripe().checkout.sessions.retrieve(sid);
      const order = await loadOrder(session.metadata?.order_ref ?? "");
      const verdict = verifyShopSession(session, order);
      if (verdict === "paid" && order) return json(res, 200, { verdict, order: summarise({ ...order, status: "paid" }) });
      return json(res, 200, { verdict });
    }

    const ref = typeof req.query.ref === "string" ? req.query.ref.trim().toUpperCase() : "";
    const email = typeof req.query.email === "string" ? req.query.email.trim().toLowerCase() : "";
    if (!isRef(ref) || !email) return json(res, 404, NOT_FOUND);
    const order = await loadOrder(ref);
    if (!order || order.email.toLowerCase() !== email) return json(res, 404, NOT_FOUND);
    return json(res, 200, { order: summarise(order) });
  } catch (e) {
    console.error("shop-order failed", e instanceof Error ? e.message : e);
    return json(res, 502, { error: "We couldn't check your order just now. Please try again." });
  }
}
