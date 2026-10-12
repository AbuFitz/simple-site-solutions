import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { WorkShowcase } from "@/components/sections/WorkShowcase";
import { Finale } from "@/components/sections/Finale";
import { projects } from "@/data/work";

const kinds = ["All", ...Array.from(new Set(projects.map((p) => p.kind)))];

export default function Work() {
  const [kind, setKind] = useState("All");
  const shown = projects.filter((p) => kind === "All" || p.kind === kind);

  return (
    <Layout>
      <Helmet>
        <title>Our Work | Websites Built for Local UK Businesses | OneSimpleSite</title>
        <meta
          name="description"
          content="Real websites we have built: mobile mechanics, construction, valeting, tutoring, ecommerce and more. Browse desktop and mobile captures of every project."
        />
        <link rel="canonical" href="https://onesimplesite.co.uk/work" />
      </Helmet>

      <section className="relative overflow-hidden pb-24 pt-32 sm:pt-40 md:pb-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border) / 0.55) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.55) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 60% 70% at 30% 30%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 30% 30%, black, transparent 75%)",
          }}
        />
        <div className="content-width relative">
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            Selected work
          </p>
          <h1 className="text-display max-w-5xl">
            Real sites. <span className="text-signal">Real captures.</span>
          </h1>
          <p className="text-body-lg mt-6 max-w-xl">
            Every image here is a capture of the live site or its production build, on desktop and on a phone.
          </p>
        </div>
      </section>

      <WorkShowcase id="showcase" />

      <section className="chapter chapter-sheet bg-background" aria-labelledby="index-title">
        <div className="content-width section">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 id="index-title" className="text-headline">
              The full <span className="text-signal">index</span>
            </h2>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
              {kinds.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  aria-pressed={kind === k}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    kind === k ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
              >
                <Link to={`/work/${p.slug}`} className="slab group block overflow-hidden transition-transform duration-500 hover:-translate-y-1.5">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-secondary">
                    <img
                      src={p.img.t}
                      alt={`${p.name} homepage capture`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="mono absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] tracking-[0.12em] backdrop-blur">
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3 p-5">
                    <div>
                      <h3 className="font-display text-xl font-bold" style={{ letterSpacing: "-0.03em" }}>
                        {p.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {p.sector} · {p.kind}
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <Finale />
    </Layout>
  );
}
