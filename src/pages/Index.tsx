import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Pill } from "@/components/oss/Pill";
import { Shot } from "@/components/oss/Shot";
import { FaqList } from "@/components/oss/Accordion";
import { getProject, projects, WorkProject } from "@/data/work";
import { packages } from "@/data/packages";
import { steps } from "@/data/process";
import { faqs } from "@/data/faq";

const P = (slug: string) => getProject(slug) as WorkProject;

const sectors = ["Plumbers", "Electricians", "Mechanics", "Cleaners", "Barbers & salons", "Tutors", "Small shops", "Builders & trades"];

const services = [
  {
    id: "website-build",
    title: "Website build",
    text: "A complete, mobile-first site on a layout proven in your trade. Three packages, from 3 to 10 pages.",
    meta: "From £199",
    project: "stonebridge",
  },
  {
    id: "local-seo",
    title: "Local SEO",
    text: "Structure, meta tags and local optimisation built in from day one, not sold as an extra.",
    meta: "In every package",
    project: "fixnow-mechanics",
  },
  {
    id: "enquiries-and-booking",
    title: "Enquiries & booking",
    text: "Contact forms, click-to-call, WhatsApp and booking, so a visitor can act in one tap.",
    meta: "Booking from £39",
    project: "true-to-detail",
  },
  {
    id: "hosting-and-care",
    title: "Hosting & care",
    text: "Hosting, SSL, weekly backups, security monitoring and up to five content updates a month.",
    meta: "£19 a month, optional",
    project: "brightlearn-tutoring",
  },
];

function Caption({ p }: { p: WorkProject }) {
  return (
    <div className="mt-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="t-h3">{p.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {p.kind} · {p.sector}
        </p>
      </div>
      <span className="pill-dot mt-1 h-10 w-10 shrink-0 !bg-foreground !text-background" aria-hidden="true">
        →
      </span>
    </div>
  );
}

export default function Index() {
  const constellation: { slug: string; cls: string; ratio: string; contour: "pebble" | "leaf" | "leaf-r" | "arch" | "plain" | "notch-br" | "notch-tl"; kind: "t" | "m" }[] = [
    { slug: "readysold", cls: "left-[2%] top-[6%] w-[19%]", ratio: "4 / 3", contour: "notch-br", kind: "t" },
    { slug: "arf-mods", cls: "left-[24%] top-[0%] w-[13%]", ratio: "1 / 1", contour: "pebble", kind: "t" },
    { slug: "quantum-biotesting", cls: "right-[22%] top-[3%] w-[17%]", ratio: "5 / 4", contour: "leaf", kind: "t" },
    { slug: "stonebridge", cls: "right-[1%] top-[8%] w-[12%]", ratio: "9 / 15", contour: "arch", kind: "m" },
    { slug: "fixnow-shop", cls: "left-[0%] bottom-[2%] w-[17%]", ratio: "1 / 1", contour: "leaf-r", kind: "t" },
    { slug: "true-to-detail", cls: "left-[22%] bottom-[0%] w-[11%]", ratio: "9 / 17", contour: "plain", kind: "m" },
    { slug: "brightlearn-tutoring", cls: "right-[24%] bottom-[2%] w-[15%]", ratio: "4 / 3", contour: "notch-tl", kind: "t" },
    { slug: "fixnow-mechanics", cls: "right-[2%] bottom-[0%] w-[19%]", ratio: "5 / 3", contour: "notch-br", kind: "t" },
  ];

  return (
    <Layout>
      <Helmet>
        <link rel="canonical" href="https://onesimplesite.co.uk/" />
      </Helmet>

      {/* 1. Hero */}
      <section className="overflow-hidden" aria-labelledby="hero-title">
        <div className="content-width grid gap-12 pb-16 pt-10 md:pt-16 lg:grid-cols-12 lg:gap-6 lg:pb-28 lg:pt-20">
          <div className="relative z-10 lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:pr-6">
            <p className="t-label mb-8">Websites for local UK businesses</p>
            <h1 id="hero-title" className="t-display" style={{ fontSize: "clamp(2.7rem, 5.3vw, 5rem)" }}>
              Websites that win you enquiries,
              <span className="block md:pl-[14%]">not just compliments.</span>
            </h1>
            <div className="mt-10 max-w-md md:ml-[14%]">
              <p className="t-lead">
                Fast, proven websites for plumbers, mechanics, builders, tutors and other local businesses, built on layouts that already work in your trade.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Pill to="/start">Start your project</Pill>
                <Link to="/packages" className="link-line">See pricing</Link>
              </div>
              <ul className="mt-10 grid gap-2 text-sm text-muted-foreground">
                {["From £199, prices listed upfront", "Live in 5–14 days, depending on the package", "Local SEO included in every package"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-6" aria-label="Examples of our work">
            <div className="relative mx-auto max-w-xl pb-16 pr-10 pt-2 lg:max-w-none lg:pb-24" data-rise>
              <Link to="/work/fixnow-mechanics" className="block" aria-label="FixNow Mechanics case study">
                <Shot project={P("fixnow-mechanics")} kind="t" contour="notch-br" ratio="16 / 10" radius={28} priority sizes="(min-width:1024px) 40vw, 90vw" />
              </Link>
              <Link
                to="/work/brightlearn-tutoring"
                className="absolute -bottom-6 -left-[3%] block w-[27%]"
                aria-label="BrightLearn Tutoring case study"
                data-drift
                style={{ ["--drift" as string]: "14px" }}
              >
                <Shot project={P("brightlearn-tutoring")} kind="m" crop="top" contour="leaf" ratio="9 / 17" priority sizes="20vw" />
              </Link>
              <Link
                to="/work/stonebridge"
                className="absolute right-0 top-[44%] block w-[30%]"
                aria-label="Stonebridge Construction case study"
                data-drift
                style={{ ["--drift" as string]: "-18px" }}
              >
                <Shot project={P("stonebridge")} kind="t" contour="pebble" ratio="1 / 1" sizes="15vw" />
              </Link>
              <p className="absolute -bottom-1 right-0 max-w-[11rem] text-right text-xs leading-snug text-muted-foreground">
                Real sites we have built, on desktop and phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who we help: oversized running text, then an offset statement */}
      <section aria-label="Who we build for" className="border-y border-border py-6 md:py-10">
        <div className="overflow-hidden" aria-hidden="true">
          <div className="running t-mega" style={{ fontSize: "clamp(3.5rem, 11vw, 9.5rem)" }}>
            {[0, 1].map((n) => (
              <div key={n} className="flex flex-none">
                {sectors.map((s, i) => (
                  <span key={s} className={`flex-none pr-[0.45em] ${i % 2 ? "text-foreground/50" : ""}`}>
                    {s}
                    <span className="px-[0.3em] text-primary">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="sr-only">We build websites for {sectors.join(", ")}.</p>
      </section>

      <section className="section-sm md:py-28">
        <div className="content-width grid gap-8 lg:grid-cols-12">
          <p className="t-label lg:col-span-3">Who we help</p>
          <div className="lg:col-span-7 lg:col-start-5">
            <p className="t-h3 !font-semibold" style={{ fontSize: "clamp(1.6rem, 3.1vw, 2.75rem)", lineHeight: 1.12 }}>
              Local customers search for a plumber, a mechanic, a builder, a tutor. We build the site they land on, using the layout that already works in your industry, so they can see what you do and get in touch.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <p className="text-body">
                No discovery calls, moodboards or endless revision rounds. You send your details; we research what works in your industry and build from there.
              </p>
              <div className="flex items-start sm:justify-end">
                <Pill to="/how-it-works" variant="outline">How it works</Pill>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Selected work: varied scale and contour */}
      <section className="pb-24 md:pb-36" aria-labelledby="work-title">
        <div className="content-width">
          <div className="grid gap-6 lg:grid-cols-12">
            <p className="t-label lg:col-span-3">Selected work</p>
            <h2 id="work-title" className="t-h2 lg:col-span-8 lg:col-start-5">
              Real sites for real local businesses.
            </h2>
          </div>

          <div className="mt-14 grid gap-x-8 gap-y-16 md:mt-20 lg:grid-cols-12">
            <Link to="/work/fixnow-mechanics" className="block lg:col-span-7" data-rise>
              <Shot project={P("fixnow-mechanics")} kind="t" contour="notch-br" ratio="16 / 10" radius={30} sizes="(min-width:1024px) 55vw, 95vw" />
              <Caption p={P("fixnow-mechanics")} />
            </Link>

            <Link to="/work/true-to-detail" className="ml-auto block w-[72%] sm:w-[52%] lg:col-span-3 lg:col-start-10 lg:mt-28 lg:w-auto" data-rise>
              <Shot project={P("true-to-detail")} kind="m" contour="leaf-r" ratio="9 / 15" sizes="(min-width:1024px) 22vw, 60vw" />
              <Caption p={P("true-to-detail")} />
            </Link>

            <Link to="/work/stonebridge" className="block w-[88%] lg:col-span-6 lg:col-start-2 lg:-mt-6 lg:w-auto" data-rise>
              <Shot project={P("stonebridge")} kind="t" contour="step-br" ratio="16 / 10" radius={26} sizes="(min-width:1024px) 45vw, 90vw" />
              <Caption p={P("stonebridge")} />
            </Link>

            <Link to="/work/brightlearn-tutoring" className="ml-auto block w-[80%] lg:col-span-4 lg:col-start-9 lg:mt-24 lg:w-auto" data-rise>
              <Shot project={P("brightlearn-tutoring")} kind="t" contour="notch-tl" ratio="5 / 4" sizes="(min-width:1024px) 32vw, 80vw" />
              <Caption p={P("brightlearn-tutoring")} />
            </Link>
          </div>

          <div className="mt-16 flex justify-start md:mt-24 lg:justify-end">
            <Pill to="/work">See all {projects.length} projects</Pill>
          </div>
        </div>
      </section>

      {/* 4. Services index */}
      <section className="pb-24 md:pb-36" aria-labelledby="services-title">
        <div className="content-width">
          <div className="grid gap-6 lg:grid-cols-12">
            <p className="t-label lg:col-span-3">What we do</p>
            <h2 id="services-title" className="t-h2 lg:col-span-8 lg:col-start-5">
              One simple service, done properly.
            </h2>
          </div>
          <ul className="mt-14 border-t border-border md:mt-20">
            {services.map((s, i) => (
              <li key={s.id} className="border-b border-border">
                <Link
                  to={`/services#${s.id}`}
                  className="group grid items-center gap-4 py-7 md:grid-cols-12 md:gap-6 md:py-9"
                >
                  <span className="nums text-sm font-semibold text-muted-foreground md:col-span-1">0{i + 1}</span>
                  <span
                    className="font-display text-[2.1rem] font-bold leading-none transition-transform duration-500 group-hover:translate-x-2 md:col-span-5 md:text-[3.25rem]"
                    style={{ letterSpacing: "-0.04em" }}
                  >
                    {s.title}
                  </span>
                  <span className={`text-body md:col-span-3 ${i % 2 ? "md:col-start-7" : ""}`}>{s.text}</span>
                  <span className="flex items-center justify-between gap-4 md:col-span-3 md:justify-end">
                    <span className="text-sm font-semibold">{s.meta}</span>
                    <span className="w-24 shrink-0 md:w-28">
                      <Shot project={P(s.project)} kind="t" contour={i % 2 ? "pebble" : "leaf"} ratio="1 / 1" sizes="120px" decorative />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Approach: full-bleed black panel */}
      <section className="px-3 pb-24 md:px-5 md:pb-36" aria-labelledby="approach-title">
        <div className="theme-ink overflow-hidden rounded-[28px] md:rounded-[48px]">
          <div className="content-width py-16 md:py-28">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="t-label mb-6">How it works</p>
                <h2 id="approach-title" className="t-h2">
                  From enquiry to a live site in five steps.
                </h2>
                <p className="mt-6 max-w-sm text-body">
                  Delivery is 5–7 days for The Starter, 7–10 for The Sorted and 10–14 for The Works. You send the content; we handle the build.
                </p>
                <div className="mt-8 hidden w-[58%] lg:block" data-rise>
                  <Shot project={P("true-to-detail")} kind="m" contour="leaf" ratio="9 / 16" sizes="20vw" />
                </div>
              </div>
              <ol className="lg:col-span-7">
                {steps.map((s, i) => (
                  <li
                    key={s.number}
                    className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-border py-8 md:gap-x-10"
                    style={{ paddingLeft: `${(i % 3) * 0}rem` }}
                  >
                    <span className="nums font-display text-[3.5rem] font-bold leading-none text-primary md:text-[5.5rem]" style={{ letterSpacing: "-0.05em" }}>
                      {s.number}
                    </span>
                    <div className={i % 2 ? "md:pl-10" : ""}>
                      <h3 className="t-h3">{s.title}</h3>
                      <p className="mt-2 max-w-md text-body">{s.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Constellation: an open centre with the work around it */}
      <section className="pb-24 md:pb-36" aria-labelledby="constellation-title">
        <div className="content-width">
          <div className="relative hidden min-h-[640px] lg:block">
            <div className="absolute inset-x-[30%] top-1/2 -translate-y-1/2 text-center">
              <h2 id="constellation-title" className="t-h2">
                Sites built for local businesses.
              </h2>
              <p className="mx-auto mt-5 max-w-sm text-body">From mobile mechanics to builders and tutors, every project below links to the live site or its case study.</p>
              <div className="mt-8 flex justify-center">
                <Pill to="/work">Browse the work</Pill>
              </div>
            </div>
            {constellation.map((c) => (
              <Link key={c.slug} to={`/work/${c.slug}`} className={`absolute block ${c.cls}`} aria-label={`${P(c.slug).name} case study`}>
                <Shot project={P(c.slug)} kind={c.kind} contour={c.contour} ratio={c.ratio} radius={20} sizes="20vw" />
              </Link>
            ))}
          </div>

          <div className="lg:hidden">
            <h2 className="t-h2">Sites built for local businesses.</h2>
            <div className="mt-10 grid grid-cols-6 gap-3">
              {constellation.slice(0, 6).map((c, i) => (
                <Link
                  key={c.slug}
                  to={`/work/${c.slug}`}
                  className={`block ${i % 3 === 0 ? "col-span-4" : "col-span-2"} ${i % 3 === 1 ? "mt-8" : ""}`}
                  aria-label={`${P(c.slug).name} case study`}
                >
                  <Shot project={P(c.slug)} kind={c.kind === "m" ? "t" : c.kind} contour={c.contour === "plain" ? "leaf" : c.contour} ratio={i % 3 === 0 ? "4 / 3" : "3 / 4"} radius={18} sizes="50vw" />
                </Link>
              ))}
            </div>
            <div className="mt-10">
              <Pill to="/work">Browse the work</Pill>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing: staggered, one tier emphasised */}
      <section className="pb-24 md:pb-36" aria-labelledby="pricing-title">
        <div className="content-width">
          <div className="grid gap-6 lg:grid-cols-12">
            <p className="t-label lg:col-span-3">Pricing</p>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 id="pricing-title" className="t-h2">
                Simple pricing for local businesses.
              </h2>
              <p className="t-lead mt-5 max-w-lg">One-time payment. No monthly fees for the website itself. No surprises.</p>
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:mt-20 lg:grid-cols-12 lg:items-start">
            {packages.map((p, i) => {
              const hero = p.popular;
              return (
                <article
                  key={p.id}
                  className={`flex flex-col rounded-[28px] p-7 md:p-9 lg:col-span-4 ${hero ? "theme-ink lg:-mt-6 lg:pb-12" : "border border-border bg-card"} ${i === 2 ? "lg:mt-14" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="t-h3">{p.name}</h3>
                    {hero && <span className="badge-primary">Most popular</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                  <p className="mt-8 font-display font-bold" style={{ fontSize: "clamp(3.5rem, 6vw, 5rem)", letterSpacing: "-0.05em", lineHeight: 1 }}>
                    £{p.price}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Up to {p.pages} pages · {p.delivery}
                  </p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {p.features.filter((f) => !f.endsWith(":")).slice(1, 5).map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Pill to="/start" variant={hero ? "ink" : "outline"}>Choose {p.name.replace("The ", "")}</Pill>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-10 text-sm text-muted-foreground">
            <Link to="/packages" className="link-line text-foreground">Compare every inclusion, add-on and hosting option</Link>
          </p>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="pb-28 md:pb-40" aria-labelledby="faq-title">
        <div className="content-width grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-label mb-5">Questions</p>
            <h2 id="faq-title" className="t-h2">Straight answers.</h2>
            <div className="mt-8">
              <Pill to="/faq" variant="outline">All questions</Pill>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FaqList items={faqs.slice(0, 5)} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
