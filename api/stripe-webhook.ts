import type { VercelRequest, VercelResponse } from "@vercel/node";
import type Stripe from "stripe";
import { checkoutConfig } from "./_lib/checkout-config.js";
import { fulfilOnce } from "./_lib/fulfilment.js";
import { json, readRawBody } from "./_lib/http.js";
import { getStripe } from "./_lib/stripe.js";
import { verifySession } from "./_lib/verify.js";

// Stripe signs the exact bytes it sends, so the body must not be parsed before verification.
export const config = { api: { bodyParser: false } };

const FULFIL_EVENTS = new Set(["checkout.session.completed", "checkout.session.async_payment_succeeded"]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  const cfg = checkoutConfig();
  if (!cfg.enabled) return json(res, 503, { error: "Not available" });

  const sig = req.headers["stripe-signature"];
  if (typeof sig !== "string") return json(res, 400, { error: "Missing signature" });

  let event: Stripe.Event;
  try {
    const raw = await readRawBody(req);
    event = getStripe().webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch {
    return json(res, 400, { error: "Invalid signature" });
  }

  if (!FULFIL_EVENTS.has(event.type)) return json(res, 200, { received: true, ignored: true });

  const v = verifySession(event.data.object as Stripe.Checkout.Session);
  if (v.status !== "paid") return json(res, 200, { received: true, fulfilled: false, reason: v.status });

  try {
    const result = await fulfilOnce(v.paid);
    return json(res, 200, { received: true, result });
  } catch (e) {
    // 5xx makes Stripe retry; the claim was released so the retry can run.
    console.error("fulfilment failed", e instanceof Error ? e.message : e);
    return json(res, 500, { error: "Fulfilment failed" });
  }
}
