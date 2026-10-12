import { Helmet } from "react-helmet-async";
import { Check, Clock, Target, Users, Zap } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Finale } from "@/components/sections/Finale";
import { steps } from "@/data/process";
import { Scene3D } from "@/components/three/Scene3D";
import { PagePoster } from "@/components/sections/PagePoster";
import { ChapterStage } from "@/components/sections/ChapterStage";
import { useTransform, MotionValue } from "framer-motion";

const benefits = [
  { icon: Clock, title: "5-10 Days", description: "Not months. You'll have your site live quickly." },
  { icon: Zap, title: "No Back-and-Forth", description: "We've streamlined the process. No endless meetings or emails." },
  { icon: Target, title: "Built to Convert", description: "Every layout is designed to turn visitors into customers." },
  { icon: Users, title: "We Handle It", description: "Just provide your content. We do the rest." },
];

const needs = [
  "Your business name and contact details",
  "A list of your services",
  "Any images or logos you want to use",
  "A rough idea of what you want to say",
];

function PathStage({ chapter }: { chapter: MotionValue<number> }) {
  const progress = useTransform(chapter, (c) => Math.min(1, Math.max(0, c / (steps.length - 1))));
  return (
    <Scene3D scene="path" sceneProps={{ progress }} label="A route with five stops from choosing a package to going live." className="h-full w-full" poster={<PagePoster tilt={false} />} />
  );
}

export default function HowItWorks() {
  return (
    <Layout>
      <Helmet>
        <title>How It Works | Website in 5-10 Days | OneSimpleSite</title>
        <link rel="canonical" href="https://onesimplesite.co.uk/how-it-works" />
      </Helmet>
      <section className="pb-16 pt-32 sm:pt-40 md:pb-24">
        <div className="content-width">
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            The process
          </p>
          <h1 className="text-display">
            Simple. <span className="text-signal">Straightforward.</span>
          </h1>
          <p className="text-body-lg mt-6 max-w-xl">
            No discovery calls. No moodboards. No endless revision cycles. Just a clear process that gets your site live fast.
          </p>
        </div>
      </section>

      <section className="chapter chapter-paper chapter-sheet">
        <div className="content-width pt-12 md:pt-20">
          <ChapterStage
            count={steps.length}
            stageClassName="h-[42svh] lg:h-screen -mx-5 sm:-mx-8 md:-mx-12 lg:mx-0"
            chapterClassName="min-h-[40svh] lg:min-h-[64vh]"
            stage={(chapter) => <PathStage chapter={chapter} />}
            chapters={(active) =>
              steps.map((s, i) => (
                <article
                  key={s.number}
                  className="slab w-full p-6 transition-all duration-500 sm:p-8"
                  style={{ borderColor: active === i ? "hsl(var(--primary) / 0.6)" : undefined, opacity: active === i ? 1 : 0.55 }}
                >
                  <div className="flex items-start gap-5">
                    <div className="step-number shrink-0">{s.number}</div>
                    <div>
                      <h2 className="font-display text-2xl font-bold sm:text-3xl" style={{ letterSpacing: "-0.035em" }}>
                        {s.title}
                      </h2>
                      <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                </article>
              ))
            }
          />
        </div>
        <div className="h-16" />
      </section>

      <section className="chapter chapter-sheet bg-background">
        <div className="content-width section">
          <h2 className="text-headline max-w-2xl">
            Why this <span className="text-signal">works</span>
          </h2>
          <p className="text-body-lg mt-4 max-w-2xl">We've stripped out everything that makes traditional web projects drag on. Here's what you get instead.</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="slab p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
                  <b.icon className="h-5 w-5 text-signal" />
                </div>
                <h3 className="font-display text-xl font-bold" style={{ letterSpacing: "-0.03em" }}>
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>

          <div className="slab mt-16 max-w-3xl p-6 sm:p-10">
            <h2 className="font-display text-2xl font-bold sm:text-3xl" style={{ letterSpacing: "-0.035em" }}>
              What we need from you
            </h2>
            <p className="mt-3 text-muted-foreground">
              The more you can provide upfront, the faster we can build. But don't worry — we'll help if you're missing anything.
            </p>
            <ul className="mt-6 space-y-4">
              {needs.map((n) => (
                <li key={n} className="flex items-start gap-3">
                  <span className="check-icon">
                    <Check className="h-3 w-3" />
                  </span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Finale />
    </Layout>
  );
}
