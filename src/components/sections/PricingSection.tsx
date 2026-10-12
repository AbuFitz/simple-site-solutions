import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Scene3D } from "@/components/three/Scene3D";
import { packages } from "@/data/packages";
import { PagePoster } from "./PagePoster";

export function PricingStage({ selected, onSelect, className = "" }: { selected: number; onSelect: (i: number) => void; className?: string }) {
  return (
    <Scene3D
      scene="towers"
      sceneProps={{ selected, onSelect }}
      label="Three stacks of pages. The Starter is three pages high, The Sorted six, and The Works ten."
      className={className}
      poster={<PagePoster tilt={false} />}
    />
  );
}

export function TierPicker({ selected, onSelect, id }: { selected: number; onSelect: (i: number) => void; id: string }) {
  return (
    <div role="tablist" aria-label="Packages" className="grid grid-cols-3 gap-2">
      {packages.map((p, i) => (
        <button
          key={p.id}
          role="tab"
          id={`${id}-tab-${i}`}
          aria-selected={selected === i}
          aria-controls={`${id}-panel`}
          type="button"
          onClick={() => onSelect(i)}
          className={`rounded-2xl border px-3 py-3 text-left transition-all duration-300 sm:px-4 ${
            selected === i
              ? "border-primary bg-primary/10"
              : "border-border bg-card/60 hover:border-muted-foreground/50"
          }`}
        >
          <span className="mono block text-[10px] tracking-[0.14em] text-muted-foreground">{p.pages} PAGES</span>
          <span className="mt-1 block font-display text-xl font-bold sm:text-2xl" style={{ letterSpacing: "-0.04em" }}>
            £{p.price}
          </span>
          <span className="block truncate text-xs text-muted-foreground">{p.name}</span>
        </button>
      ))}
    </div>
  );
}

export function PricingSection() {
  const [selected, setSelected] = useState(1);
  const pkg = packages[selected];

  return (
    <section className="chapter chapter-sheet bg-background" aria-labelledby="pricing-title">
      <div className="content-width pb-16 pt-16 sm:pt-20 md:pb-24 md:pt-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-4 flex items-center gap-3">
              <span className="mono text-signal">04</span>
              <span className="h-px w-8 bg-foreground/30" />
              Pricing
            </p>
            <h2 id="pricing-title" className="text-headline">
              Simple pricing for <span className="text-signal">local businesses</span>
            </h2>
            <p className="text-body-lg mt-5 max-w-md">One-time payment. No monthly fees for the website itself. No surprises.</p>

            <div className="mt-8 lg:hidden">
              <PricingStage selected={selected} onSelect={setSelected} className="h-[40svh] min-h-[260px] w-full" />
            </div>

            <div className="mt-8">
              <TierPicker selected={selected} onSelect={setSelected} id="home" />
            </div>

            <div id="home-panel" role="tabpanel" aria-labelledby={`home-tab-${selected}`} className="mt-4 min-h-[19rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="slab p-5 sm:p-6"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl font-bold" style={{ letterSpacing: "-0.035em" }}>
                      {pkg.name}
                    </h3>
                    {pkg.popular && <span className="badge-primary">Most popular</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pkg.tagline} · Ideal for {pkg.ideal.toLowerCase()}
                  </p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {pkg.features.slice(0, 6).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mono mt-5 flex flex-wrap justify-between gap-2 border-t border-border pt-4 text-[11px] tracking-wide text-muted-foreground">
                    <span>DELIVERY {pkg.delivery.toUpperCase()}</span>
                    <span>PAYMENT {pkg.payment.toUpperCase()}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/start" className="btn-primary btn-lg gap-2">
                Get Started
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/packages" className="btn-outline btn-lg gap-2">
                Everything included
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:col-span-7 lg:block">
            <PricingStage selected={selected} onSelect={setSelected} className="h-[min(72vh,680px)] w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
