import { describe, expect, it } from "vitest";
import { CATEGORIES, SHIPPING, SUGGESTED_BY_BUSINESS, getProduct, priceLines, products, skuKey } from "./shop";
import { categories } from "@/lib/preview/categories";

describe("catalogue integrity", () => {
  it("has unique slugs, variants and env keys", () => {
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    const keys = products.flatMap((p) => p.variants.map((v) => skuKey(p.slug, v.id)));
    expect(new Set(keys).size).toBe(keys.length);
    for (const p of products) expect(new Set(p.variants.map((v) => v.id)).size).toBe(p.variants.length);
  });
  it("prices are positive whole pence and variants are sorted cheapest first", () => {
    for (const p of products) {
      const prices = p.variants.map((v) => v.pricePence);
      for (const x of prices) expect(Number.isInteger(x) && x > 0 && x < 100000).toBe(true);
      expect([...prices].sort((a, b) => a - b)).toEqual(prices);
    }
  });
  it("every product is complete and honest", () => {
    for (const p of products) {
      expect(CATEGORIES.some((c) => c.id === p.category)).toBe(true);
      expect(p.howItWorks.length).toBeGreaterThanOrEqual(2);
      expect(p.includes.length).toBeGreaterThan(0);
      expect(p.notIncluded.length).toBeGreaterThan(0);
      expect(p.fields.length).toBeGreaterThan(0);
      expect(p.maxQty).toBeGreaterThanOrEqual(1);
      for (const r of p.related) expect(getProduct(r)).toBeTruthy();
      for (const f of p.fields) if (f.kind === "select") expect(f.options?.length).toBeGreaterThan(1);
      const text = JSON.stringify(p);
      expect(text).not.toMatch(/guarantee|lifetime|waterproof|eco-?friendly|sustainab|best seller|award|certified|\b5 ?star/i);
    }
  });
  it("sensitive fields are only ever Wi-Fi passwords", () => {
    const s = products.flatMap((p) => p.fields.filter((f) => f.sensitive).map((f) => `${p.slug}:${f.id}`));
    expect(s).toEqual(["qr-table-sign:password"]);
  });
  it("cross-sell suggestions exist for every preview business type", () => {
    for (const c of categories) {
      const list = SUGGESTED_BY_BUSINESS[c.id];
      expect(list?.length, c.id).toBeGreaterThan(0);
      for (const slug of list) expect(getProduct(slug)).toBeTruthy();
    }
  });
});

describe("pricing", () => {
  it("adds delivery under the threshold, waives it at or over, and none for digital", () => {
    expect(priceLines([{ slug: "review-card", variantId: "x1", qty: 1 }])).toMatchObject({ subtotalPence: 1499, shippingPence: SHIPPING.flatPence, totalPence: 1499 + SHIPPING.flatPence, hasPhysical: true });
    expect(priceLines([{ slug: "review-card", variantId: "x10", qty: 1 }]).shippingPence).toBe(0);
    expect(priceLines([{ slug: "digital-qr-pack", variantId: "pack", qty: 1 }])).toMatchObject({ shippingPence: 0, totalPence: 999, hasPhysical: false });
  });
  it("the free-delivery threshold counts physical items only", () => {
    const t = priceLines([
      { slug: "digital-qr-pack", variantId: "pack", qty: 1 },
      { slug: "review-card", variantId: "x1", qty: 1 },
    ]);
    expect(t.shippingPence).toBe(SHIPPING.flatPence);
  });
  it("flags unknown products, variants and bad quantities instead of pricing them", () => {
    const t = priceLines([
      { slug: "nope", variantId: "x", qty: 1 },
      { slug: "review-card", variantId: "x1", qty: 0 },
      { slug: "review-card", variantId: "x1", qty: 11 },
      { slug: "review-card", variantId: "x1", qty: 1.5 },
    ]);
    expect(t.invalid.length).toBe(4);
    expect(t.totalPence).toBe(0);
  });
});
