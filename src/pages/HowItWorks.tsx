import { Helmet } from "react-helmet-async";
import { Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Pill } from "@/components/oss/Pill";
import { Shot } from "@/components/oss/Shot";
import type { Contour } from "@/components/oss/clip";
import { getProject, WorkProject } from "@/data/work";
import { steps } from "@/data/process";

const P = (slug: string) => getProject(slug) as WorkProject;

const needs = [
  "Your business name and contact details",
  "A list of your services",
  "Any images or logos you want to use",
  "A rough idea of what you want to say",
];

/** One composition per step so the sequence never settles into a pattern. */
const art: { slug: string; contour: Contour; ratio: string; kind: "t" | "m"; side: "l" | "r"; width: string; note: string }[] = [
  { slug: "readysold", contour: "notch-br", ratio: "16 / 10", kind: "t", side: "r", width: "lg:col-span-5", note: "A finished site: ReadySold." },
  { slug: "brightlearn-tutoring", contour: "leaf", ratio: "9 / 15", kind: "m", side: "l", width: "lg:col-span-3", note: "Built mobile-first: BrightLearn Tutoring." },
  { slug: "fixnow-mechanics", contour: "step-br", ratio: "4 / 3", kind: "t", side: "r", width: "lg:col-span-6", note: "A layout researched for its trade: FixNow Mechanics." },
  { slug: "stonebridge", contour: "arch", ratio: "9 / 15", kind: "m", side: "l", width: "lg:col-span-3", note: "Reviewed together before launch: Stonebridge Construction." },
  { slug: "true-to-detail", contour: "notch-tl", ratio: "5 / 4", kind: "t", side: "r", width: "lg:col-span-5", note: "Live: True To Detail." },
];

export default function HowItWorks() {
  return (
    <Layout>
      <Helmet>
        <title>How It Works | Website in 5-14 Days | OneSimpleSite</title>
        <link rel="canonical" href="https://onesimplesite.co.uk/how-it-works" />
      </Helmet>

      <section className="pb-14 pt-12 md:pb-24 md:pt-20">
        <div className="content-width grid gap-10 lg:grid-cols-12">
          <p className="t-label lg:col-span-3">The process</p>
          <div className="lg:col-span-9">
            <h1 className="t-display" style={{ fontSize: "clamp(2.7rem, 7vw, 6.25rem)" }}>
              Simple.
              <span className="block md:pl-[16%]">Straightforward.</span>
            </h1>
            <p className="t-lead mt-8 max-w-md md:ml-[16%]">
              No discovery calls. No moodboards. No endless revision cycles. Just a clear process that gets your site live fast.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-36" aria-label="The five steps">
        <ol className="content-width space-y-20 md:space-y-32">
          {steps.map((s, i) => {
            const a = art[i];
            const left = a.side === "l";
            return (
              <li key={s.number} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
                <div className={`${a.width} ${left ? "" : "lg:order-2 lg:col-start-8"} ${a.kind === "m" ? "mx-auto w-[62%] sm:w-[40%] lg:mx-0 lg:w-auto" : ""}`} data-rise>
                  <Shot project={P(a.slug)} kind={a.kind} contour={a.contour} ratio={a.ratio} radius={30} sizes="(min-width:1024px) 40vw, 90vw" />
                  <p className="mt-3 text-xs text-muted-foreground">{a.note}</p>
                </div>
                <div className={`lg:col-span-5 ${left ? "lg:col-start-6" : "lg:order-1 lg:col-start-1"}`}>
                  <p className="nums font-display font-bold leading-none text-primary" style={{ fontSize: "clamp(4.5rem, 10vw, 8.5rem)", letterSpacing: "-0.06em" }} aria-hidden="true">
                    {s.number}
                  </p>
                  <h2 className="t-h3 mt-3">
                    <span className="sr-only">Step {Number(s.number)}: </span>
                    {s.title}
                  </h2>
                  <p className="mt-4 max-w-md text-body">{s.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="theme-ink mx-3 mb-24 rounded-[28px] md:mx-5 md:mb-36 md:rounded-[48px]" aria-labelledby="need-title">
        <div className="content-width grid gap-12 py-16 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-label">What we need from you</p>
            <h2 id="need-title" className="t-h2 mt-5">Send what you have. We will help with the rest.</h2>
            <p className="mt-6 max-w-md text-body">
              The more you can provide upfront, the faster we can build. If you are missing anything, we will help you work it out.
            </p>
          </div>
          <ul className="space-y-4 lg:col-span-6 lg:col-start-7">
            {needs.map((n) => (
              <li key={n} className="flex items-start gap-4 border-b border-border pb-4 font-display text-2xl font-semibold" style={{ letterSpacing: "-0.03em" }}>
                <Check className="mt-1.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {n}
              </li>
            ))}
            <li className="pt-4"><Pill to="/start">Start your project</Pill></li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
