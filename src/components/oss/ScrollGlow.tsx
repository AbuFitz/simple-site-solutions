import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** Pages with their own moving background, or where a glow over the content would get in the way. */
const OFF = [/^\/start/, /^\/onboard/, /^\/checkout\//, /^\/__tpl/];

/**
 * A soft green light that wakes up once you scroll past the first screen and then follows the scroll,
 * drifting down and sideways. It sits over the page with "screen" blending, so it glows on dark areas
 * and disappears on light ones, and it never takes clicks.
 */
export function ScrollGlow() {
  const { pathname } = useLocation();
  const el = useRef<HTMLDivElement>(null);
  const off = OFF.some((r) => r.test(pathname));

  useEffect(() => {
    const node = el.current;
    if (!node || off || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const wake = Math.max(0, Math.min(1, (y - vh * 0.55) / (vh * 0.7)));
      const span = Math.max(1, document.documentElement.scrollHeight - vh);
      node.style.setProperty("--wake", wake.toFixed(3));
      node.style.setProperty("--gx", `${(50 + Math.sin(y / 520) * 34).toFixed(1)}%`);
      node.style.setProperty("--gy", `${(18 + (y / span) * 64).toFixed(1)}%`);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [off, pathname]);

  if (off) return null;
  return <div ref={el} className="scroll-glow" aria-hidden="true" />;
}
