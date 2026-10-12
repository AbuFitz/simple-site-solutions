import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { Scene3D } from "@/components/three/Scene3D";
import { PagePoster } from "./PagePoster";

const typewriterWords = ["converts.", "performs.", "delivers.", "works."];
const trustItems = ["5-10 Day Delivery", "Proven Layouts", "Satisfaction Guarantee", "No Endless Meetings"];
const sectors = [
  "Plumbers",
  "Electricians",
  "Mechanics",
  "Cleaners",
  "Barbers & Salons",
  "Tutors",
  "Small Shops",
  "Builders & Trades",
];

function SectorMarquee() {
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {sectors.map((s) => (
        <li key={s} className="flex items-center gap-10">
          <span className="font-display text-xl font-semibold tracking-tight text-foreground/70 sm:text-2xl" style={{ letterSpacing: "-0.03em" }}>
            {s}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative overflow-hidden border-t border-border/70 py-5" role="group" aria-label="Types of business we build for">
      <div className="flex w-max animate-marquee">
        {row()}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <section ref={ref} className="chapter relative overflow-hidden bg-background" aria-labelledby="hero-title">
      {/* Blueprint grid, fading out from the 3D stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border) / 0.55) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.55) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 80% at 72% 40%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 72% 40%, black, transparent 75%)",
        }}
      />

      <div className="relative min-h-[100svh] lg:flex lg:flex-col">
        <div className="content-width relative z-10 flex w-full flex-1 flex-col justify-center pb-4 pt-[6.5rem] lg:pb-16 lg:pt-32">
          <div className="max-w-[44rem] lg:max-w-[52%]">
            <motion.p
              className="eyebrow mb-5 flex items-center gap-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className="h-px w-8 bg-primary" />
              Websites for Local UK Businesses
            </motion.p>

            <motion.h1
              id="hero-title"
              className="font-display font-extrabold"
              style={{
                fontSize: "clamp(2.9rem, 6.1vw, 6.1rem)",
                letterSpacing: "-0.05em",
                lineHeight: 0.92,
              }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="block">Websites that</span>
              <span className="block text-signal">
                <TypewriterText texts={typewriterWords} speed={120} />
              </span>
              <span className="mt-1 block text-foreground/45">Not just impress.</span>
            </motion.h1>

            <motion.p
              className="text-body-lg mt-6 max-w-lg"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              Fast, proven websites for local businesses using layouts that already work in your industry.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <Link to="/start" className="btn-primary btn-lg w-full gap-2 sm:w-auto">
                Get Started
                <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link to="/packages" className="btn-outline btn-lg w-full sm:w-auto">
                View Pricing
              </Link>
            </motion.div>

            <motion.ul
              className="mt-8 flex flex-wrap gap-x-5 gap-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {trustItems.map((t) => (
                <li key={t} className="mono flex items-center text-[11px] tracking-wide text-muted-foreground">
                  <span className="mr-2 h-1 w-1 rounded-full bg-primary" />
                  {t}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* 3D stage: right half on desktop, below the copy on phones */}
        <Scene3D
          scene="hero"
          sceneProps={{ progress: scrollYProgress }}
          eager
          label="A website assembling itself from six simple parts: navigation, hero, services, work, proof and a call to action."
          className="relative z-0 mt-2 h-[min(68svh,560px)] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[58%]"
          poster={<PagePoster />}
        />
      </div>

      <SectorMarquee />
    </section>
  );
}
