import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { Scene3D } from "@/components/three/Scene3D";
import { projects } from "@/data/work";

const N = projects.length;
const pad = (n: number) => String(n).padStart(2, "0");

/** The same browser frame as the original carousel: shown first, and kept if 3D is unavailable. */
function WorkPoster({ index }: { index: number }) {
  const p = projects[index];
  return (
    <div className="flex h-full items-center justify-center px-4 sm:px-6">
      <div className="relative w-full max-w-2xl">
        <div className="overflow-hidden rounded-xl border-2 border-border bg-card sm:rounded-2xl">
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2 sm:px-4 sm:py-3">
            <div className="flex gap-1 sm:gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground/30 sm:h-3 sm:w-3" />
              ))}
            </div>
            <div className="mx-2 flex h-5 flex-1 items-center rounded-md border border-border bg-background px-2 sm:mx-4 sm:h-6 sm:rounded-lg sm:px-3">
              <span className="truncate text-[10px] text-muted-foreground sm:text-xs">{p.domain}</span>
            </div>
          </div>
          <img src={p.img.t} width={800} height={500} alt="" className="aspect-[16/10] w-full object-cover object-top" decoding="async" />
        </div>
      </div>
    </div>
  );
}

export function WorkShowcase({ id = "work" }: { id?: string }) {
  const [index, setIndex] = useState(0);
  const drag = useRef(0);
  const wake = useRef<(() => void) | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const project = projects[index];

  const go = useCallback((n: number) => setIndex(((n % N) + N) % N), []);

  // Drag, flick, trackpad swipe and keys. Vertical page scroll is left to the browser (touch-action: pan-y).
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
    let wheelAcc = 0;
    let wheelLock = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true;
      moved = false;
      startX = lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
      unit = Math.max(260, el.clientWidth * 0.3);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* pointer already released */
        }
      }
      if (!moved) return;
      const now = performance.now();
      vel = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      drag.current = dx / unit;
      wake.current?.();
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (moved) {
        // A drag moves roughly as far as it travelled; a flick adds at most one more, never a long jump
        const delta = Math.max(-2, Math.min(2, Math.round(-drag.current - Math.max(-1, Math.min(1, vel * 0.3)))));
        setIndex((i) => (((i + delta) % N) + N) % N);
      }
      drag.current = 0;
      wake.current?.();
    };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "ArrowRight") setIndex((i) => (i + 1) % N);
      else if (k === "ArrowLeft") setIndex((i) => (i - 1 + N) % N);
      else if (k === "Home") setIndex(0);
      else if (k === "End") setIndex(N - 1);
      else return;
      e.preventDefault();
    };
    // Horizontal trackpad swipes step through projects; vertical scrolling is never intercepted
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now < wheelLock) return;
      wheelAcc += e.deltaX;
      if (Math.abs(wheelAcc) > 70) {
        setIndex((i) => (((i + (wheelAcc > 0 ? 1 : -1)) % N) + N) % N);
        wheelAcc = 0;
        wheelLock = now + 420;
      }
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("keydown", onKey);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <section id={id} className="relative overflow-hidden py-8 sm:py-12 md:py-16" aria-labelledby="work-title">
      <div className="content-width">
        <motion.div
          className="bordered-section relative mb-5 p-3 sm:mb-8 sm:p-5 md:p-6"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <DottedGrid className="opacity-20" spacing={20} />
          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <span className="badge-primary mb-2 inline-block text-[9px] sm:mb-3 sm:text-xs">Our Work</span>
              <h2 id="work-title" className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                Websites that <span className="text-primary">deliver</span>
              </h2>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative">
      <div
        ref={stage}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Project captures. Drag, swipe, or use the arrow keys to browse."
        className="relative cursor-grab touch-pan-y select-none rounded-sm outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <Scene3D
          scene="work"
          sceneProps={{ index, drag, onPick: go, wake }}
          label={`Browser and phone captures of ${project.name}, project ${index + 1} of ${N}`}
          className="h-[min(54svh,400px)] w-full sm:h-[440px] lg:h-[540px]"
          poster={<WorkPoster index={index} />}
        />
      </div>
      {(
        [
          ["Previous project", index - 1, ChevronLeft, "left-2 sm:left-5"],
          ["Next project", index + 1, ChevronRight, "right-2 sm:right-5"],
        ] as const
      ).map(([label, to, Icon, pos]) => (
        <button key={label} type="button" onClick={() => go(to)} aria-label={label} className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/85 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-background sm:h-12 sm:w-12 ${pos}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </button>
      ))}
      </div>

      <div className="content-width">
        <motion.div
          key={project.slug}
          className="mt-4 flex flex-col gap-4 px-1 sm:mt-6 sm:flex-row sm:items-end sm:justify-between sm:px-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="max-w-2xl" aria-live="polite">
            <p className="mb-1 text-xs text-muted-foreground nums">
              {pad(index + 1)} / {pad(N)}
            </p>
            <h3 className="mb-1 text-lg font-bold sm:text-xl">{project.name}</h3>
            <p className="text-sm text-muted-foreground sm:text-base">
              {project.sector} · {project.place}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
          </div>
        </motion.div>

        <div className="mt-3 flex justify-center sm:mt-6" role="tablist" aria-label="Choose a project">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={p.name}
              onClick={() => go(i)}
              className="flex min-h-[44px] min-w-[36px] items-center justify-center"
            >
              <span
                className={`block h-1.5 rounded-full border transition-all duration-300 sm:h-2 ${
                  i === index
                    ? "w-5 border-primary bg-primary sm:w-6"
                    : "w-1.5 border-transparent bg-muted-foreground/30 hover:bg-muted-foreground/50 sm:w-2"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
