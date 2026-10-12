import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Finale } from "@/components/sections/Finale";
import { PricingStage, TierPicker } from "@/components/sections/PricingSection";
import { packages, addons, hosting } from "@/data/packages";

// JSON-LD structured data for SEO
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
        offers: {
          "@type": "Offer",
          price: pkg.price,
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  },
  provider: {
    "@type": "LocalBusiness",
    name: "OneSimpleSite",
    url: "https://onesimplesite.co.uk",
    email: "support@onesimplesite.co.uk",
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    priceRange: "£199 - £649",
  },
};

export default function Packages() {
  const [selected, setSelected] = useState(1);
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

      <section className="pb-6 pt-32 sm:pt-40">
        <div className="content-width">
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            Pricing
          </p>
          <h1 className="text-display max-w-5xl">
            Simple pricing for <span className="text-signal">local businesses</span>
          </h1>
          <p className="text-body-lg mt-6 max-w-xl">One-time payment. No monthly fees for the website itself. No surprises.</p>
        </div>
        <div className="content-width mt-8">
          <PricingStage selected={selected} onSelect={setSelected} className="h-[min(48svh,460px)] w-full md:h-[min(56vh,520px)]" />
          <div className="mx-auto mt-4 max-w-xl">
            <TierPicker selected={selected} onSelect={setSelected} id="pk" />
          </div>
        </div>
      </section>

      <section className="chapter chapter-paper chapter-sheet mt-16">
        <div className="content-width section">
          <div className="grid gap-5 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <article
                key={pkg.id}
                className={`slab relative flex flex-col p-6 sm:p-8 ${selected === i ? "!border-primary" : ""}`}
                itemScope
                itemType="https://schema.org/Product"
              >
                {pkg.popular && <span className="badge-primary absolute -top-3 left-6 !bg-primary !text-primary-foreground">Most Popular</span>}
                <header className="mb-6">
                  <h2 className="font-display text-2xl font-bold" style={{ letterSpacing: "-0.035em" }} itemProp="name">
                    {pkg.name}
                  </h2>
                  <p className="mb-4 mt-1 text-sm text-muted-foreground" itemProp="description">
                    {pkg.tagline}
                  </p>
                  <div className="flex items-baseline gap-1" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span className="font-display text-6xl font-extrabold text-signal" style={{ letterSpacing: "-0.05em" }}>
                      £<span itemProp="price">{pkg.price}</span>
                    </span>
                    <meta itemProp="priceCurrency" content="GBP" />
                    <span className="text-sm text-muted-foreground">one-time</span>
                  </div>
                </header>
                <ul className="mb-6 flex-1 space-y-2.5" role="list">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mono mb-4 flex justify-between border-t border-border pt-4 text-[11px] tracking-wide text-muted-foreground">
                  <span>DELIVERY {pkg.delivery.toUpperCase()}</span>
                  <span>PAY {pkg.payment.toUpperCase()}</span>
                </div>
                <Link to="/start" className={`${pkg.popular ? "btn-primary" : "btn-outline"} btn-md w-full gap-2`} aria-label={`Get started with ${pkg.name} package for £${pkg.price}`}>
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-3 text-center text-xs text-muted-foreground">Ideal for: {pkg.ideal}</p>
              </article>
            ))}
          </div>

          <div className="mt-20">
            <h2 className="text-headline">
              Optional <span className="text-signal">extras</span>
            </h2>
            <p className="mt-3 text-muted-foreground">Add what you need. Skip what you don't.</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {addons.map((a) => (
                <div key={a.name} className="slab-flat p-4">
                  <div className="font-display text-2xl font-bold text-signal">£{a.price}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{a.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="slab mt-16 grid gap-8 p-6 sm:p-10 md:grid-cols-2">
            <div>
              <p className="eyebrow mb-3">Optional monthly care</p>
              <h2 className="font-display text-3xl font-bold" style={{ letterSpacing: "-0.04em" }}>
                {hosting.name}
              </h2>
              <p className="mt-4 font-display text-5xl font-extrabold text-signal" style={{ letterSpacing: "-0.05em" }}>
                £{hosting.price}
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
              <p className="mt-4 text-xs text-muted-foreground">No contract. Cancel anytime. First month free with any package.</p>
            </div>
            <ul className="space-y-3 text-sm">
              {hosting.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-signal" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Finale title="Ready to get" highlighted="started?" description="Most businesses choose The Sorted. Not sure? We'll help you pick." primaryText="Start Your Project" secondaryText="" />
    </Layout>
  );
}
