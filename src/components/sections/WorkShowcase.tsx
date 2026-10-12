import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Scene3D } from "@/components/three/Scene3D";
import { projects } from "@/data/work";

const N = projects.length;
const pad = (n: number) => String(n).padStart(2, "0");

/** Poster shown before 3D, or instead of it: a calm 2D stack of the active project's captures. */
function WorkPoster({ index }: { index: number }) {
  const p = projects[index];
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="relative w-full max-w-3xl">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]">
          <div className="flex items-center gap-1.5 border-b border-border bg-secondary px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            <span className="mono ml-3 truncate text-[10px] text-muted-foreground">{p.domain}</span>
          </div>
          <img src={p.img.t} alt="" className="aspect-[16/10] w-full object-cover object-top" loading="lazy" />
        </div>
        <img
          src={p.img.m}
          alt=""
          className="absolute -bottom-6 -right-2 hidden w-[22%] rounded-2xl border border-border object-cover shadow-xl sm:block"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export function WorkShowcase({ id = "work" }: { id?: string }) {
  const [index, setIndex] = useState(0);
  const drag = useRef(0);
  const stage = useRef<HTMLDivElement>(null);
  const live = useRef<HTMLParagraphElement>(null);

  const go = useCallback((n: number) => setIndex((((n % N) + N) % N)), []);
  const project = projects[index];

  // Horizontal drag on the stage, with vertical page scroll left to the browser (touch-action: pan-y)
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let startX = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;
    let down = false;
    let moved = false;
    let unit = 520;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true;
      moved = false;
      startX = lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
      unit = Math.max(280, el.clientWidth * 0.34);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* pointer already gone */
        }
      }
      if (!moved) return;
      const now = performance.now();
      vel = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      drag.current = dx / unit;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (moved) {
        const flick = -vel * 0.9;
        const delta = Math.round(-drag.current + flick);
        setIndex((i) => (((i + delta) % N) + N) % N);
      }
      drag.current = 0;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setIndex((i) => (i + 1) % N);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => (i - 1 + N) % N);
      }
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <section id={id} className="chapter chapter-paper chapter-sheet" aria-labelledby="work-title">
      <div className="content-width pb-10 pt-16 sm:pt-20 md:pb-14 md:pt-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
                        <h2 id="work-title" className="text-headline max-w-3xl">
              Websites that <span className="text-signal">deliver</span>
            </h2>
          </div>
        </div>
      </div>

      {/* The rack */}
      <div
        ref={stage}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Project captures. Use the arrow keys, drag, or the buttons to browse."
        className="relative cursor-grab touch-pan-y select-none outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Scene3D
          scene="work"
          sceneProps={{ index, drag, onPick: go }}
          label={`Browser and phone captures of ${project.name}, one of ${N} projects`}
          className="h-[min(58svh,460px)] w-full sm:h-[min(64vh,600px)] lg:h-[min(70vh,680px)]"
          poster={<WorkPoster index={index} />}
        />
      </div>

      {/* Info + controls */}
      <div className="content-width pb-16 pt-6 md:pb-24 md:pt-8">
        <div className="grid items-end gap-6 md:grid-cols-12">
          <motion.div
            key={project.slug}
            className="md:col-span-7"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mono mb-2 text-[11px] tracking-[0.14em] text-muted-foreground">
              {pad(index + 1)} / {pad(N)} · {project.kind}
            </p>
            <h3 className="font-display text-3xl font-bold sm:text-4xl" style={{ letterSpacing: "-0.04em" }}>
              {project.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {project.sector} · {project.place}
            </p>
            <p ref={live} aria-live="polite" className="mt-3 max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">
              {project.summary}
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end">
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-primary btn-md gap-2">
                Visit site
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-5">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose a project">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={p.name}
                onClick={() => go(i)}
                className="group flex h-8 items-center px-0.5"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-7 bg-primary" : "w-1.5 bg-foreground/25 group-hover:bg-foreground/50"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(index - 1)} className="btn-outline h-11 w-11 !p-0" aria-label="Previous project">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go(index + 1)} className="btn-outline h-11 w-11 !p-0" aria-label="Next project">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
