import { useEffect, useState } from "react";

/**
 * Types a word, holds it, deletes it, and moves to the next, with a caret.
 * The first word is the accessible text; reduced-motion users get it still.
 */
export function TypeRotate({ words, className }: { words: string[]; className?: string }) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(words[0].length);
  const [dir, setDir] = useState<"hold" | "del" | "type">("hold");
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setLive(true), 2600);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!live) return;
    let t: number;
    const w = words[i];
    if (dir === "hold") t = window.setTimeout(() => setDir("del"), 1900);
    else if (dir === "del") {
      if (n > 0) t = window.setTimeout(() => setN(n - 1), 42);
      else {
        setI((i + 1) % words.length);
        setDir("type");
      }
    } else if (n < w.length) t = window.setTimeout(() => setN(n + 1), 95);
    else setDir("hold");
    return () => window.clearTimeout(t);
  }, [live, dir, n, i, words]);

  return (
    <span className={className}>
      <span className="sr-only">{words[0]}</span>
      <span aria-hidden="true">
        {words[i].slice(0, n)}
        <i className="hm-caret" />
      </span>
    </span>
  );
}
