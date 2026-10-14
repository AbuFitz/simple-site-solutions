import { getProduct, getVariant, priceLines, type Totals } from "../data/shop";
import { cleanText, validatePersonalisation } from "./shop-rules";

/** The basket. Held in this browser only (localStorage) and re-validated against the catalogue on every load. */
export interface CartLine {
  id: string;
  slug: string;
  variantId: string;
  qty: number;
  personalisation: Record<string, string>;
}

export const CART_KEY = "oss_cart_v1";
export const MAX_LINES = 10;

const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `l${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`);

const sameDetails = (a: Record<string, string>, b: Record<string, string>) => {
  const ka = Object.keys(a).sort();
  const kb = Object.keys(b).sort();
  return ka.length === kb.length && ka.every((k, i) => k === kb[i] && a[k] === b[k]);
};

/** Add a line. An identical product, variant and personalisation just increases the quantity (up to the product's maximum). */
export function addLine(lines: CartLine[], input: { slug: string; variantId: string; qty: number; personalisation: Record<string, string> }): CartLine[] {
  const p = getProduct(input.slug);
  if (!p || !getVariant(p, input.variantId)) return lines;
  const qty = Math.max(1, Math.min(p.maxQty, Math.floor(input.qty) || 1));
  const existing = lines.find((l) => l.slug === input.slug && l.variantId === input.variantId && sameDetails(l.personalisation, input.personalisation));
  if (existing) return lines.map((l) => (l.id === existing.id ? { ...l, qty: Math.min(p.maxQty, l.qty + qty) } : l));
  if (lines.length >= MAX_LINES) return lines;
  return [...lines, { id: newId(), slug: input.slug, variantId: input.variantId, qty, personalisation: input.personalisation }];
}

export function setQty(lines: CartLine[], id: string, qty: number): CartLine[] {
  return lines.map((l) => {
    if (l.id !== id) return l;
    const p = getProduct(l.slug);
    return { ...l, qty: Math.max(1, Math.min(p?.maxQty ?? 1, Math.floor(qty) || 1)) };
  });
}

export const removeLine = (lines: CartLine[], id: string) => lines.filter((l) => l.id !== id);
export const countItems = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);
export const cartTotals = (lines: CartLine[]): Totals => priceLines(lines.map((l) => ({ slug: l.slug, variantId: l.variantId, qty: l.qty })));

/** Drop anything that no longer matches the catalogue (removed product, changed variant, bad personalisation). */
export function sanitiseCart(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  for (const r of raw.slice(0, MAX_LINES)) {
    if (!r || typeof r !== "object") continue;
    const { id, slug, variantId, qty, personalisation } = r as Record<string, unknown>;
    const p = typeof slug === "string" ? getProduct(slug) : undefined;
    if (!p || typeof variantId !== "string" || !getVariant(p, variantId)) continue;
    const n = typeof qty === "number" && Number.isFinite(qty) ? Math.max(1, Math.min(p.maxQty, Math.floor(qty))) : 1;
    const pers = personalisation && typeof personalisation === "object" ? Object.fromEntries(Object.entries(personalisation as Record<string, unknown>).filter(([, v]) => typeof v === "string").map(([k, v]) => [k, cleanText(v)])) : {};
    if (!validatePersonalisation(p, pers).ok) continue;
    out.push({ id: typeof id === "string" && id.length <= 64 ? id : newId(), slug: p.slug, variantId, qty: n, personalisation: pers });
  }
  return out;
}

export function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? sanitiseCart(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function saveCart(lines: CartLine[]): void {
  try {
    if (lines.length === 0) localStorage.removeItem(CART_KEY);
    else localStorage.setItem(CART_KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable: the basket still works for this visit */
  }
}

/** Human-readable personalisation for a line, for the basket and review. Passwords are masked. */
export function describeLine(line: CartLine): { label: string; value: string }[] {
  const p = getProduct(line.slug);
  if (!p) return [];
  return p.fields
    .filter((f) => line.personalisation[f.id])
    .map((f) => ({ label: f.label, value: f.kind === "password" ? "••••••••" : f.kind === "select" ? f.options?.find((o) => o.value === line.personalisation[f.id])?.label ?? line.personalisation[f.id] : line.personalisation[f.id] }));
}
