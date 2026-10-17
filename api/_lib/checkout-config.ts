import { dueToBeginPence, packages, type PackageTier } from "../../src/data/packages.js";

/**
 * Server-authoritative checkout configuration. The browser only ever sends a package id; the Stripe
 * Price ID, amount and whether paying is allowed at all come from here and from environment variables.
 * Everything fails closed: if any requirement is missing, checkout is off and says why (to the logs).
 */
export type PackageId = PackageTier["id"];

/** Expected charge in pence, derived from the catalogue: "full" is the whole price, "half" is half. Quoted packages cannot be paid online. */
export function expectedPence(id: PackageId): number {
  const p = packages.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown package ${id}`);
  const pence = dueToBeginPence(p);
  if (pence === null) throw new Error(`Package ${id} is quoted individually and has no online price`);
  return pence;
}

export function isPackageId(v: unknown): v is PackageId {
  return typeof v === "string" && packages.some((p) => p.id === v && p.price !== null);
}

export interface CheckoutConfig {
  enabled: boolean;
  reasons: string[];
  packages: PackageId[];
  priceIds: Partial<Record<PackageId, string>>;
}

export function checkoutConfig(env: NodeJS.ProcessEnv = process.env): CheckoutConfig {
  const reasons: string[] = [];
  const need = (ok: boolean, why: string) => {
    if (!ok) reasons.push(why);
  };

  need(env.CHECKOUT_ENABLED === "true", "CHECKOUT_ENABLED is not 'true'");
  need(env.PRICING_APPROVED === "true", "PRICING_APPROVED is not 'true' (owner has not signed off prices and terms)");
  const key = env.STRIPE_SECRET_KEY || "";
  need(/^sk_(test|live)_/.test(key), "STRIPE_SECRET_KEY missing or malformed");
  need(key.startsWith("sk_live_") ? env.STRIPE_ALLOW_LIVE === "true" : true, "Live Stripe key without STRIPE_ALLOW_LIVE='true'");
  need(/^whsec_/.test(env.STRIPE_WEBHOOK_SECRET || ""), "STRIPE_WEBHOOK_SECRET missing or malformed");
  need(Boolean(env.SITE_URL), "SITE_URL missing");
  need(Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN), "Fulfilment store (UPSTASH_REDIS_REST_URL/TOKEN) missing");

  const priceIds: Partial<Record<PackageId, string>> = {};
  const ready: PackageId[] = [];
  for (const p of packages) {
    if (p.price === null) continue;
    const up = p.id.toUpperCase();
    const price = env[`STRIPE_PRICE_${up}`] || "";
    if (/^price_[A-Za-z0-9]+$/.test(price) && env[`PACKAGE_READY_${up}`] === "true") {
      priceIds[p.id] = price;
      ready.push(p.id);
    }
  }
  need(ready.length > 0, "No package has both STRIPE_PRICE_<ID> and PACKAGE_READY_<ID>='true'");

  return { enabled: reasons.length === 0, reasons, packages: reasons.length === 0 ? ready : [], priceIds };
}
