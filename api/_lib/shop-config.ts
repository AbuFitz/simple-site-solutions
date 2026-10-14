import { products, skuKey } from "../../src/data/shop.js";

/**
 * Server-side readiness for the shop. Everything fails closed. Ordering opens only when:
 *  - the global gates are satisfied (SHOP_ENABLED, PRICING_APPROVED, Stripe key + webhook secret, SITE_URL,
 *    the order store and an email key for fulfilment),
 *  - physical products also need SHOP_FULFILMENT_CONFIRMED (a real supplier/production route exists),
 *  - and each variant has a real Stripe Price ID (SHOP_PRICE_<KEY>), SHOP_READY_<KEY>="true" and is not sold out
 *    (SHOP_STOCK_<KEY>, optional integer; 0 means sold out).
 */
export interface SkuState {
  sku: string;
  slug: string;
  variantId: string;
  fulfilment: "physical" | "digital";
  priceId?: string;
  stock?: number;
  available: boolean;
  soldOut: boolean;
}

export interface ShopConfig {
  open: boolean;
  physicalOpen: boolean;
  reasons: string[];
  skus: Record<string, SkuState>;
}

export function shopConfig(env: NodeJS.ProcessEnv = process.env): ShopConfig {
  const reasons: string[] = [];
  const need = (ok: boolean, why: string) => {
    if (!ok) reasons.push(why);
  };
  need(env.SHOP_ENABLED === "true", "SHOP_ENABLED is not 'true'");
  need(env.PRICING_APPROVED === "true", "PRICING_APPROVED is not 'true'");
  const key = env.STRIPE_SECRET_KEY || "";
  need(/^sk_(test|live)_/.test(key), "STRIPE_SECRET_KEY missing or malformed");
  need(key.startsWith("sk_live_") ? env.STRIPE_ALLOW_LIVE === "true" : true, "Live Stripe key without STRIPE_ALLOW_LIVE='true'");
  need(/^whsec_/.test(env.STRIPE_WEBHOOK_SECRET || ""), "STRIPE_WEBHOOK_SECRET missing or malformed");
  need(Boolean(env.SITE_URL), "SITE_URL missing");
  need(Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN), "Order store (UPSTASH_REDIS_REST_URL/TOKEN) missing");
  need(Boolean(env.RESEND_API_KEY), "RESEND_API_KEY missing (fulfilment email)");
  const open = reasons.length === 0;
  const physicalOpen = open && env.SHOP_FULFILMENT_CONFIRMED === "true";

  const skus: Record<string, SkuState> = {};
  for (const p of products) {
    for (const v of p.variants) {
      const k = skuKey(p.slug, v.id);
      const priceRaw = env[`SHOP_PRICE_${k}`] || "";
      const priceId = /^price_[A-Za-z0-9]+$/.test(priceRaw) ? priceRaw : undefined;
      const stockRaw = env[`SHOP_STOCK_${k}`];
      const stock = stockRaw !== undefined && /^\d+$/.test(stockRaw) ? Number(stockRaw) : undefined;
      const soldOut = stock !== undefined && stock <= 0;
      const ready = env[`SHOP_READY_${k}`] === "true";
      const gate = p.fulfilment === "physical" ? physicalOpen : open;
      const sku = `${p.slug}:${v.id}`;
      skus[sku] = { sku, slug: p.slug, variantId: v.id, fulfilment: p.fulfilment, priceId, stock, soldOut, available: gate && ready && Boolean(priceId) && !soldOut };
    }
  }
  return { open, physicalOpen, reasons, skus };
}

export type PublicSkuStatus = "available" | "sold-out" | "unavailable";

/** What the browser may know: never price ids, never stock counts. */
export function publicStatus(cfg: ShopConfig) {
  const skus: Record<string, PublicSkuStatus> = {};
  for (const s of Object.values(cfg.skus)) skus[s.sku] = s.soldOut ? "sold-out" : s.available ? "available" : "unavailable";
  return { open: cfg.open, skus };
}
