import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Pill } from "@/components/oss/Pill";
import { Shot } from "@/components/oss/Shot";
import type { Contour } from "@/components/oss/clip";
import { projects } from "@/data/work";

const kinds = ["All", ...Array.from(new Set(projects.map((p) => p.kind)))];

/** A repeating, deliberately uneven rhythm: each tile gets its own scale, shape and offset. */
const rhythm: { span: string; ratio: string; contour: Contour; kind: "t" | "m"; shift: string }[] = [
  { span: "lg:col-span-7", ratio: "16 / 10", contour: "notch-br", kind: "t", shift: "" },
  { span: "lg:col-span-4 lg:col-start-9", ratio: "9 / 15", contour: "leaf-r", kind: "m", shift: "lg:mt-24" },
  { span: "lg:col-span-5 lg:col-start-2", ratio: "5 / 4", contour: "notch-tl", kind: "t", shift: "" },
  { span: "lg:col-span-6 lg:col-start-7", ratio: "16 / 10", contour: "step-br", kind: "t", shift: "lg:mt-20" },
  { span: "lg:col-span-5", ratio: "5 / 4", contour: "leaf", kind: "t", shift: "lg:mt-6" },
  { span: "lg:col-span-7 lg:col-start-6", ratio: "16 / 10", contour: "notch-bl", kind: "t", shift: "lg:-mt-6" },
];

export default function Work() {
  const [kind, setKind] = useState("All");
  const shown = projects.filter((p) => kind === "All" || p.kind === kind);

  return (
    <Layout>
      <Helmet>
        <title>Our Work | Websites Built for Local UK Businesses | OneSimpleSite</title>
        <meta
          name="description"
          content="Websites we have built for local businesses: mobile mechanics, construction, valeting, tutoring, ecommerce and more. See each site on desktop and phone."
        />
        <link rel="canonical" href="https://onesimplesite.co.uk/work" />
      </Helmet>

      <section className="pb-10 pt-12 md:pb-16 md:pt-20">
        <div className="content-width grid gap-8 lg:grid-cols-12">
          <p className="t-label lg:col-span-3">Our work</p>
          <div className="lg:col-span-9">
            <h1 className="t-display" style={{ fontSize: "clamp(2.7rem, 7vw, 6.25rem)" }}>
              Real sites,
              <span className="block md:pl-[16%]">for local businesses.</span>
            </h1>
            <p className="t-lead mt-8 max-w-md md:ml-[16%]">
              Every image is a capture of the live site, or of its production build where it is not yet public. Choose a project to see it on desktop and phone.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-36" aria-label="Projects">
        <div className="content-width">
          <div className="flex flex-wrap gap-2 border-t border-border pt-6" role="group" aria-label="Filter by type of site">
            {kinds.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                aria-pressed={kind === k}
                className={`min-h-[44px] rounded-full border-[1.5px] px-5 text-[0.9375rem] font-semibold transition-colors ${
                  kind === k ? "border-foreground bg-foreground text-background" : "border-foreground/30 hover:border-foreground"
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <ul className="mt-12 grid gap-x-8 gap-y-14 md:mt-16 lg:grid-cols-12">
            {shown.map((p, i) => {
              const r = rhythm[i % rhythm.length];
              return (
                <li key={p.slug} className={`${r.span} ${r.shift} ${r.kind === "m" ? "mx-auto w-[70%] sm:w-[48%] lg:w-auto" : ""}`} data-rise>
                  <Link to={`/work/${p.slug}`} className="block">
                    <Shot project={p} kind={r.kind} contour={r.contour} ratio={r.ratio} radius={28} sizes="(min-width:1024px) 50vw, 95vw" />
                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="t-h3">{p.name}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {p.kind} · {p.sector}
                          {p.status !== "Live" && ` · ${p.status}`}
                        </p>
                      </div>
                      <span className="pill-dot mt-1 h-10 w-10 shrink-0 !bg-foreground !text-background" aria-hidden="true">→</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-24 grid gap-6 border-t border-border pt-12 lg:grid-cols-12">
            <h2 className="t-h2 lg:col-span-7">Want your business here?</h2>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-body">Pick a package, send your details and we will build your site on a layout that already works in your trade.</p>
              <div className="mt-6">
                <Pill to="/start">Start your project</Pill>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
