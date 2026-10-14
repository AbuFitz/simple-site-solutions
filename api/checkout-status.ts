import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkoutConfig } from "./_lib/checkout-config.js";
import { json } from "./_lib/http.js";

/** Tells the UI whether to show "Pay online". Exposes no keys or reasons; reasons go to the server log only. */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });
  const cfg = checkoutConfig();
  if (!cfg.enabled && process.env.CHECKOUT_ENABLED === "true") console.warn("Checkout requested but disabled:", cfg.reasons.join("; "));
  return json(res, 200, { enabled: cfg.enabled, packages: cfg.packages });
}
