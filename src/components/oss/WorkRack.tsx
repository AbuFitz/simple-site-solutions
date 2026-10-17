import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects } from "@/data/work";
import { hd, shots } from "@/assets/redesign";

const picks = ["true-to-detail", "brightlearn-tutoring", "readysold", "fixnow-mechanics", "stonebridge", "arf-mods"];
const covers: Record<string, string> = {
  "true-to-detail": shots.ttdHero,
  "brightlearn-tutoring": shots.blHero,
};
const HOLD_MS = 4200;

/**
 * Our work as a 3D ring. Browser windows stand around a drum that turns by itself, one site at a time.
 * Drag or swipe to turn it, use the arrows or arrow keys, or click a side window to bring it round.
 * It is an ordinary section, so the page scrolls straight past it. Reduced motion turns the drum
 * instantly instead of animating.
 */
export function WorkRack() {
  const navigate = useNavigate();
  const list = picks.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
  const n = list.length;
  const ring = useRef<HTMLUListElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const state = useRef({ pos: 0, target: 0, raf: 0, paused: false, visible: false, drag: null as null | { x: number; pos: number; moved: boolean } });
  const reduced = useRef(false);

  const wrap = (d: number) => ((((d + n / 2) % n) + n) % n) - n / 2;

  const paint = useCallback(() => {
    const el = ring.current;
    if (!el) return;
    const { pos } = state.current;
    el.style.setProperty("--pos", pos.toFixed(4));
    (Array.from(el.children) as HTMLElement[]).forEach((li, i) => li.style.setProperty("--d", wrap(i - pos).toFixed(3)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const frame = useCallback(() => {
    const s = state.current;
    s.raf = 0;
    if (s.drag) return;
    s.pos += (s.target - s.pos) * 0.085;
    if (Math.abs(s.target - s.pos) < 0.0015) s.pos = s.target;
    paint();
    if (s.pos !== s.target) s.raf = requestAnimationFrame(frame);
  }, [paint]);

  const goTo = useCallback(
    (t: number) => {
      const s = state.current;
      s.target = t;
      setActive(((Math.round(t) % n) + n) % n);
      if (reduced.current) {
        s.pos = t;
        paint();
      } else if (!s.raf) s.raf = requestAnimationFrame(frame);
    },
    [frame, n, paint],
  );
  const step = useCallback((d: number) => goTo(Math.round(state.current.target) + d), [goTo]);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    paint();
    const el = stage.current;
    if (!el) return;
    const s = state.current;
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
    }, { threshold: 0.35 });
    io.observe(el);
    const timer = window.setInterval(() => {
      if (!reduced.current && !s.paused && s.visible && !s.drag && !document.hidden) step(1);
    }, HOLD_MS);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, [paint, step]);

  // Drag or swipe: the drum follows the pointer, then settles on the nearest window.
  const onDown = (e: React.PointerEvent) => {
    const s = state.current;
    s.drag = { x: e.clientX, pos: s.pos, moved: false };
    s.paused = true;
  };
  const onMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.drag) return;
    const dx = e.clientX - s.drag.x;
    if (Math.abs(dx) > 6 && !s.drag.moved) {
      s.drag.moved = true;
      stage.current?.setPointerCapture(e.pointerId);
    }
    if (s.drag.moved) {
      const per = Math.max(240, (stage.current?.clientWidth ?? 800) * 0.42);
      s.pos = s.drag.pos - dx / per;
      s.target = s.pos;
      paint();
    }
  };
  const onUp = () => {
    const s = state.current;
    const moved = s.drag?.moved;
    s.drag = null;
    if (moved) goTo(Math.round(s.pos));
    window.setTimeout(() => {
      state.current.paused = false;
    }, 1500);
  };

  const cur = list[active];

  return (
    <section className="hm-rack" data-tone="dark" aria-labelledby="rack-title">
      <div className="hm-rack__head">
        <h2 id="rack-title">Our work</h2>
        <Link to="/work" className="hm-rack__more">View all work &#8594;</Link>
      </div>

      <div
        ref={stage}
        className="hm-rack__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="Selected work"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onPointerEnter={() => (state.current.paused = true)}
        onPointerLeave={() => !state.current.drag && (state.current.paused = false)}
        onFocus={() => (state.current.paused = true)}
        onBlur={() => (state.current.paused = false)}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="hm-rack__floor" aria-hidden="true" />
        <ul ref={ring} className="hm-rack__ring" style={{ ["--n" as string]: n }}>
          {list.map((p, i) => (
            <li key={p.slug} style={{ ["--i" as string]: i, ["--d" as string]: wrap(i) }} aria-hidden={i !== active}>
              <Link
                to={`/work/${p.slug}`}
                tabIndex={i === active ? 0 : -1}
                className="hm-win"
                draggable={false}
                onClick={(e) => {
                  if (state.current.drag?.moved) return e.preventDefault();
                  if (i !== active) {
                    e.preventDefault();
                    // Turn the shortest way round to this window.
                    goTo(Math.round(state.current.target) + Math.round(wrap(i - Math.round(state.current.target))));
                  } else navigate(`/work/${p.slug}`);
                  e.preventDefault();
                }}
              >
                <span className="hm-win__bar" aria-hidden="true">
                  <i /><i /><i />
                  <em>{p.domain}</em>
                </span>
                <span className="hm-win__shot">
                  <img src={covers[p.slug] ?? hd[p.slug]?.[0] ?? p.img.d} alt={`${p.name} website`} width={1600} height={900} loading="lazy" decoding="async" draggable={false} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="hm-rack__foot">
        <div className="hm-rack__now" aria-live="polite">
          <small>{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} · {cur.label ?? cur.sector}</small>
          <Link to={`/work/${cur.slug}`}>
            <b key={cur.slug}>{cur.name}</b>
            <span>{cur.line[0]}, {cur.line[1]}</span>
          </Link>
        </div>
        <div className="hm-rack__ctl">
          <button type="button" onClick={() => step(-1)} aria-label="Previous project"><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => step(1)} aria-label="Next project"><ArrowRight aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
