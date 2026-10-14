import { getProduct, getVariant, type PersonaliseField, type Product } from "../data/shop.js";

/** Shared by the browser (inline errors) and the API (authoritative validation). */

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000b-\u001f\u007f]/g;

/** Strip control characters, collapse line breaks to spaces and trim. */
export const cleanText = (s: unknown): string => (typeof s === "string" ? s.replace(CONTROL, "").replace(/\s+/g, " ").trim() : "");

/** Adds https:// when the visitor typed a bare domain such as www.example.co.uk. */
export function normaliseUrl(raw: string): string {
  const s = cleanText(raw);
  if (!s) return "";
  return /^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`;
}

function parseHttps(raw: string): URL | null {
  try {
    const u = new URL(normaliseUrl(raw));
    if (u.protocol !== "https:") return null;
    if (u.username || u.password) return null;
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(u.hostname)) return null;
    return u;
  } catch {
    return null;
  }
}

export const isHttpsUrl = (raw: string) => parseHttps(raw) !== null;

/** Only links Google itself issues for review forms, so a card can never point somewhere else. */
export function isGoogleReviewUrl(raw: string): boolean {
  const u = parseHttps(raw);
  if (!u) return false;
  const host = u.hostname.toLowerCase();
  if (host === "g.page") return u.pathname.startsWith("/r/") && u.pathname.length > 3;
  if (host === "search.google.com") return u.pathname === "/local/writereview" && u.searchParams.has("placeid");
  return false;
}

/** Whether a conditional field applies, given the raw values entered so far. */
export function isFieldVisible(field: PersonaliseField, values: Record<string, unknown>): boolean {
  const c = field.showIf;
  if (!c) return true;
  const v = cleanText(values?.[c.field]);
  if (c.in) return c.in.includes(v);
  if (c.notIn) return !c.notIn.includes(v);
  return true;
}

export function validateField(field: PersonaliseField, rawValue: unknown): string | null {
  const value = cleanText(rawValue);
  if (!value) return field.required ? `${field.label} is required` : null;
  if (value.length > field.max) return `${field.label} is too long (max ${field.max} characters)`;
  if (field.kind === "select" && !field.options?.some((o) => o.value === value)) return `Choose one of the listed options for ${field.label.toLowerCase()}`;
  if (field.rule === "googleReviewUrl" && !isGoogleReviewUrl(value)) return "That isn't a Google review link. It should start with https://g.page/r/ or https://search.google.com/local/writereview";
  if (field.rule === "httpsUrl" && !isHttpsUrl(value)) return "Enter a web address like https://www.example.co.uk (https only)";
  return null;
}

export interface PersonaliseResult {
  ok: boolean;
  errors: Record<string, string>;
  clean: Record<string, string>;
}

export function validatePersonalisation(product: Product, values: Record<string, unknown>): PersonaliseResult {
  const errors: Record<string, string> = {};
  const clean: Record<string, string> = {};
  for (const f of product.fields) {
    if (!isFieldVisible(f, values)) continue;
    const err = validateField(f, values?.[f.id]);
    if (err) errors[f.id] = err;
    else {
      const v = cleanText(values?.[f.id]);
      if (v) clean[f.id] = f.rule === "httpsUrl" || f.rule === "googleReviewUrl" ? normaliseUrl(v) : v;
    }
  }
  // Wi-Fi: a password is needed unless the network is open; an open network must not have one.
  if (product.slug === "qr-table-sign" && clean.purpose === "wifi" && !errors.security) {
    const sec = clean.security;
    if (sec && sec !== "nopass" && !clean.password) errors.password = "Enter the Wi-Fi password, or choose 'No password'";
    if (sec === "nopass" && clean.password) errors.password = "Remove the password, or choose a security type";
  }
  // Unknown extra keys are dropped, never stored.
  return { ok: Object.keys(errors).length === 0, errors, clean };
}

/** Wi-Fi QR payload: WIFI:T:<WPA|WEP|nopass>;S:<ssid>;P:<password>;; with \ ; , : " escaped. */
export const wifiEscape = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");
export function wifiPayload(ssid: string, security: string, password: string): string {
  const t = security === "nopass" ? "nopass" : security;
  return `WIFI:T:${t};S:${wifiEscape(ssid)};${t === "nopass" ? "" : `P:${wifiEscape(password)};`};`;
}

export const productFor = (slug: string, variantId: string) => {
  const p = getProduct(slug);
  const v = p ? getVariant(p, variantId) : undefined;
  return p && v ? { product: p, variant: v } : null;
};
