import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useTransform } from "framer-motion";
import { Scene3D } from "@/components/three/Scene3D";
import { steps } from "@/data/process";
import { ChapterStage } from "./ChapterStage";
import { PagePoster } from "./PagePoster";

export function ProcessSection() {
  return (
    <section className="chapter chapter-paper chapter-sheet" aria-labelledby="process-title">
      <div className="content-width pb-6 pt-14 sm:pt-20 md:pt-24 lg:pb-0">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="process-title" className="text-headline max-w-3xl">
              Simple. <span className="text-signal">Straightforward.</span>
            </h2>
          </div>
          <Link to="/how-it-works" className="btn-outline btn-md gap-2 self-start md:self-auto">
            Full process
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="text-body-lg mt-5 max-w-xl">
          No discovery calls. No moodboards. No endless revision cycles. Just a clear process that gets your site live fast.
        </p>
      </div>

      <div className="content-width">
        <ChapterStage
          count={steps.length}
          stageClassName="hidden lg:block lg:h-screen"
          chapterClassName="py-2 lg:min-h-[64vh]"
          stage={(chapter) => (
            <PathStage chapter={chapter} />
          )}
          chapters={(active) =>
            steps.map((s, i) => (
              <article
                key={s.number}
                className="slab w-full p-6 transition-all duration-500 sm:p-8"
                style={{ borderColor: active === i ? "hsl(var(--primary) / 0.6)" : undefined, opacity: active === i ? 1 : 0.55 }}
                aria-current={active === i ? "step" : undefined}
              >
                <div className="flex items-start gap-5">
                  <div className="step-number shrink-0">{s.number}</div>
                  <div>
                    <h3 className="text-2xl font-bold sm:text-3xl">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              </article>
            ))
          }
        />
      </div>
      <div className="h-10 lg:h-20" />
    </section>
  );
}

function PathStage({ chapter }: { chapter: import("framer-motion").MotionValue<number> }) {
  const progress = useTransform(chapter, (c) => Math.min(1, Math.max(0, c / (steps.length - 1))));
  return (
    <Scene3D
      scene="path"
      sceneProps={{ progress }}
      label="A route with five stops: choose a package, send your details, we build, you review, and you go live."
      desktopOnly
      className="h-full w-full"
      poster={<PagePoster tilt={false} />}
    />
  );
}
