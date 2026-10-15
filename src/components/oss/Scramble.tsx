import { createElement, useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

/**
 * Text that decodes itself: characters resolve left to right out of random glyphs, once, when it scrolls into view.
 * Screen readers get the real text from the start; reduced-motion users see it already resolved.
 * `hover` replays it when the pointer enters the nearest parent with data-scramble-host.
 */
export function Scramble({ text, as = "span", delay = 0, hover = false, className }: { text: string; as?: "span" | "b"; delay?: number; hover?: boolean; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [out, setOut] = useState(text);
  const timer = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let started = false;
    const run = () => {
      cancelAnimationFrame(timer.current);
      const t0 = performance.now() + delay;
      const dur = 380 + text.length * 34;
      const tick = (now: number) => {
        const p = Math.max(0, Math.min(1, (now - t0) / dur));
        const keep = Math.floor(p * text.length);
        setOut(
          text
            .split("")
            .map((c, i) => (c === " " || i < keep ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join(""),
        );
        if (p < 1) timer.current = requestAnimationFrame(tick);
        else setOut(text);
      };
      timer.current = requestAnimationFrame(tick);
    };
    setOut(text.replace(/[^ ]/g, " "));
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting && !started) {
          started = true;
          run();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    const host = hover ? el.closest("[data-scramble-host]") : null;
    host?.addEventListener("mouseenter", run);
    return () => {
      io.disconnect();
      host?.removeEventListener("mouseenter", run);
      cancelAnimationFrame(timer.current);
    };
  }, [text, delay, hover]);

  return createElement(as, { ref, className }, <span className="sr-only">{text} </span>, <span aria-hidden="true">{out}</span>);
}
