import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Pill } from "@/components/oss/Pill";
import { Shot } from "@/components/oss/Shot";
import { getProject, WorkProject } from "@/data/work";

const P = (slug: string) => getProject(slug) as WorkProject;

const principles = [
  { t: "Simplicity first", d: "Great websites do not need to be complicated. Clean, clear and effective beats clever." },
  { t: "Results over opinions", d: "Every layout decision is aimed at getting you enquiries, based on what already works in your industry." },
  { t: "Quality, always", d: "Every site is mobile-first, fast, SEO-ready and checked before it goes live." },
];

export default function About() {
  return (
    <Layout>
      <Helmet>
        <title>About | OneSimpleSite</title>
        <meta name="description" content="OneSimpleSite builds fast, proven websites for local UK businesses on layouts that already work in their industry." />
        <link rel="canonical" href="https://onesimplesite.co.uk/about" />
      </Helmet>

      <section className="pb-16 pt-12 md:pb-28 md:pt-20">
        <div className="content-width grid gap-10 lg:grid-cols-12">
          <p className="t-label lg:col-span-3">About</p>
          <div className="lg:col-span-9">
            <h1 className="t-display" style={{ fontSize: "clamp(2.7rem, 7vw, 6.25rem)" }}>
              A simple way to get
              <span className="block md:pl-[12%]">a proper website.</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="content-width grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5" data-rise>
            <Shot project={P("fixnow-mechanics")} kind="t" contour="notch-br" ratio="4 / 3" radius={32} sizes="(min-width:1024px) 40vw, 95vw" alt="FixNow Mechanics homepage, a site we built" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-16">
            <p className="t-h3 !font-semibold" style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.4rem)", lineHeight: 1.15 }}>
              A plumber should not have to become a web developer, and no local business should pay agency prices for a simple, effective website.
            </p>
            <div className="mt-8 space-y-5 text-body">
              <p>
                OneSimpleSite is a productised service rather than a custom agency. We do not offer unlimited revisions, moodboards or design by committee. We look at what already works in your industry and build you a proven layout.
              </p>
              <p>It is faster and more affordable, and it keeps the focus on the thing that matters: customers getting in touch.</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Pill to="/work">See our work</Pill>
              <Link to="/how-it-works" className="link-line">How it works</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="theme-ink mx-3 mb-24 rounded-[28px] md:mx-5 md:mb-36 md:rounded-[48px]" aria-labelledby="principles-title">
        <div className="content-width py-16 md:py-28">
          <h2 id="principles-title" className="t-h2 max-w-2xl">What we stand for.</h2>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-border lg:grid-cols-3">
            {principles.map((p, i) => (
              <li key={p.t} className="bg-background p-8 md:p-10" style={{ paddingTop: `${2.5 + i * 1.25}rem` }}>
                <p className="nums text-sm font-semibold text-primary">0{i + 1}</p>
                <h3 className="t-h3 mt-4">{p.t}</h3>
                <p className="mt-3 text-body">{p.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-28 md:pb-40">
        <div className="content-width grid gap-10 lg:grid-cols-12">
          <p className="t-label lg:col-span-3">Who we build for</p>
          <div className="lg:col-span-8">
            <p className="t-h2">
              Plumbers, electricians, mechanics, cleaners, barbers and salons, tutors, small shops, builders and other local trades.
            </p>
            <div className="mt-10"><Pill to="/start">Start your project</Pill></div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
