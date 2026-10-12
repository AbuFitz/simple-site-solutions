import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Pill } from "@/components/oss/Pill";
import { Shot } from "@/components/oss/Shot";
import { getProject, WorkProject } from "@/data/work";
import { addons, hosting, packages } from "@/data/packages";

const P = (slug: string) => getProject(slug) as WorkProject;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Web Design Packages & Pricing | OneSimpleSite",
  description: "Professional website packages for UK local businesses. The Starter £199, The Sorted £399, The Works £649. No hidden fees.",
  url: "https://onesimplesite.co.uk/packages",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: packages.map((pkg, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: pkg.name,
        description: pkg.tagline,
        offers: { "@type": "Offer", price: pkg.price, priceCurrency: "GBP", availability: "https://schema.org/InStock" },
      },
    })),
  },
  provider: {
    "@type": "LocalBusiness",
    name: "OneSimpleSite",
    url: "https://onesimplesite.co.uk",
    email: "support@onesimplesite.co.uk",
    areaServed: { "@type": "Country", name: "United Kingdom" },
    priceRange: "£199 - £649",
  },
};

const compare: [string, (p: (typeof packages)[number]) => string][] = [
  ["Pages", (p) => `Up to ${p.pages}`],
  ["Delivery", (p) => p.delivery],
  ["Payment", (p) => p.payment],
  ["Revision rounds", (p) => p.features.find((f) => f.includes("revision"))?.split(" ")[0] ?? ""],
  ["Ideal for", (p) => p.ideal],
];

export default function Packages() {
  return (
    <Layout>
      <Helmet>
        <title>Web Design Packages & Pricing | From £199 | OneSimpleSite</title>
        <meta
          name="description"
          content="Affordable web design packages for UK local businesses. The Starter £199, The Sorted £399, The Works £649. Professional websites with SEO, mobile-first design, and no hidden fees. Get online in 5-14 days."
        />
        <link rel="canonical" href="https://onesimplesite.co.uk/packages" />
        <meta property="og:title" content="Web Design Packages | From £199 | OneSimpleSite" />
        <meta property="og:url" content="https://onesimplesite.co.uk/packages" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <section className="pb-14 pt-12 md:pb-24 md:pt-20">
        <div className="content-width grid gap-10 lg:grid-cols-12">
          <p className="t-label lg:col-span-3">Pricing</p>
          <div className="lg:col-span-9">
            <h1 className="t-display" style={{ fontSize: "clamp(2.7rem, 7vw, 6.25rem)" }}>
              Simple pricing,
              <span className="block md:pl-[14%]">for local businesses.</span>
            </h1>
            <p className="t-lead mt-8 max-w-md md:ml-[14%]">One-time payment. No monthly fees for the website itself. No surprises.</p>
          </div>
        </div>
      </section>

      {/* Three tiers: staggered, the popular one in black */}
      <section className="pb-20 md:pb-28" aria-label="Packages">
        <div className="content-width grid gap-5 lg:grid-cols-12 lg:items-start">
          {packages.map((p, i) => (
            <article
              key={p.id}
              className={`flex flex-col rounded-[28px] p-7 md:p-10 lg:col-span-4 ${p.popular ? "theme-ink lg:-mt-8 lg:pb-14" : "border border-border bg-card"} ${i === 2 ? "lg:mt-16" : ""}`}
              itemScope
              itemType="https://schema.org/Product"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="t-h3" itemProp="name">{p.name}</h2>
                {p.popular && <span className="badge-primary">Most popular</span>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground" itemProp="description">{p.tagline}</p>
              <p className="mt-8 flex items-baseline gap-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <span className="font-display font-bold" style={{ fontSize: "clamp(3.75rem, 6vw, 5.5rem)", letterSpacing: "-0.05em", lineHeight: 1 }}>
                  £<span itemProp="price">{p.price}</span>
                </span>
                <meta itemProp="priceCurrency" content="GBP" />
                <span className="text-sm text-muted-foreground">one-time</span>
              </p>
              <ul className="mt-8 flex-1 space-y-2.5 text-[0.9375rem]" role="list">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Pill to="/start" variant={p.popular ? "ink" : "outline"}>Choose {p.name.replace("The ", "")}</Pill>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Ideal for: {p.ideal}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Side by side */}
      <section className="pb-24 md:pb-36" aria-labelledby="compare-title">
        <div className="content-width">
          <h2 id="compare-title" className="t-h2">Side by side.</h2>
          <div className="mt-10">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Comparison of the three packages</caption>
              <thead>
                <tr className="border-b-2 border-foreground">
                  <th scope="col" className="py-4 pr-4 text-sm font-semibold"><span className="sr-only">Feature</span></th>
                  {packages.map((p) => (
                    <th key={p.id} scope="col" className="py-4 pr-3 align-bottom font-display text-base font-bold md:text-xl" style={{ letterSpacing: "-0.03em" }}>
                      {p.name.replace("The ", "")}<span className="block text-primary">£{p.price}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.map(([label, fn]) => (
                  <tr key={label} className="border-b border-border">
                    <th scope="row" className="w-[26%] py-4 pr-3 align-top text-sm font-semibold">{label}</th>
                    {packages.map((p) => (
                      <td key={p.id} className="py-4 pr-3 align-top text-sm md:text-[0.9375rem]">{fn(p)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Extras and hosting */}
      <section className="pb-28 md:pb-40">
        <div className="content-width grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="t-h2">Optional extras.</h2>
            <ul className="mt-10 border-t border-border">
              {addons.map((a) => (
                <li key={a.name} className="flex items-baseline justify-between border-b border-border py-4">
                  <span className="font-display text-xl font-semibold" style={{ letterSpacing: "-0.025em" }}>{a.name}</span>
                  <span className="nums font-semibold">£{a.price}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="theme-ink rounded-[28px] p-8 md:p-10">
              <p className="t-label">Optional monthly care</p>
              <h2 className="t-h3 mt-4">{hosting.name}</h2>
              <p className="mt-6 font-display font-bold" style={{ fontSize: "4.5rem", letterSpacing: "-0.05em", lineHeight: 1 }}>
                £{hosting.price}<span className="text-xl font-semibold text-muted-foreground">/month</span>
              </p>
              <ul className="mt-8 space-y-2.5 text-[0.9375rem]">
                {hosting.features.map((f) => (
                  <li key={f} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{f}</li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-muted-foreground">No contract. Cancel anytime. First month free with any package.</p>
            </div>
            <div className="mt-8 flex items-center gap-5">
              <div className="w-28 shrink-0"><Shot project={P("quantum-biotesting")} kind="t" contour="pebble" ratio="1 / 1" sizes="120px" decorative /></div>
              <p className="text-sm text-muted-foreground">Not sure which package? <Link to="/start" className="link-line text-foreground">Choose &ldquo;Not sure yet&rdquo; on the form</Link> and we will help you pick.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
