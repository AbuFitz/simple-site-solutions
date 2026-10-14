import type { VercelRequest, VercelResponse } from "@vercel/node";
import type Stripe from "stripe";
import { fulfilOnce } from "./_lib/fulfilment.js";
import { fulfilShopSession } from "./_lib/shop-fulfil.js";
import { json, readRawBody } from "./_lib/http.js";
import { getStripe } from "./_lib/stripe.js";
import { verifySession } from "./_lib/verify.js";

// Stripe signs the exact bytes it sends, so the body must not be parsed before verification.
export const config = { api: { bodyParser: false } };

const FULFIL_EVENTS = new Set(["checkout.session.completed", "checkout.session.async_payment_succeeded"]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  // A customer who has paid must always be processed, so only the credentials gate this endpoint (not the shop/checkout switches).
  const credsOk = /^sk_(test|live)_/.test(process.env.STRIPE_SECRET_KEY || "") && /^whsec_/.test(process.env.STRIPE_WEBHOOK_SECRET || "") && Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  if (!credsOk) return json(res, 503, { error: "Not available" });

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

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.metadata?.kind === "shop") {
    // The shop verifies against the stored order, which holds the server-priced total.
    if (session.payment_status !== "paid") return json(res, 200, { received: true, fulfilled: false, reason: "unpaid" });
    try {
      return json(res, 200, { received: true, result: await fulfilShopSession(session) });
    } catch (e) {
      console.error("shop fulfilment failed", e instanceof Error ? e.message : e);
      return json(res, 500, { error: "Fulfilment failed" });
    }
  }

  const v = verifySession(session);
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
