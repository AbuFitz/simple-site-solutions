import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Check, MapPin } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { SITE } from "@/data/site";
import { packages } from "@/data/packages";
import locationData from "@/data/locations.json";
import { HUB_PATH, faqFor, locationJsonLd, locationPath, type LocData } from "@/lib/locationSeo.mjs";
import NotFound from "./NotFound";

const data = locationData as LocData;

export default function WebDesignLocation() {
  const { slug } = useParams();
  const loc = data.locations.find((l) => l.slug === slug);
  if (!loc) return <NotFound />;
  const faq = faqFor(loc, data);
  const [before, after] = loc.h1.split(loc.name);
  const near = loc.neighbours.map((s) => data.locations.find((l) => l.slug === s)).filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <Layout>
      <Seo path={locationPath(loc.slug)} title={loc.title} description={loc.metaDescription} jsonLd={locationJsonLd(loc, data, SITE.url)} />

      <section className="relative pb-10 pt-24 sm:pb-14 sm:pt-32">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10 max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link> / <Link to={HUB_PATH} className="hover:text-foreground">Web design</Link> / <span aria-current="page">{loc.name}</span>
          </nav>
          <span className="badge-primary mb-3 inline-flex items-center gap-1.5 text-[9px] sm:text-xs"><MapPin className="h-3 w-3" aria-hidden="true" />{loc.county}</span>
          <h1 className="text-headline">{before}<span className="text-primary">{loc.name}</span>{after}</h1>
          <p className="text-body-lg mt-4">{data.ukLine} That includes businesses in {loc.name} and the surrounding area.</p>
          {loc.intro.map((p) => (
            <p key={p} className="text-body mt-4 max-w-3xl">{p}</p>
          ))}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={`/preview?t=${encodeURIComponent(loc.name)}`} className="btn-primary btn-lg min-h-[48px] gap-2 !text-background">
              See a {loc.name} website preview <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/packages" className="btn-outline btn-lg min-h-[48px]">Packages and prices</Link>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="content-width grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-title">Web design and the {loc.name} area</h2>
            <p className="text-body mt-3">{loc.local}</p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="text-title mb-4">Who we build for in {loc.name}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {loc.sectors.map((s) => (
                <li key={s.name} className="bordered-section bg-card p-4">
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="content-width">
          <h2 className="text-title mb-2">What we set up for local search</h2>
          <p className="text-body mb-5 max-w-2xl">Good local SEO starts with a site that is clear, fast and honest. This is what every OneSimpleSite website is built with.</p>
          <ul className="grid gap-3 md:grid-cols-2">
            {data.shared.localSeo.map((s) => (
              <li key={s.title} className="flex gap-3 rounded-xl border border-border p-4">
                <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-10">
        <div className="content-width">
          <h2 className="text-title mb-2">Packages for {loc.name} businesses</h2>
          <p className="text-body mb-5">Fixed prices, the same anywhere in the UK. Compare everything that is included on the <Link className="underline underline-offset-4 hover:text-foreground" to="/packages">packages page</Link>.</p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {packages.map((p) => (
              <li key={p.id} className="bordered-section bg-card p-5">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-1 text-2xl font-bold text-primary">£{p.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">Up to {p.pages} pages · {p.ideal}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-10">
        <div className="content-width grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-title">Places near {loc.name} we build for</h2>
            <p className="text-body mt-3">We build for businesses all over the UK. If you work in or around {loc.name}, you might also serve:</p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Places near ${loc.name}`}>
              {loc.areas.map((a) => (
                <li key={a} className="rounded-full border border-border px-3 py-1.5 text-sm">{a}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <h2 className="text-title mb-4">How it works</h2>
            <ol className="space-y-4">
              {data.shared.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-background">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="content-width max-w-3xl">
          <h2 className="text-title mb-4">Questions from {loc.name} businesses</h2>
          <div className="divide-y divide-border rounded-xl border border-border">
            {faq.map((f) => (
              <details key={f.q} className="group p-4">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="content-width">
          <div className="bordered-highlight p-6 sm:p-8">
            <h2 className="text-title">Ready for a website that works for your {loc.name} business?</h2>
            <p className="text-body mt-2 max-w-2xl">See a sample built around your trade and your area first, or send us your project brief. We reply by email.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={`/preview?t=${encodeURIComponent(loc.name)}`} className="btn-primary btn-lg min-h-[48px] !text-background">Show my preview</Link>
              <Link to="/start" className="btn-outline btn-lg min-h-[48px]">Start your project</Link>
            </div>
            {near.length > 0 && (
              <p className="mt-6 text-sm text-muted-foreground">
                Web design nearby:{" "}
                {near.map((n, i) => (
                  <span key={n.slug}>
                    {i > 0 && ", "}
                    <Link className="underline underline-offset-4 hover:text-foreground" to={locationPath(n.slug)}>{n.name}</Link>
                  </span>
                ))}
                {" · "}
                <Link className="underline underline-offset-4 hover:text-foreground" to={HUB_PATH}>All areas</Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
