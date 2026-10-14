import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  /** How long each word stays before the next one replaces it, in ms. */
  pauseDuration?: number;
  /** Kept for compatibility with the old typing effect; no longer used. */
  speed?: number;
  deleteSpeed?: number;
}

/**
 * Rotates through words with a short fade and slide. The longest word is rendered invisibly so the
 * heading never changes width or height, and with reduced motion the first word simply stays.
 */
export function TypewriterText({ texts, className = "", pauseDuration = 2600 }: TypewriterTextProps) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || texts.length < 2) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % texts.length), pauseDuration);
    return () => window.clearInterval(id);
  }, [reduce, texts.length, pauseDuration]);

  return (
    <span className={`relative inline-grid ${className}`}>
      <span className="sr-only">{texts[0]}</span>
      {/* Every word is laid out invisibly in the same cell, so the box is as wide as the widest one. */}
      {texts.map((t) => (
        <span key={t} className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden="true">{t}</span>
      ))}
      <span className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={texts[i]} className="absolute left-0 top-0 whitespace-nowrap" initial={{ y: "70%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-70%", opacity: 0 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
            {texts[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
