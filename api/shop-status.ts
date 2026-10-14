import type { VercelRequest, VercelResponse } from "@vercel/node";
import { json } from "./_lib/http.js";
import { publicStatus, shopConfig } from "./_lib/shop-config.js";

/** Read-only readiness for the shop UI. Exposes no keys, price ids, stock counts or reasons. */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });
  const cfg = shopConfig();
  if (!cfg.open && process.env.SHOP_ENABLED === "true") console.warn("Shop requested but closed:", cfg.reasons.join("; "));
  return json(res, 200, publicStatus(cfg));
}
