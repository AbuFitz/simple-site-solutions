import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { SITE } from "@/data/site";
import locationData from "@/data/locations.json";
import { HUB_PATH, hubDescription, hubJsonLd, hubTitle, locationPath, type LocData } from "@/lib/locationSeo.mjs";

const data = locationData as LocData;
const counties = [...new Set(data.locations.map((l) => l.county))];

export default function WebDesignHub() {
  return (
    <Layout>
      <Seo path={HUB_PATH} title={hubTitle} description={hubDescription} jsonLd={hubJsonLd(data, SITE.url)} />
      <section className="relative pb-10 pt-24 sm:pb-14 sm:pt-32">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10 max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link> / <span aria-current="page">Web design</span>
          </nav>
          <h1 className="text-headline">
            Web design <span className="text-primary">across the UK</span>
          </h1>
          <p className="text-body-lg mt-4">{data.ukLine}</p>
          <p className="text-body mt-3">We work online, at fixed prices, with local businesses wherever they are. These pages cover the areas we are building local search presence for first, with local detail for each. If your town is not listed, nothing changes: we build for businesses across the UK.</p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="content-width space-y-10">
          {counties.map((c) => (
            <div key={c}>
              <h2 className="text-title mb-4">{c}</h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.locations.filter((l) => l.county === c).map((l) => (
                  <li key={l.slug}>
                    <Link to={locationPath(l.slug)} className="bordered-section group flex h-full min-h-[88px] flex-col justify-between bg-card p-4 transition-colors hover:border-primary">
                      <span className="flex items-center justify-between gap-3 font-semibold">
                        Web design {l.name}
                        <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
                      </span>
                      <span className="mt-2 text-sm text-muted-foreground">{l.areas.slice(0, 4).join(", ")} and nearby</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="bordered-highlight p-6 sm:p-8">
            <h2 className="text-title">Somewhere else in the UK?</h2>
            <p className="text-body mt-2 max-w-2xl">Same packages, same fixed prices. See a sample for your trade and town, or send us your brief.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/preview" className="btn-primary btn-lg min-h-[48px] !text-background">Show my preview</Link>
              <Link to="/packages" className="btn-outline btn-lg min-h-[48px]">Packages and prices</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
