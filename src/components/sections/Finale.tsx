import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useScroll } from "framer-motion";
import { Scene3D } from "@/components/three/Scene3D";
import { PagePoster } from "./PagePoster";

interface FinaleProps {
  title?: string;
  highlighted?: string;
  description?: string;
  primaryText?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
}

/** Closing call to action over the "going live" scene. */
export function Finale({
  title = "Let's build something",
  highlighted = "that converts.",
  description = "Pick your package. Send your details. Get a website in days, not months.",
  primaryText = "Start Your Project",
  primaryLink = "/start",
  secondaryText = "See Pricing",
  secondaryLink = "/packages",
}: FinaleProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  return (
    <section ref={ref} className="chapter chapter-sheet overflow-hidden bg-background" aria-labelledby="finale-title">
      <div className="relative min-h-[88svh] lg:min-h-[92vh]">
        <Scene3D
          scene="finale"
          sceneProps={{ progress: scrollYProgress }}
          label="The finished website lifting off a beacon that pulses outward: your site, live."
          className="absolute inset-x-0 top-0 h-[54%] lg:inset-0 lg:left-[28%] lg:h-auto"
          poster={<PagePoster />}
        />
        <div className="content-width relative z-10 flex min-h-[88svh] flex-col justify-end pb-20 pt-24 lg:min-h-[92vh] lg:justify-center lg:pb-24">
          <div className="max-w-xl lg:max-w-[36rem]">
            <p className="eyebrow mb-4 flex items-center gap-3">
              <span className="mono text-signal">05</span>
              <span className="h-px w-8 bg-foreground/30" />
              Ready when you are
            </p>
            <h2 id="finale-title" className="text-headline">
              {title} <span className="text-signal">{highlighted}</span>
            </h2>
            <p className="text-body-lg mt-5 max-w-md">{description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={primaryLink} className="btn-primary btn-lg gap-2">
                {primaryText}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              {secondaryText && secondaryLink && (
                <Link to={secondaryLink} className="btn-outline btn-lg">
                  {secondaryText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
