import { describe, expect, it } from "vitest";
import data from "../src/data/guides.json";
import { staticGuideHtml, type GuideData } from "../src/lib/guideSeo.mjs";

const d = data as GuideData;

describe("platform guides", () => {
  it("has unique slugs, titles and descriptions of sensible length", () => {
    expect(new Set(d.guides.map((g) => g.slug)).size).toBe(d.guides.length);
    expect(new Set(d.guides.map((g) => g.title)).size).toBe(d.guides.length);
    for (const g of d.guides) {
      expect(g.title.length, g.slug).toBeLessThanOrEqual(70);
      expect(g.metaDescription.length, g.slug).toBeLessThanOrEqual(175);
      expect(g.related.every((s) => d.guides.some((x) => x.slug === s) && s !== g.slug), g.slug).toBe(true);
    }
  });

  it("never disparages or makes unverifiable claims about another company", () => {
    const banned = [/\b(scam|rip[- ]?off|terrible|awful|worst|useless|rubbish|garbage|ripoff)\b/i, /\b(godaddy|wix|squarespace|one\.com|wordpress)\b.*\b(is|are) (slow|insecure|unreliable|overpriced|bad)\b/i];
    for (const g of d.guides) {
      const text = JSON.stringify(g);
      for (const re of banned) expect(text, `${g.slug} ${re}`).not.toMatch(re);
    }
  });

  it("only quotes our own prices, and says it is independent", () => {
    for (const g of d.guides) {
      const prices = [...JSON.stringify(g).matchAll(/£\d+/g)].map((m) => m[0]);
      for (const p of prices) expect(["£189", "£249", "£489", "£649"], `${g.slug} ${p}`).toContain(p);
      expect(staticGuideHtml(g, d)).toContain("not affiliated");
    }
  });
});
