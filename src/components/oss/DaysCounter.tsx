import { useEffect, useRef, useState } from "react";

const stages = [
  { from: 0, label: "Day 0", text: "Your brief and content are with us. The clock starts." },
  { from: 1, label: "Building", text: "Planned for your kind of business, built around your details." },
  { from: 5, label: "The Starter", text: "Up to 3 pages. Estimated launch from day 5 to day 7." },
  { from: 7, label: "The Sorted", text: "Up to 6 pages. Estimated launch from day 7 to day 10." },
  { from: 10, label: "The Works", text: "Up to 10 pages. Estimated launch from day 10 to day 14." },
];
const bars = [
  { name: "The Starter", a: 5, b: 7 },
  { name: "The Sorted", a: 7, b: 10 },
  { name: "The Works", a: 10, b: 14 },
];

/** A pinned counter: scroll runs the day count from 0 to 14, and the package whose estimate you have reached lights up. */
export function DaysCounter() {
  const track = useRef<HTMLDivElement>(null);
  const [day, setDay] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / (r.height - window.innerHeight)));
      setDay(Math.round(p * 14));
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
  }, []);

  const shown = still ? 14 : day;
  const stage = [...stages].reverse().find((s) => shown >= s.from) ?? stages[0];

  return (
    <section ref={track} className={`hm-days${still ? " is-still" : ""}`} data-tone="dark" aria-labelledby="days-title">
      <div className="hm-days__stick">
        <h2 id="days-title" className="hm-days__title">From brief to live site</h2>
        <div className="hm-days__num" aria-hidden="true">
          <span key={shown} className="hm-days__tick">{String(shown).padStart(2, "0")}</span>
          <small>days</small>
        </div>
        <p className="hm-days__stage" aria-live="off">
          <b>{stage.label}</b>
          {stage.text}
        </p>
        <ul className="hm-days__bars" aria-label="Estimated delivery by package">
          {bars.map((b) => (
            <li key={b.name} data-on={shown >= b.a} data-done={shown >= b.b}>
              <span>{b.name}</span>
              <i style={{ ["--a" as string]: b.a / 14, ["--b" as string]: b.b / 14, ["--f" as string]: Math.max(0, Math.min(1, (shown - b.a) / (b.b - b.a))) }} />
              <em>{b.a} to {b.b} days</em>
            </li>
          ))}
        </ul>
        <p className="hm-days__note">Estimates, counted from when we have your content. Late content moves the date.</p>
      </div>
    </section>
  );
}
