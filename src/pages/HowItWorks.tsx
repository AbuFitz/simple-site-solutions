import { Helmet } from "react-helmet-async";
import { Check, Clock, Target, Users, Zap } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/CTASection";
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
    <Scene3D scene="path" sceneProps={{ progress }} label="A route with five stops from choosing a package to going live." desktopOnly className="h-full w-full" poster={<PagePoster tilt={false} />} />
  );
}

export default function HowItWorks() {
  return (
    <Layout>
      <Helmet>
        <title>How It Works | Website in 5-10 Days | OneSimpleSite</title>
        <link rel="canonical" href="https://onesimplesite.co.uk/how-it-works" />
      </Helmet>
      <section className="pb-10 pt-28 sm:pt-32 md:pb-14">
        <div className="content-width">
          <h1 className="text-headline max-w-3xl">
            Simple. <span className="text-primary">Straightforward.</span>
          </h1>
          <p className="text-body-lg mt-4 max-w-xl">
            No discovery calls. No moodboards. No endless revision cycles. Just a clear process that gets your site live fast.
          </p>
        </div>
      </section>

      <section className="chapter chapter-paper chapter-sheet">
        <div className="content-width pt-10 md:pt-16">
          <ChapterStage
            count={steps.length}
            stageClassName="hidden lg:block lg:h-screen"
            chapterClassName="py-2 lg:min-h-[64vh]"
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
                      <h2 className="text-2xl font-bold sm:text-3xl">
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
            Why this <span className="text-primary">works</span>
          </h2>
          <p className="text-body-lg mt-4 max-w-2xl">We've stripped out everything that makes traditional web projects drag on. Here's what you get instead.</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="slab p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>

          <div className="slab mt-16 max-w-3xl p-6 sm:p-10">
            <h2 className="text-2xl font-bold sm:text-3xl">
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

      <CTASection
        title="Let's build something"
        highlightedText="that converts."
        description="Pick your package. Send your details. Get a website in days, not months."
        primaryButtonText="Start Your Project"
        primaryButtonLink="/start"
        secondaryButtonText="See Pricing"
        secondaryButtonLink="/packages"
      />
    </Layout>
  );
}
