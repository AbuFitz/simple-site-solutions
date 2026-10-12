/** Capability detection for the 3D layer. Pure functions, safe to call during render in the browser. */

export type Quality = "high" | "low" | "off";

let webglCache: boolean | null = null;

export function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function getQuality(): Quality {
  if (typeof window === "undefined") return "off";
  const params = new URLSearchParams(window.location.search);
  if (params.get("3d") === "0") return "off";
  if (!hasWebGL()) return "off";
  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return "off";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 820;
  const weak = (nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2;
  if (params.get("3d") === "low" || coarse || narrow || weak) return "low";
  return "high";
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
