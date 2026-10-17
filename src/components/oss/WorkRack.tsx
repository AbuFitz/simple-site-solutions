import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/data/work";
import { hd, shots } from "@/assets/redesign";

const picks = ["true-to-detail", "brightlearn-tutoring", "readysold", "fixnow-mechanics", "fixnow-shop", "stonebridge", "arf-mods"];
const desktop: Record<string, string> = { "true-to-detail": shots.ttdHero, "brightlearn-tutoring": shots.blHero };
const HOLD_MS = 4500;

/**
 * Our work as a 3D coverflow. The live site sits large in the middle and the neighbouring sites angle away on either side and run off the edges of the screen. It turns by itself;
 * people can take over with the arrows, dots, a drag or swipe, a sideways trackpad scroll or the arrow keys.
 * Tap the middle one to open it, tap a side one to bring it forward. It is an ordinary section, so normal
 * vertical scrolling passes straight over it. Reduced motion swaps sites instantly instead of animating.
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

  const wrap = useCallback((d: number) => ((((d + n / 2) % n) + n) % n) - n / 2, [n]);

  const paint = useCallback(() => {
    const el = ring.current;
    if (!el) return;
    const { pos } = state.current;
    (Array.from(el.children) as HTMLElement[]).forEach((li, i) => li.style.setProperty("--d", wrap(i - pos).toFixed(3)));
  }, [wrap]);

  const frame = useCallback(() => {
    const s = state.current;
    s.raf = 0;
    if (s.drag) return;
    s.pos += (s.target - s.pos) * 0.1;
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
  const hold = useCallback((ms = 2500) => {
    state.current.paused = true;
    window.setTimeout(() => (state.current.paused = false), ms);
  }, []);

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
    // Sideways scroll (trackpad swipe, shift-wheel) turns it. Plain vertical scrolling is left alone.
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      const dx = e.shiftKey && Math.abs(e.deltaX) < 1 ? e.deltaY : e.deltaX;
      if (Math.abs(dx) < 12 || (!e.shiftKey && Math.abs(dx) < Math.abs(e.deltaY))) return;
      e.preventDefault();
      hold();
      const now = performance.now();
      if (now - lastWheel < 420) return;
      lastWheel = now;
      step(dx > 0 ? 1 : -1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    const timer = window.setInterval(() => {
      if (!reduced.current && !s.paused && s.visible && !s.drag && !document.hidden) step(1);
    }, HOLD_MS);
    return () => {
      window.clearInterval(timer);
      el.removeEventListener("wheel", onWheel);
      io.disconnect();
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, [paint, step, hold]);

  // Drag or swipe: the row follows the pointer, then settles on the nearest site.
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
      const per = Math.max(220, (stage.current?.clientWidth ?? 800) * 0.4);
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
    hold(3000);
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
        onPointerEnter={(e) => e.pointerType === "mouse" && (state.current.paused = true)}
        onPointerLeave={() => !state.current.drag && (state.current.paused = false)}
        onFocus={() => (state.current.paused = true)}
        onBlur={() => (state.current.paused = false)}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <ul ref={ring} className="hm-rack__ring">
          {list.map((p, i) => (
            <li key={p.slug} style={{ ["--d" as string]: wrap(i) }} aria-hidden={i !== active}>
              <Link
                to={`/work/${p.slug}`}
                tabIndex={i === active ? 0 : -1}
                className="hm-win"
                draggable={false}
                onClick={(e) => {
                  e.preventDefault();
                  if (state.current.drag?.moved) return;
                  if (i === active) navigate(`/work/${p.slug}`);
                  else goTo(Math.round(state.current.target) + Math.round(wrap(i - Math.round(state.current.target))));
                }}
              >
                <span className="hm-win__bar" aria-hidden="true">
                  <i /><i /><i />
                  <em>{p.domain}</em>
                </span>
                <span className="hm-win__shot">
                  <img src={desktop[p.slug] ?? hd[p.slug]?.[0] ?? p.img.d} alt={`${p.name} website`} width={1600} height={900} loading="lazy" decoding="async" draggable={false} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <button type="button" className="hm-rack__arrow hm-rack__arrow--l" onClick={() => { hold(); step(-1); }} aria-label="Previous project"><ChevronLeft aria-hidden="true" /></button>
        <button type="button" className="hm-rack__arrow hm-rack__arrow--r" onClick={() => { hold(); step(1); }} aria-label="Next project"><ChevronRight aria-hidden="true" /></button>
      </div>

      <div className="hm-rack__foot">
        <div className="hm-rack__now" aria-live="polite">
          <small>{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} · {cur.label ?? cur.sector}</small>
          <Link to={`/work/${cur.slug}`}>
            <b key={cur.slug}>{cur.name}</b>
            <span>{cur.line[0]}, {cur.line[1]}</span>
          </Link>
        </div>
        <div className="hm-rack__dots" role="group" aria-label="Choose a project">
          {list.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-label={p.name}
              aria-current={i === active ? "true" : undefined}
              onClick={() => {
                hold();
                const cur0 = Math.round(state.current.target);
                goTo(cur0 + Math.round(wrap(i - cur0)));
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
