import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { checkoutConfig, isPackageId } from "./_lib/checkout-config.js";
import { clientIp, json, originAllowed, siteUrl } from "./_lib/http.js";
import { rateLimit } from "./_lib/rateLimit.js";
import { getStripe } from "./_lib/stripe.js";

const body = z.object({
  package: z.string().max(20),
  email: z.string().trim().email().max(254).optional().or(z.literal("")),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  if (!originAllowed(req)) return json(res, 403, { error: "Forbidden" });

  const rl = rateLimit(`checkout:${clientIp(req)}`, 5, 10 * 60_000);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return json(res, 429, { error: "Too many attempts. Please wait a few minutes." });
  }

  const cfg = checkoutConfig();
  if (!cfg.enabled) return json(res, 503, { error: "Online payment isn't available yet. Send your brief and we'll arrange payment." });

  const parsed = body.safeParse(req.body);
  if (!parsed.success || !isPackageId(parsed.data.package)) return json(res, 400, { error: "Choose a valid package." });
  const id = parsed.data.package;
  const price = cfg.priceIds[id];
  if (!cfg.packages.includes(id) || !price) return json(res, 400, { error: "That package can't be paid for online yet." });

  const base = siteUrl();
  if (!base) return json(res, 503, { error: "Online payment isn't available yet." });

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      // Price comes from the server-side Price ID, never from the browser.
      line_items: [{ price, quantity: 1 }],
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout/cancel`,
      client_reference_id: id,
      metadata: { package: id },
      payment_intent_data: { metadata: { package: id } },
      ...(parsed.data.email ? { customer_email: parsed.data.email } : {}),
    });
    if (!session.url) throw new Error("No checkout URL");
    return json(res, 200, { url: session.url });
  } catch (e) {
    console.error("create-checkout-session failed", e instanceof Error ? e.message : e);
    return json(res, 502, { error: "We couldn't start payment. Please try again, or send your brief instead." });
  }
}
