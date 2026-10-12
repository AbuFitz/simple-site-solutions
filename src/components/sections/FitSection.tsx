import { Check, X } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TiltCard } from "@/components/ui/TiltCard";

const notForYou = ["Unlimited revisions", "Design it yourself", "Custom web apps", "The cheapest option"];
const forYou = ["A website that converts", "Proven industry layouts", "Fast, reliable delivery", "Results over opinions"];

export function FitSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 40%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section className="chapter chapter-paper chapter-sheet" aria-labelledby="fit-title">
      <div className="content-width section">
        <h2 id="fit-title" className="text-headline max-w-4xl">
          This is <span className="text-signal">not</span> for everyone
        </h2>

        <div ref={ref} className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-6" style={{ perspective: 1200 }}>
          <motion.div style={{ rotateX, y, opacity, transformOrigin: "50% 100%" }}>
            <TiltCard className="h-full rounded-3xl border border-dashed border-foreground/30 p-6 sm:p-9" glare={false}>
              <h3 className="font-display text-2xl font-bold text-muted-foreground sm:text-3xl" style={{ letterSpacing: "-0.035em" }}>
                Not for you if you want...
              </h3>
              <ul className="mt-6 space-y-4">
                {notForYou.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-base text-muted-foreground sm:text-lg">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10">
                      <X className="h-3.5 w-3.5 text-destructive" />
                    </span>
                    <span className="line-through decoration-foreground/25">{item}</span>
                  </li>
                ))}
              </ul>
            </TiltCard>
          </motion.div>

          <motion.div style={{ rotateX, y, opacity, transformOrigin: "50% 100%" }} transition={{ delay: 0.1 }}>
            <TiltCard className="h-full rounded-3xl border border-primary bg-primary p-6 text-primary-foreground shadow-[0_30px_70px_-30px_hsl(var(--primary)/0.7)] sm:p-9">
              <h3 className="font-display text-2xl font-bold sm:text-3xl" style={{ letterSpacing: "-0.035em" }}>
                Perfect if you want...
              </h3>
              <ul className="mt-6 space-y-4">
                {forYou.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-base font-medium sm:text-lg">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
