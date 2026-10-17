import { useEffect } from "react";

/** Anything that behaves like a button. */
const PRESSABLE = 'button, [role="button"], [role="radio"], a[class*="btn"], a.pkx-go, a.hm-link, .oss-bar a';

/**
 * Remembers where a button was pressed so the CSS can grow a soft green gradient from that point.
 * The look itself lives in oss-extra.css (.press-glow rules); this only records the pointer position.
 */
export function PressGlow() {
  useEffect(() => {
    const down = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(PRESSABLE);
      if (!el || (el as HTMLButtonElement).disabled) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", `${Math.round(e.clientX - r.left)}px`);
      el.style.setProperty("--py", `${Math.round(e.clientY - r.top)}px`);
    };
    document.addEventListener("pointerdown", down, { passive: true });
    return () => document.removeEventListener("pointerdown", down);
  }, []);
  return null;
}
