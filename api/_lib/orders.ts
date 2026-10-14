import { randomBytes } from "node:crypto";
import { products } from "../../src/data/shop.js";
import { redis } from "./redis.js";

export interface OrderLine {
  lineId: string;
  slug: string;
  variantId: string;
  qty: number;
  unitPence: number;
  personalisation: Record<string, string>;
}

export interface Order {
  ref: string;
  status: "pending" | "paid" | "expired";
  createdAt: string;
  email: string;
  lines: OrderLine[];
  subtotalPence: number;
  shippingPence: number;
  totalPence: number;
  hasPhysical: boolean;
  sessionId?: string;
  paidAt?: string;
  shipping?: { name?: string | null; address?: Record<string, string | null | undefined> | null };
}

const TTL = 60 * 60 * 24 * 90;
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Unguessable, human-readable reference such as OSS-7K2M9QXA. */
export function newRef(): string {
  const bytes = randomBytes(8);
  let s = "";
  for (const b of bytes) s += ALPHABET[b % ALPHABET.length];
  return `OSS-${s}`;
}

export const isRef = (v: unknown): v is string => typeof v === "string" && /^OSS-[A-HJKMNP-Z2-9]{8}$/.test(v);

export async function saveOrder(o: Order): Promise<void> {
  await redis(["SET", `oss:order:${o.ref}`, JSON.stringify(o), "EX", TTL]);
}

export async function loadOrder(ref: string): Promise<Order | null> {
  if (!isRef(ref)) return null;
  const raw = await redis(["GET", `oss:order:${ref}`]);
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}

/** Remove sensitive personalisation (for example a Wi-Fi password) once the order has been handed off. */
export function scrubSensitive(o: Order): Order {
  const sensitive = new Set<string>();
  for (const p of products) for (const f of p.fields) if (f.sensitive) sensitive.add(`${p.slug}:${f.id}`);
  return {
    ...o,
    lines: o.lines.map((l) => ({
      ...l,
      personalisation: Object.fromEntries(Object.entries(l.personalisation).map(([k, v]) => [k, sensitive.has(`${l.slug}:${k}`) ? "[removed after fulfilment]" : v])),
    })),
  };
}

/** Customer-safe summary: names, variants and quantities only. Never personalisation or address. */
export function summarise(o: Order) {
  return {
    ref: o.ref,
    status: o.status,
    createdAt: o.createdAt,
    paidAt: o.paidAt,
    hasPhysical: o.hasPhysical,
    totalPence: o.totalPence,
    shippingPence: o.shippingPence,
    lines: o.lines.map((l) => {
      const p = products.find((x) => x.slug === l.slug);
      const v = p?.variants.find((x) => x.id === l.variantId);
      return { name: p?.name ?? l.slug, variant: v?.label ?? l.variantId, qty: l.qty };
    }),
  };
}
