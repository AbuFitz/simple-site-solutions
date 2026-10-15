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
 * Our work as a 3D stack. Scrolling pulls each site forward out of the depth, then past you.
 * One pinned track; a single custom property (--p) is written on scroll and CSS does the rest.
 * Reduced motion gets a plain list. "View more" is the last card in the stack.
 */
export function WorkRack() {
  const track = useRef<HTMLDivElement>(null);
  const list = picks.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
  const n = list.length + 1;

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / span));
      el.style.setProperty("--p", (p * (n - 1)).toFixed(3));
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
  }, [n]);

  return (
    <section className="hm-rack" data-tone="dark" aria-labelledby="rack-title">
      <div ref={track} className="hm-rack__track" style={{ ["--n" as string]: n }}>
        <div className="hm-rack__stick">
          <div className="hm-rack__head">
            <h2 id="rack-title">Our work</h2>
            <Link to="/work" className="hm-rack__more">View more &#8594;</Link>
          </div>
          <ul className="hm-rack__stage">
            {list.map((p, i) => {
              const c = caps[p.slug];
              return (
                <li key={p.slug} style={{ ["--i" as string]: i }}>
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
            <li style={{ ["--i" as string]: list.length }}>
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
