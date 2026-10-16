import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { projects } from "@/data/work";
import { shots } from "@/assets/redesign";

const picks = ["true-to-detail", "brightlearn-tutoring", "readysold", "fixnow-mechanics"];
const caps: Record<string, { src: string; pos?: string }> = {
  "true-to-detail": { src: shots.ttdHero },
  "brightlearn-tutoring": { src: shots.blHero },
};

/**
 * Our work as a 3D stack that turns by itself, one site at a time, and loops.
 * It is an ordinary section: the page scrolls past it like any other. Hover or focus pauses it.
 * Each card's depth (--d, signed distance from the front) is written here; CSS does the rest.
 * Reduced motion gets a plain list. "View more" is the last card in the ring.
 */
const HOLD_MS = 3600;

export function WorkRack() {
  const stage = useRef<HTMLUListElement>(null);
  const list = picks.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
  const n = list.length + 1;

  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(el.children) as HTMLElement[];
    const wrap = (d: number) => ((((d + n / 2) % n) + n) % n) - n / 2;
    let pos = 0;
    let target = 0;
    let raf = 0;
    let timer = 0;
    let paused = false;
    let visible = false;
    const paint = () => items.forEach((li, i) => li.style.setProperty("--d", wrap(i - pos).toFixed(3)));
    const frame = () => {
      raf = 0;
      pos += (target - pos) * 0.07;
      if (Math.abs(target - pos) < 0.002) pos = target;
      paint();
      if (pos !== target) raf = requestAnimationFrame(frame);
    };
    const advance = () => {
      if (paused || !visible || document.hidden) return;
      target += 1;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const pause = (v: boolean) => () => {
      paused = v;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    }, { threshold: 0.3 });
    io.observe(el);
    const on = pause(true);
    const off = pause(false);
    el.addEventListener("pointerenter", on);
    el.addEventListener("pointerleave", off);
    el.addEventListener("focusin", on);
    el.addEventListener("focusout", off);
    paint();
    timer = window.setInterval(advance, HOLD_MS);
    return () => {
      window.clearInterval(timer);
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerenter", on);
      el.removeEventListener("pointerleave", off);
      el.removeEventListener("focusin", on);
      el.removeEventListener("focusout", off);
    };
  }, [n]);

  return (
    <section className="hm-rack" data-tone="dark" aria-labelledby="rack-title">
      <div className="hm-rack__track">
        <div className="hm-rack__stick">
          <div className="hm-rack__head">
            <h2 id="rack-title">Our work</h2>
            <Link to="/work" className="hm-rack__more">View more &#8594;</Link>
          </div>
          <ul ref={stage} className="hm-rack__stage">
            {list.map((p, i) => {
              const c = caps[p.slug];
              return (
                <li key={p.slug} style={{ ["--d" as string]: i }}>
                  <Link to={`/work/${p.slug}`} className="hm-card">
                    <span className="hm-card__shot">
                      <img src={c?.src ?? p.img.d} alt={`${p.name} website`} width={1600} height={900} loading="lazy" decoding="async" />
                    </span>
                    <span className="hm-card__cap">
                      <b>{p.name}</b>
                      <i>{p.label ?? p.sector}</i>
                    </span>
                  </Link>
                </li>
              );
            })}
            <li style={{ ["--d" as string]: Math.min(list.length, n / 2 - 0.01) }}>
              <Link to="/work" className="hm-card hm-card--more">
                <span>View more work</span>
                <span aria-hidden="true">&#8594;</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
