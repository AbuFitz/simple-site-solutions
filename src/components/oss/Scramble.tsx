import { Fragment, createElement, useEffect, useRef, useState } from "react";

/**
 * Text that rises into place: each word slides up out of a mask with a short stagger, once, when it scrolls into view.
 * Same footprint before and after (no jumping letters). Screen readers get plain text; reduced motion shows it at once.
 * (File name kept so existing imports keep working.)
 */
export function Scramble({ text, as = "span", delay = 0, className }: { text: string; as?: "span" | "b"; delay?: number; hover?: boolean; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");
  return createElement(
    as,
    { ref, className: `oss-rise${shown ? " is-in" : ""}${className ? ` ${className}` : ""}` },
    <span className="sr-only">{text}</span>,
    <span aria-hidden="true">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="oss-rise__w">
            <span className="oss-rise__i" style={{ transitionDelay: `${delay + i * 70}ms` }}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>,
  );
}
