import { motion } from "framer-motion";
import { Scene3D } from "@/components/three/Scene3D";
import { whyUs } from "@/data/process";
import { ChapterStage } from "./ChapterStage";
import { PagePoster } from "./PagePoster";

const captions = [
  "Six proven blocks snap into one layout",
  "A build that runs on a clock, not a calendar",
  "The mess falls into one straight line",
  "The whole page folds into a phone",
];

export function WhyUs() {
  return (
    <section className="chapter chapter-sheet bg-background" aria-labelledby="why-title">
      <div className="content-width pb-6 pt-16 sm:pt-20 md:pt-28 lg:pb-0">
        <p className="eyebrow mb-4 flex items-center gap-3">
          <span className="mono text-signal">02</span>
          <span className="h-px w-8 bg-foreground/30" />
          Why us
        </p>
        <h2 id="why-title" className="text-headline max-w-3xl">
          Built from what <span className="text-signal">already works</span>
        </h2>
      </div>

      <div className="content-width">
        <ChapterStage
          count={whyUs.length}
          stageClassName="h-[42svh] lg:h-screen -mx-5 sm:-mx-8 md:-mx-12 lg:mx-0"
          chapterClassName="min-h-[46svh] lg:min-h-[78vh]"
          stage={(chapter) => (
            <Scene3D
              scene="core"
              sceneProps={{ chapter }}
              label="One page, rearranging itself: into a grid of proven layouts, a ring for the build timeline, a straight line for no drama, and finally a phone."
              className="h-full w-full"
              poster={<PagePoster />}
            />
          )}
          chapters={(active) =>
            whyUs.map((w, i) => (
              <motion.article
                key={w.number}
                className="slab w-full p-6 transition-colors duration-500 sm:p-8"
                style={{ borderColor: active === i ? "hsl(var(--primary) / 0.6)" : undefined, opacity: active === i ? 1 : 0.55 }}
                aria-current={active === i ? "step" : undefined}
              >
                <p className="mono text-[11px] tracking-[0.14em] text-signal">{w.number}</p>
                <h3 className="mt-3 font-display text-3xl font-bold sm:text-4xl" style={{ letterSpacing: "-0.04em" }}>
                  {w.title}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">{w.description}</p>
                <p className="mono mt-6 border-t border-border pt-4 text-[11px] tracking-wide text-muted-foreground">{captions[i]}</p>
              </motion.article>
            ))
          }
        />
      </div>
      <div className="h-10 lg:h-20" />
    </section>
  );
}
