import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { Scene3D } from "@/components/three/Scene3D";
import { projects } from "@/data/work";
import { PagePoster } from "./PagePoster";

const typewriterWords = ["converts.", "performs.", "delivers.", "works."];
const facts = ["Prices listed upfront, from £199", "Live in 5-10 days", "UK-based, local SEO included"];
const live = projects.filter((p) => p.url).slice(0, 5);

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <section ref={ref} className="chapter relative overflow-hidden bg-background" aria-labelledby="hero-title">
      <div className="content-width relative z-10 pb-12 pt-28 sm:pt-32 lg:flex lg:min-h-[640px] lg:items-center lg:py-32">
        <div className="max-w-[44rem] lg:max-w-[52%]">
          <motion.h1
            id="hero-title"
            className="text-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block">Websites that</span>
            <span className="block text-primary">
              <TypewriterText texts={typewriterWords} speed={120} />
            </span>
            <span className="block text-foreground/50">Not just impress.</span>
          </motion.h1>

          <p className="text-body-lg mt-5 max-w-lg">
            Fast, proven websites for local businesses using layouts that already work in your industry.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/start" className="btn-primary btn-lg w-full gap-2 sm:w-auto">
              Get Started
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/packages" className="btn-outline btn-lg w-full sm:w-auto">
              View Pricing
            </Link>
          </div>

          <ul className="mt-7 space-y-2">
            {facts.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-border pt-5">
            <p className="mb-2 text-xs text-muted-foreground">Real sites you can visit</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
              {live.map((p) => (
                <li key={p.slug}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                  >
                    {p.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Desktop only: phones get the copy and nothing else */}
      <Scene3D
        scene="hero"
        sceneProps={{ progress: scrollYProgress }}
        eager
        desktopOnly
        label="A website assembling itself from six simple parts: navigation, hero, services, work, proof and a call to action."
        className="absolute inset-y-0 right-0 z-0 hidden w-[52%] lg:block"
        poster={<PagePoster />}
      />
    </section>
  );
}
