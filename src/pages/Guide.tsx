import { Link, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { SITE } from "@/data/site";
import guideData from "@/data/guides.json";
import { GUIDES_PATH, guideJsonLd, guidePath, type GuideData } from "@/lib/guideSeo.mjs";
import NotFound from "./NotFound";

const data = guideData as GuideData;

export default function Guide() {
  const { slug } = useParams();
  const g = data.guides.find((x) => x.slug === slug);
  if (!g) return <NotFound />;
  const related = g.related.map((s) => data.guides.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  return (
    <Layout>
      <Seo path={guidePath(g.slug)} title={g.title} description={g.metaDescription} jsonLd={guideJsonLd(g, data, SITE.url)} />
      <article>
        <header className="relative pb-8 pt-24 sm:pb-12 sm:pt-32">
          <DottedGrid className="opacity-30" spacing={32} />
          <div className="content-width relative z-10 max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link> / <Link to={GUIDES_PATH} className="hover:text-foreground">Guides</Link> / <span aria-current="page">{g.short}</span>
            </nav>
            <h1 className="text-headline">{g.h1}</h1>
            <p className="text-body-lg mt-4">{g.dek}</p>
            <p className="mt-3 text-xs text-muted-foreground">Updated <time dateTime={data.published}>{new Date(data.published).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time></p>
          </div>
        </header>

        <div className="content-width max-w-3xl space-y-8 pb-10">
          {g.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-title">{s.h}</h2>
              {s.p.map((p) => (
                <p key={p} className="text-body mt-3 !text-base leading-relaxed">{p}</p>
              ))}
            </section>
          ))}

          <section className="bordered-section bg-card p-5 sm:p-6">
            <h2 className="text-title mb-3">Questions to ask before you decide</h2>
            <ul className="space-y-2.5">
              {g.checklist.map((c) => (
                <li key={c} className="flex gap-3 text-sm sm:text-base">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-title mb-3">Common questions</h2>
            <div className="divide-y divide-border rounded-xl border border-border">
              {g.faq.map((f) => (
                <details key={f.q} className="group p-4">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {f.q}
                    <span className="text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="bordered-highlight p-6">
            <h2 className="text-title">Want it done for you?</h2>
            <p className="text-body mt-2">Fixed-price websites from £199, built for your trade and your area. See a sample first, or compare packages.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/preview" className="btn-primary btn-lg min-h-[48px] !text-background">Show my preview</Link>
              <Link to="/packages" className="btn-outline btn-lg min-h-[48px]">Packages and prices</Link>
            </div>
          </div>

          {related.length > 0 && (
            <nav aria-label="Related guides">
              <h2 className="text-title mb-3">Related guides</h2>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}><Link className="underline underline-offset-4 hover:text-primary" to={guidePath(r.slug)}>{r.h1}</Link></li>
                ))}
              </ul>
            </nav>
          )}
          <p className="border-t border-border pt-4 text-xs text-muted-foreground">{data.disclaimer}</p>
        </div>
      </article>
    </Layout>
  );
}
