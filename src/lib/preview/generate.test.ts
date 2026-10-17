import { describe, expect, it } from "vitest";
import { categories } from "./categories";
import {
  buildPreview,
  cleanName,
  contrast,
  decodeInput,
  defaultInput,
  encodeInput,
  hash,
  inferCategory,
  mergeFlowInput,
  monogram,
  parseTown,
  normaliseUkPhone,
  recommendPackage,
  resolvePalette,
  startHref,
} from "./generate";
import { packages } from "@/data/packages";

describe("category configuration", () => {
  it("has every field a template needs", () => {
    for (const c of categories) {
      expect(c.palettes.length, c.id).toBeGreaterThanOrEqual(3);
      expect(c.headlines.length, c.id).toBeGreaterThanOrEqual(3);
      expect(c.subheads.length, c.id).toBeGreaterThanOrEqual(2);
      expect(c.services.length, c.id).toBe(6);
      expect(c.steps.length, c.id).toBe(3);
      expect(c.about.length, c.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("palettes meet contrast requirements", () => {
    for (const c of categories) {
      for (const raw of c.palettes) {
        const p = resolvePalette(raw);
        const label = `${c.id}/${p.id}`;
        expect(contrast(p.ink, p.bg), `${label} ink on bg`).toBeGreaterThanOrEqual(7);
        expect(contrast(p.ink, p.surface), `${label} ink on surface`).toBeGreaterThanOrEqual(7);
        expect(contrast(p.muted, p.bg), `${label} muted on bg`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(p.muted, p.surface), `${label} muted on surface`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(p.accentInk, p.accent), `${label} label on accent`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(p.accentText, p.bg), `${label} accent text on bg (large text)`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("makes no claims the business has not made", () => {
    const banned = /\b(free|guarantee|award|accredited|certified|insured|rated|5-star|five-star|\d+\s*years|same[- ]day|24\/7|#1|best)\b/i;
    for (const c of categories) {
      const copy = [...c.headlines, ...c.subheads, ...c.about, ...c.services.flatMap((s) => [s.title, s.blurb]), ...c.steps.flatMap((s) => [s.title, s.blurb])];
      for (const line of copy) expect(line, `${c.id}: ${line}`).not.toMatch(banned);
    }
  });
});

describe("inference and cleaning", () => {
  it("infers the category from the name", () => {
    expect(inferCategory("Smith & Sons Plumbing")).toBe("plumbing");
    expect(inferCategory("Bright Spark Electrical")).toBe("electrical");
    expect(inferCategory("Hemel Motor Garage")).toBe("mechanic");
    expect(inferCategory("Sparkle Clean Services")).toBe("cleaning");
    expect(inferCategory("The Sharp Barber")).toBe("barber");
    expect(inferCategory("BrightLearn Tuition")).toBe("tutoring");
    expect(inferCategory("Stonebridge Construction")).toBe("builder");
    expect(inferCategory("Zxq Ltd")).toBeNull();
  });

  it("tidies names without mangling mixed case", () => {
    expect(cleanName("  JOHN   SMITH PLUMBING ")).toBe("John Smith Plumbing");
    expect(cleanName("smith and sons")).toBe("Smith and Sons");
    expect(cleanName("McDonald's Garage")).toBe("McDonald's Garage");
    expect(cleanName("<b>Evil</b>")).toBe("bEvil/b");
    expect(cleanName("x".repeat(100)).length).toBe(60);
  });

  it("makes a two-letter monogram", () => {
    expect(monogram("Smith & Sons Plumbing")).toBe("SS");
    expect(monogram("Brightlearn")).toBe("Br");
    expect(monogram("")).toBe("•");
  });

  it("normalises UK phone numbers", () => {
    expect(normaliseUkPhone("07123456789")).toEqual({ display: "07123 456789", href: "tel:+447123456789" });
    expect(normaliseUkPhone("+44 7123 456 789")?.href).toBe("tel:+447123456789");
    expect(normaliseUkPhone("020 7946 0958")?.display).toBe("020 7946 0958");
    expect(normaliseUkPhone("01923 456789")?.display).toBe("01923 456789");
    expect(normaliseUkPhone("12345")).toBeNull();
    expect(normaliseUkPhone("not a number")).toBeNull();
  });
});

describe("buildPreview", () => {
  const base = { ...defaultInput(), name: "Smith Plumbing", town: "watford", phone: "07123456789", category: "plumbing" as const };

  it("is deterministic and varies with the seed", () => {
    expect(buildPreview(base)).toEqual(buildPreview(base));
    const seen = new Set(Array.from({ length: 6 }, (_, i) => buildPreview({ ...base, seed: i }).headline + buildPreview({ ...base, seed: i }).palette.id));
    expect(seen.size).toBeGreaterThan(2);
  });

  it("uses only what the owner provided", () => {
    const m = buildPreview(base);
    expect(m.town).toBe("Watford");
    expect(m.headline).toMatch(/Watford|Smith Plumbing/);
    expect(m.cta.href).toBe("tel:+447123456789");
    expect(m.contact.email).toBeUndefined();
    expect(m.placeholders.join(" ")).toMatch(/Email/);
    expect(m.placeholders.join(" ")).not.toMatch(/Phone/);
  });

  it("never links the call to action to something that was not supplied", () => {
    const m = buildPreview({ ...defaultInput(), category: "builder", action: "quote" });
    expect(m.cta.href).toBe("#contact");
    expect(m.name).toBe("Your Business Name");
    expect(m.placeholders[0]).toMatch(/placeholder/);
  });

  it("drops the town cleanly when none is given", () => {
    const m = buildPreview({ ...defaultInput(), name: "Ace", category: "plumbing", seed: 0 });
    expect(m.headline).not.toMatch(/ in \./);
    expect(m.headline).not.toMatch(/undefined|\{/);
  });

  it("keeps the owner's own services and flags examples otherwise", () => {
    expect(buildPreview(base).servicesAreExamples).toBe(true);
    const m = buildPreview({ ...base, services: ["Boilers", "Leaks"] });
    expect(m.servicesAreExamples).toBe(false);
    expect(m.services.map((s) => s.title)).toEqual(["Boilers", "Leaks"]);
  });

  it("builds a valid model for every category and several seeds", () => {
    for (const c of categories) {
      for (let seed = 0; seed < 6; seed++) {
        const m = buildPreview({ ...defaultInput(), name: "Test Co", town: "Luton", category: c.id, action: c.defaultAction, seed });
        expect(m.headline.length, `${c.id}/${seed}`).toBeGreaterThan(8);
        expect(m.headline, `${c.id}/${seed}`).not.toMatch(/\{|\}|undefined/);
        expect(m.services).toHaveLength(6);
        expect(m.layout).toMatch(/split|bold|editorial|centered/);
      }
    }
  });
});

describe("recommendPackage", () => {
  const b = defaultInput();
  it("matches the real package inclusions", () => {
    expect(recommendPackage({ ...b, action: "call" }).id).toBe("launch");
    expect(recommendPackage({ ...b, action: "book" }).id).toBe("launch");
    expect(recommendPackage({ ...b, services: ["a", "b", "c", "d"] }).id).toBe("growth");
    expect(recommendPackage({ ...b, multiArea: true }).id).toBe("growth");
    const ids = packages.map((p) => p.id);
    for (const r of [recommendPackage(b), recommendPackage({ ...b, multiArea: true })]) {
      expect(ids).toContain(r.id);
      expect(r.reasons.length).toBeGreaterThan(0);
    }
  });
});

describe("shareable state", () => {
  it("round-trips through the URL", () => {
    const i = { ...defaultInput(), name: "A & B Garage", category: "mechanic" as const, town: "Hemel Hempstead", phone: "01923 456789", email: "a@b.co.uk", action: "book" as const, services: ["MOT", "Brakes"], multiArea: true, seed: 3, postcode: "WD17 1AA", pin: true, areas: ["Bushey", "Rickmansworth"] };
    expect(decodeInput(encodeInput(i))).toEqual(i);
  });

  it("falls back safely on junk", () => {
    expect(decodeInput("c=nonsense&v=banana&n=" + "x".repeat(500)).category).toBe("plumbing");
    expect(decodeInput("")).toEqual(defaultInput());
  });

  it("builds a prefilled project link", () => {
    const href = startHref({ ...defaultInput(), name: "Ace Plumbing", town: "Luton" }, "growth");
    expect(href).toBe("/start?package=growth&business=Ace+Plumbing&type=Plumber+in+Luton");
  });

  it("hash is stable", () => {
    expect(hash("abc")).toBe(hash("abc"));
    expect(hash("abc")).not.toBe(hash("abd"));
  });
});

describe("carrying a preview into the project form", () => {
  it("finds a town in a description", () => {
    expect(parseTown("Mechanic in Hemel Hempstead")).toBe("Hemel Hempstead");
    expect(parseTown("Plumber in Watford.")).toBe("Watford");
    expect(parseTown("We fix boilers")).toBe("");
    expect(parseTown("Barber near St Albans")).toBe("St Albans");
  });

  it("lets typing win and earlier choices fill gaps", () => {
    const base = { ...defaultInput(), name: "Old", category: "mechanic" as const, town: "Luton", phone: "07123456789", services: ["MOT"], action: "book" as const };
    const m = mergeFlowInput(base, { name: "Hemel Motor Garage", description: "Car garage", phone: "", email: "a@b.co" });
    expect(m.name).toBe("Hemel Motor Garage");
    expect(m.category).toBe("mechanic");
    expect(m.town).toBe("Luton");
    expect(m.phone).toBe("07123456789");
    expect(m.email).toBe("a@b.co");
    expect(m.services).toEqual(["MOT"]);
    expect(m.action).toBe("book");
  });

  it("re-infers the category and resets style when the business changes type", () => {
    const base = { ...defaultInput(), category: "mechanic" as const, seed: 3 };
    const m = mergeFlowInput(base, { name: "Bright Spark", description: "Electrician in Luton", phone: "", email: "" });
    expect(m.category).toBe("electrical");
    expect(m.seed).toBe(0);
    expect(m.town).toBe("Luton");
    expect(m.action).toBe("quote");
  });

  it("works with no earlier preview and no match", () => {
    const m = mergeFlowInput(null, { name: "Zxq", description: "", phone: "", email: "" });
    expect(m.category).toBe("other");
    expect(buildPreview(m).headline.length).toBeGreaterThan(3);
  });
});
