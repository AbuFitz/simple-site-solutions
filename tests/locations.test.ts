import { describe, expect, it } from "vitest";
import data from "../src/data/locations.json";
import { faqFor, locationJsonLd, staticLocationHtml, type LocData } from "../src/lib/locationSeo.mjs";

const d = data as LocData;
const slugs = d.locations.map((l) => l.slug);

describe("location pages data", () => {
  it("covers the twelve requested places once each", () => {
    expect(d.locations.map((l) => l.name).sort()).toEqual(["Aylesbury", "Dunstable", "Harpenden", "Hatfield", "Hemel Hempstead", "London", "Luton", "Milton Keynes", "St Albans", "Stevenage", "Watford", "Welwyn Garden City"]);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique, well-sized titles and descriptions that name the place", () => {
    const titles = new Set<string>();
    const descs = new Set<string>();
    for (const l of d.locations) {
      expect(l.title.length, l.slug).toBeLessThanOrEqual(65);
      expect(l.metaDescription.length, l.slug).toBeLessThanOrEqual(175);
      expect(l.metaDescription.length, l.slug).toBeGreaterThan(110);
      expect(l.title).toContain(l.name);
      expect(l.metaDescription).toContain(l.name);
      expect(l.h1).toContain(l.name);
      titles.add(l.title);
      descs.add(l.metaDescription);
    }
    expect(titles.size).toBe(d.locations.length);
    expect(descs.size).toBe(d.locations.length);
  });

  it("has real, different copy per place (no doorway-page duplication)", () => {
    const seen = new Set<string>();
    for (const l of d.locations) {
      for (const text of [...l.intro, l.local, ...l.sectors.map((s) => s.line), ...l.faq.map((f) => f.a)]) {
        expect(seen.has(text), `${l.slug} repeats copy: ${text.slice(0, 50)}`).toBe(false);
        seen.add(text);
      }
      expect(l.intro.join(" ").split(/\s+/).length, l.slug).toBeGreaterThan(70);
      expect(l.areas.length).toBeGreaterThanOrEqual(6);
      expect(l.faq.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("links only to pages that exist, and never to itself", () => {
    for (const l of d.locations) {
      expect(l.neighbours.length).toBeGreaterThanOrEqual(2);
      for (const n of l.neighbours) {
        expect(slugs, `${l.slug} -> ${n}`).toContain(n);
        expect(n).not.toBe(l.slug);
      }
    }
  });

  it("claims nothing we cannot back up", () => {
    const banned = [/\bour (office|studio|shop) (in|at)\b/i, /\bwe(?:'re| are) based in\b/i, /\bvisit (our|us)\b/i, /★|⭐|\b\d(\.\d)? ?\/ ?5\b/, /\b(we|will|promise to)\s+guarantee/i, /\b\d+\+? (years|clients|customers|projects)\b/i, /\baward/i, /\btop[- ]rated\b/i, /\b(number|no\.) ?1\b/i];
    for (const l of d.locations) {
      const text = [staticLocationHtml(l, d), ...faqFor(l, d).map((f) => f.a)].join("\n");
      for (const re of banned) expect(text, `${l.slug} matches ${re}`).not.toMatch(re);
    }
  });

  it("structured data has no ratings and the static HTML carries the visible text", () => {
    for (const l of d.locations) {
      const ld = JSON.stringify(locationJsonLd(l, d, "https://example.test"));
      expect(ld).not.toMatch(/aggregateRating|reviewRating|"review"/);
      const html = staticLocationHtml(l, d);
      expect(html).toContain(l.h1);
      expect(html).toContain(l.intro[0].slice(0, 40));
      for (const f of faqFor(l, d)) expect(html).toContain(f.q.replace(/&/g, "&amp;"));
    }
  });
});
