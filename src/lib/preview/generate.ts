import { z } from "zod";
import { categories, categoryById } from "./categories";
import type {
  ActionKind,
  CategoryConfig,
  CategoryId,
  LayoutId,
  PackageRecommendation,
  Palette,
  PreviewInput,
  PreviewModel,
  ResolvedPalette,
} from "./types";

/* ---------- Colour maths (WCAG 2.x) ---------- */

const hex = (h: string): [number, number, number] => {
  const v = h.replace("#", "");
  const n = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
};

export const luminance = (h: string) => {
  const [r, g, b] = hex(h).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** The more readable of near-black and white on a given background. */
export const readableOn = (bg: string) => (contrast(bg, "#111111") >= contrast(bg, "#FFFFFF") ? "#111111" : "#FFFFFF");

export const resolvePalette = (p: Palette): ResolvedPalette => ({
  ...p,
  accentInk: p.accentInk ?? readableOn(p.accent),
  accentText: contrast(p.accent, p.bg) >= 3 ? p.accent : p.ink,
});

/* ---------- Text clean-up ---------- */

/** Removes control characters and angle brackets so nothing odd can reach the page or the URL. */
const strip = (raw: string) => Array.from(raw).filter((ch) => ch.charCodeAt(0) >= 32 && ch !== "<" && ch !== ">").join("");

const SMALL = new Set(["and", "of", "the", "in", "on", "at", "to", "for", "&", "by"]);

/** Tidies a business name: collapses spaces, strips control characters, fixes ALL CAPS and all lowercase. */
export function cleanName(raw: string): string {
  const s = strip(raw).replace(/\s+/g, " ").trim().slice(0, 60);
  if (!s) return "";
  const letters = s.replace(/[^A-Za-z]/g, "");
  const allUpper = letters.length > 3 && letters === letters.toUpperCase();
  const allLower = letters.length > 0 && letters === letters.toLowerCase();
  if (!allUpper && !allLower) return s;
  return s
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export function cleanTown(raw: string): string {
  const s = strip(raw).replace(/\s+/g, " ").trim().slice(0, 40);
  if (!s) return "";
  return s
    .split(" ")
    .map((w) => (w.length > 1 && w === w.toLowerCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function monogram(name: string): string {
  const words = name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter((w) => w && !SMALL.has(w.toLowerCase()));
  if (words.length === 0) return "•";
  if (words.length === 1) return words[0].slice(0, 2).charAt(0).toUpperCase() + (words[0].length > 1 ? words[0].charAt(1).toLowerCase() : "");
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

/* ---------- UK phone ---------- */

/** Returns { display, href } for a plausible UK number, or null. Accepts 07…, 01…/02…, +44… with spaces or dashes. */
export function normaliseUkPhone(raw: string): { display: string; href: string } | null {
  let d = raw.replace(/[\s\-().]/g, "");
  if (d.startsWith("+44")) d = "0" + d.slice(3);
  else if (d.startsWith("0044")) d = "0" + d.slice(4);
  if (!/^0\d{9,10}$/.test(d)) return null;
  let display: string;
  if (d.startsWith("07") && d.length === 11) display = `${d.slice(0, 5)} ${d.slice(5)}`;
  else if (/^02\d{9}$/.test(d)) display = `${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7)}`;
  else if (d.length === 11) display = `${d.slice(0, 5)} ${d.slice(5)}`;
  else display = `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  return { display, href: `tel:+44${d.slice(1)}` };
}

/* ---------- Category inference ---------- */

/** Suggests a category from the business name using the keyword lists. Returns null when nothing matches. */
export function inferCategory(name: string): CategoryId | null {
  const text = ` ${name.toLowerCase()} `;
  let best: { id: CategoryId; score: number } | null = null;
  for (const c of categories) {
    let score = 0;
    for (const k of c.keywords) if (text.includes(k)) score += k.length;
    if (score > 0 && (!best || score > best.score)) best = { id: c.id, score };
  }
  return best ? best.id : null;
}

/* ---------- Stable variation ---------- */

/** Small deterministic hash so a business gets the same headline every time unless the user asks for another. */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* ---------- Generation ---------- */

export const PLACEHOLDER_NAME = "Your Business Name";

export const defaultInput = (): PreviewInput => ({
  name: "",
  category: "plumbing",
  town: "",
  phone: "",
  email: "",
  action: "call",
  services: [],
  multiArea: false,
  seed: 0,
});

const fill = (tpl: string, vars: { name: string; town: string; trade: string }) =>
  tpl
    .replace("{inTown}", vars.town ? ` in ${vars.town}` : "")
    .replace("{town}", vars.town || "your area")
    .replace("{name}", vars.name)
    .replace("{trade}", vars.trade)
    .replace(/\s+([.,])/g, "$1")
    .replace(/^./, (c) => c.toUpperCase());

const ACTION_LABELS: Record<ActionKind, string> = {
  call: "Call us",
  quote: "Request a quote",
  book: "Book now",
  visit: "Visit the shop",
};

export function buildPreview(input: PreviewInput): PreviewModel {
  const cat: CategoryConfig = categoryById(input.category);
  const name = cleanName(input.name) || PLACEHOLDER_NAME;
  const hasName = name !== PLACEHOLDER_NAME;
  const town = cleanTown(input.town);
  const seed = Math.max(0, Math.floor(input.seed));
  const base = hash(`${name}|${cat.id}`);

  const palette = resolvePalette(cat.palettes[(base + seed) % cat.palettes.length]);
  const layout: LayoutId = cat.layouts[(seed + (base >>> 3)) % cat.layouts.length];
  const vars = { name, town, trade: cat.trade };
  const headline = fill(cat.headlines[(base + seed) % cat.headlines.length], vars);
  const subhead = cat.subheads[(base + seed) % cat.subheads.length];

  const phone = normaliseUkPhone(input.phone);
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) ? input.email.trim() : "";

  // The primary action only ever links to something the owner actually provided
  let cta: PreviewModel["cta"];
  const kind = input.action;
  if (kind === "call" && phone) cta = { kind, label: `Call ${phone.display}`, href: phone.href };
  else if (email && kind !== "visit") cta = { kind, label: ACTION_LABELS[kind], href: `mailto:${email}` };
  else if (phone) cta = { kind: "call", label: `Call ${phone.display}`, href: phone.href };
  else cta = { kind, label: ACTION_LABELS[kind], href: "#contact" };

  const secondaryCta = phone && cta.kind !== "call" ? { label: phone.display, href: phone.href } : undefined;

  const owned = input.services.map((s) => s.trim()).filter(Boolean).slice(0, 6);
  const servicesAreExamples = owned.length === 0;
  const services = servicesAreExamples
    ? cat.services
    : owned.map((title, i) => ({ title, blurb: cat.services[i % cat.services.length].blurb }));

  const aboutBody = cat.about[(base + seed) % cat.about.length];

  const placeholders: string[] = [];
  if (!hasName) placeholders.push("Business name (shown as a placeholder)");
  if (!town) placeholders.push("Your town or area");
  if (!phone) placeholders.push("Phone number");
  if (!email) placeholders.push("Email address");
  if (servicesAreExamples) placeholders.push("Services (examples for your trade, easy to change)");
  placeholders.push("Photos (we use your own photography, or agree a plan with you)");
  placeholders.push("About text, reviews and opening details (written with you)");

  return {
    category: cat,
    layout,
    type: cat.type,
    palette,
    name,
    monogram: monogram(name),
    town,
    headline,
    subhead,
    cta,
    secondaryCta,
    nav: ["Services", "How it works", "About", "Contact"],
    services,
    servicesAreExamples,
    steps: cat.steps,
    aboutHeading: `About ${name}`,
    aboutBody,
    contact: { phone: phone?.display, phoneHref: phone?.href, email: email || undefined, town: town || undefined },
    placeholders,
  };
}

/* ---------- Package recommendation ---------- */

/**
 * Recommends a package from what the owner told us, using the real inclusions on the Packages page:
 * Starter = up to 3 pages, Sorted = up to 6 pages with booking and reviews, Works = up to 10 pages with location pages.
 * Every reason is stated so the recommendation can be checked rather than trusted.
 */
export function recommendPackage(input: PreviewInput): PackageRecommendation {
  const n = input.services.map((s) => s.trim()).filter(Boolean).length;
  const reasons: string[] = [];
  if (input.multiArea) {
    reasons.push("You cover more than one town, and The Works includes location pages for local search.");
    if (n > 4) reasons.push(`${n} services is enough to give each its own page.`);
    return { id: "works", reasons };
  }
  if (n > 6 || (n >= 6 && input.category === "builder")) {
    reasons.push("A long list of services is easier to browse with a page each (up to 10 pages).");
    return { id: "works", reasons };
  }
  if (input.action === "book") {
    reasons.push("You want customers to book, and a booking system is included in The Sorted.");
    return { id: "sorted", reasons };
  }
  if (n >= 4) {
    reasons.push(`${n} services reads best across up to 6 pages, with space for reviews and trust signals.`);
    return { id: "sorted", reasons };
  }
  reasons.push("A short list of services and a simple call or quote action fits 3 pages well.");
  reasons.push("You can move up later if the business grows.");
  return { id: "starter", reasons };
}

/* ---------- Shareable URL state ---------- */

const ids = categories.map((c) => c.id) as [CategoryId, ...CategoryId[]];

const paramsSchema = z.object({
  n: z.string().max(60).default(""),
  c: z.enum(ids).default("plumbing"),
  t: z.string().max(40).default(""),
  p: z.string().max(20).default(""),
  e: z.string().max(80).default(""),
  a: z.enum(["call", "quote", "book", "visit"]).optional(),
  s: z.string().max(240).default(""),
  m: z.enum(["0", "1"]).default("0"),
  v: z.coerce.number().int().min(0).max(99).default(0),
});

export function encodeInput(i: PreviewInput): string {
  const p = new URLSearchParams();
  if (i.name) p.set("n", i.name);
  p.set("c", i.category);
  if (i.town) p.set("t", i.town);
  if (i.phone) p.set("p", i.phone);
  if (i.email) p.set("e", i.email);
  p.set("a", i.action);
  if (i.services.length) p.set("s", i.services.join("|"));
  if (i.multiArea) p.set("m", "1");
  if (i.seed) p.set("v", String(i.seed));
  return p.toString();
}

export function decodeInput(search: string): PreviewInput {
  const raw = Object.fromEntries(new URLSearchParams(search));
  const parsed = paramsSchema.safeParse(raw);
  const d = defaultInput();
  if (!parsed.success) return d;
  const v = parsed.data;
  const cat = categoryById(v.c);
  return {
    name: v.n,
    category: v.c,
    town: v.t,
    phone: v.p,
    email: v.e,
    action: v.a ?? cat.defaultAction,
    services: v.s ? v.s.split("|").slice(0, 6) : [],
    multiArea: v.m === "1",
    seed: v.v,
  };
}

/** Values to carry into the project form so nobody types the same details twice. */
export function startHref(input: PreviewInput, pkg: PackageRecommendation["id"]): string {
  const p = new URLSearchParams();
  p.set("package", pkg);
  const name = cleanName(input.name);
  if (name) p.set("business", name);
  const cat = categoryById(input.category);
  const town = cleanTown(input.town);
  p.set("type", `${cat.describe}${town ? ` in ${town}` : ""}`);
  return `/start?${p.toString()}`;
}
