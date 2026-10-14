import { useEffect, useState } from "react";

export type SkuStatus = "available" | "sold-out" | "unavailable";
export interface ShopStatus {
  open: boolean;
  skus: Record<string, SkuStatus>;
}
export type ShopStatusState = { state: "loading" } | { state: "error" } | ({ state: "ready" } & ShopStatus);

let cached: Promise<ShopStatus | null> | null = null;

/** One request per page load. Any failure is treated as "not available": we never guess that ordering is open. */
export function fetchShopStatus(force = false): Promise<ShopStatus | null> {
  if (cached && !force) return cached;
  cached = fetch("/api/shop-status")
    .then(async (r) => {
      if (!r.ok) return null;
      const j = (await r.json()) as Partial<ShopStatus>;
      if (typeof j.open !== "boolean" || typeof j.skus !== "object" || j.skus === null) return null;
      return { open: j.open, skus: j.skus as Record<string, SkuStatus> };
    })
    .catch(() => null);
  return cached;
}

export const _resetShopStatus = () => {
  cached = null;
};

export function useShopStatus(): ShopStatusState {
  const [s, setS] = useState<ShopStatusState>({ state: "loading" });
  useEffect(() => {
    let live = true;
    fetchShopStatus().then((r) => {
      if (live) setS(r ? { state: "ready", ...r } : { state: "error" });
    });
    return () => {
      live = false;
    };
  }, []);
  return s;
}

export function statusOf(s: ShopStatusState, slug: string, variantId: string): SkuStatus | "unknown" {
  if (s.state !== "ready") return "unknown";
  return s.skus[`${slug}:${variantId}`] ?? "unavailable";
}

export const anyAvailable = (s: ShopStatusState) => s.state === "ready" && s.open && Object.values(s.skus).some((v) => v === "available");
