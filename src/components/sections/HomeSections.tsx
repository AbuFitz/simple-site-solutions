import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, MapPin } from "lucide-react";
import { packages } from "@/data/packages";
import { categories } from "@/lib/preview/categories";
import { faqs } from "@/data/faqs";
import locationData from "@/data/locations.json";
import { locationPath, type LocData } from "@/lib/locationSeo.mjs";

const locations = (locationData as LocData).locations;
const rise = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true, margin: "-40px" } } as const;

function Head({ badge, title, accent, text }: { badge: string; title: string; accent: string; text?: string }) {
  return (
    <motion.div className="mb-6 max-w-2xl sm:mb-10" {...rise}>
      <span className="badge-primary mb-3 inline-block">{badge}</span>
      <h2 className="text-headline">
        {title} <span className="text-primary">{accent}</span>
      </h2>
      {text && <p className="text-body-lg mt-3">{text}</p>}
    </motion.div>
  );
}

export function PackagesGlance() {
  return (
    <section className="relative py-10 sm:py-14 md:py-20" aria-labelledby="home-packages">
      <div className="content-width">
        <Head badge="Packages" title="Two fixed prices." accent="Nothing hidden." text="Pick the one that fits, or ask us about a bespoke project. What each includes, and anything that costs extra, is written down before you start." />
        <ul className="grid gap-4 md:grid-cols-3">
          {packages.map((p, i) => (
            <motion.li key={p.id} {...rise} transition={{ duration: 0.5, delay: i * 0.08 }} className={`relative flex flex-col rounded-2xl border bg-card p-5 sm:p-6 ${p.recommended ? "border-primary/60" : "border-border"}`}>
              {p.recommended && <span className="absolute -top-3 left-5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">Our suggestion</span>}
              <h3 className="text-lg font-bold" id={i === 0 ? "home-packages" : undefined}>{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              <p className="mt-4 flex items-baseline gap-2">{p.price ? <><span className="text-4xl font-bold tracking-tight">£{p.price}</span>{p.was && <s className="text-sm text-muted-foreground"><span className="sr-only">Previously </span>£{p.was}</s>}</> : <span className="text-2xl font-bold tracking-tight">{p.priceLabel}</span>}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.pages ? `Up to ${p.pages} pages · ${p.delivery}` : "Bespoke scope"}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.slice(0, 5).map((f) => (
                  <li key={f.title} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{f.title}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">Best for: {p.ideal}</p>
            </motion.li>
          ))}
        </ul>
        <motion.div className="mt-6 flex flex-wrap gap-3" {...rise}>
          <Link to="/packages" className="btn-primary btn-lg min-h-[48px] gap-2 !text-background">See what is included <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
          <Link to="/preview" className="btn-outline btn-lg min-h-[48px]">See a sample first</Link>
        </motion.div>
      </div>
    </section>
  );
}

const steps = [
  { t: "Tell us about your business", d: "A short brief: what you do, where you work and what you want customers to do." },
  { t: "We plan and build it", d: "We reply by email to confirm scope, then build your pages around your trade and your area." },
  { t: "Review, adjust, launch", d: "You check it, ask for the changes your package includes, and it goes live." },
];

export function HowItWorksStrip() {
  return (
    <section className="py-10 sm:py-14 md:py-20">
      <div className="content-width">
        <Head badge="How it works" title="Three steps," accent="no jargon." />
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.li key={s.t} {...rise} transition={{ duration: 0.5, delay: i * 0.08 }} className="relative rounded-2xl border border-border bg-card p-5 sm:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground">{i + 1}</span>
              <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
            </motion.li>
          ))}
        </ol>
        <p className="mt-5 text-sm text-muted-foreground">Delivery is an estimate counted from when we have your content. <Link to="/how-it-works" className="underline underline-offset-4 hover:text-foreground">The full process</Link></p>
      </div>
    </section>
  );
}

export function TradesGrid() {
  return (
    <section className="py-10 sm:py-14 md:py-20">
      <div className="content-width">
        <Head badge="Built for" title="Your kind of" accent="business." text="Each trade gets its own layout and wording. Pick yours and see a sample with your name and area." />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <li key={c.id}>
              <Link to={`/preview?c=${c.id}`} className="group flex h-full min-h-[84px] flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary">
                <span className="font-semibold leading-tight">{c.label}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary">See a sample <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AreasStrip() {
  return (
    <section className="py-10 sm:py-14 md:py-20">
      <div className="content-width">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <span className="badge-primary mb-3 inline-block">Across the UK</span>
              <h2 className="text-headline">Web design where <span className="text-primary">you work</span></h2>
              <p className="text-body-lg mt-3">OneSimpleSite provides web design and development for businesses across the UK. We work online, at the same fixed prices everywhere, and we have local pages for the places below.</p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                <Link to="/web-design" className="font-semibold text-primary underline underline-offset-4">All areas</Link>
                <Link to="/guides" className="font-semibold text-primary underline underline-offset-4">Website guides</Link>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2 lg:col-span-7" aria-label="Local web design pages">
              {locations.map((l) => (
                <li key={l.slug}>
                  <Link to={locationPath(l.slug)} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-border bg-background px-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary">
                    <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const teaser = ["How much does a website cost?", "How long does it take to build my website?", "Is SEO included?", "What do you need from me to get started?"];

export function FaqTeaser() {
  const items = teaser.map((q) => faqs.find((f) => f.question === q)).filter((f): f is NonNullable<typeof f> => Boolean(f));
  return (
    <section className="py-10 sm:py-14 md:py-20">
      <div className="content-width grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Head badge="FAQ" title="Quick" accent="answers." />
          <Link to="/faq" className="text-sm font-semibold text-primary underline underline-offset-4">Read every question</Link>
        </div>
        <div className="divide-y divide-border rounded-2xl border border-border lg:col-span-8">
          {items.map((f) => (
            <details key={f.question} className="group p-4 sm:p-5">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.question}
                <span className="text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
