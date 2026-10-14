import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { CTASection } from "@/components/CTASection";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { ShopCrossSell } from "@/components/shop/ShopCrossSell";
import { addons, hosting, packages } from "@/data/packages";
import { DELIVERY_NOTE } from "@/data/site";

const comparison: { label: string; values: [string, string, string] }[] = [
  { label: "Pages", values: ["Up to 3", "Up to 6", "Up to 10"] },
  { label: "Copywriting", values: ["Included", "Included", "Included"] },
  { label: "Contact form + WhatsApp, Google Maps", values: ["Included", "Included", "Included"] },
  { label: "SEO", values: ["Basic", "Full on-page", "SEO-led structure"] },
  { label: "Booking system", values: ["—", "Included", "Advanced"] },
  { label: "Reviews & trust signals", values: ["—", "Included", "Included"] },
  { label: "Free domain (1st year)", values: ["—", "Included", "Included"] },
  { label: "Business email setup", values: ["—", "Included", "Included"] },
  { label: "Location pages for local SEO", values: ["—", "—", "Included"] },
  { label: "Blog setup + 1 post", values: ["—", "—", "Included"] },
  { label: "Google Analytics setup", values: ["—", "—", "Included"] },
  { label: "Full legal pages", values: ["—", "—", "Included"] },
  { label: "Revision rounds", values: ["1", "2", "3"] },
  { label: "Estimated delivery", values: ["5–7 days", "7–10 days", "10–14 days"] },
  { label: "Payment", values: ["Upfront", "50% upfront", "50% upfront"] },
];

export default function Packages() {
  return (
    <Layout>
      <Seo path="/packages"
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Packages", path: "/packages" },
        ])}
      />

      {/* Hero - Clean & Direct */}
      <section className="pt-24 pb-8 sm:pt-32 sm:pb-12 md:pt-36 md:pb-16 relative">
        <DottedGrid className="opacity-30" spacing={40} />
        <div className="content-width relative z-10">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Simple pricing for <span className="text-primary">local businesses</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              A fixed price for each package. Optional extras and monthly care are priced separately, below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages - Clean Cards */}
      <section className="pb-16 sm:pb-20 md:pb-24">
        <div className="content-width">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <motion.article
                key={pkg.id}
                className={`relative rounded-2xl p-6 sm:p-8 flex flex-col ${
                  pkg.recommended
                    ? "bg-primary/5 border-2 border-primary"
                    : "bg-card border border-border"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                itemScope
                itemType="https://schema.org/Product"
              >
                {pkg.recommended && (
                  <div className="absolute -top-3 left-6">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
                      Recommended
                    </span>
                  </div>
                )}

                <header className="mb-6">
                  <h2 className="text-xl font-bold mb-1" itemProp="name">{pkg.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4" itemProp="description">{pkg.tagline}</p>
                  <div className="flex items-baseline gap-1" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span className="text-4xl font-bold text-primary" itemProp="price">£{pkg.price}</span>
                    <meta itemProp="priceCurrency" content="GBP" />
                    <span className="text-muted-foreground text-sm">one-time</span>
                  </div>
                </header>

                <ul className="space-y-2.5 flex-1 mb-6" role="list">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-xs text-muted-foreground mb-4 flex justify-between border-t border-border pt-4">
                  <span>Delivery: <strong className="text-foreground">{pkg.delivery}</strong></span>
                  <span>Payment: <strong className="text-foreground">{pkg.payment}</strong></span>
                </div>

                <Link
                  to={`/start?package=${pkg.id}`}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all ${
                    pkg.recommended
                      ? "bg-primary text-primary-foreground hover:brightness-110"
                      : "bg-secondary text-foreground border border-border hover:bg-muted"
                  }`}
                  aria-label={`Get started with ${pkg.name} package for £${pkg.price}`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  Ideal for: {pkg.ideal}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="pb-16 sm:pb-20">
        <div className="content-width">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
            Compare <span className="text-primary">packages</span>
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-6">A dash means it isn't included. Anything not listed isn't included either; ask if you're unsure.</p>
          <div role="region" aria-label="Package comparison table" tabIndex={0} className="relative overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[34rem] text-sm">
              <caption className="sr-only">What each package includes</caption>
              <thead>
                <tr className="bg-card text-left">
                  <th scope="col" className="p-3 font-semibold">&nbsp;</th>
                  {packages.map((p) => (
                    <th key={p.id} scope="col" className="p-3 font-semibold">{p.name}<span className="block font-normal text-muted-foreground">£{p.price}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <th scope="row" className="p-3 text-left font-medium">{row.label}</th>
                    {row.values.map((v, i) => (
                      <td key={i} className="p-3 text-muted-foreground">{v === "—" ? <><span aria-hidden="true">—</span><span className="sr-only">Not included</span></> : v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-ons - Compact Grid */}
      <section className="py-12 sm:py-16 bg-secondary/30 border-y border-border">
        <div className="content-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Optional <span className="text-primary">extras</span>
              </h2>
              <p className="text-muted-foreground text-sm">Add what you need. Skip what you don't.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {addons.map((addon) => (
                <div
                  key={addon.name}
                  className="bg-card border border-border rounded-xl p-4 text-center"
                >
                  <div className="text-lg font-bold text-primary mb-1">£{addon.price}</div>
                  <div className="text-xs text-muted-foreground">{addon.name}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hosting */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="content-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Keep it <span className="text-primary">running</span>
            </h2>
            <p className="text-muted-foreground text-sm mb-6">Optional monthly care</p>

            <div className="rounded-xl p-6 bg-card border border-border">
              <div className="text-3xl font-bold mb-1">
                <span className="text-primary">£{hosting.price}</span>
                <span className="text-base text-muted-foreground font-normal">/month</span>
              </div>
              <div className="font-semibold mb-4">{hosting.name}</div>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                {hosting.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Optional. Either side can end it with 30 days' notice (see our terms).
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="content-width">
          <ShopCrossSell context="website" slugs={["review-kit", "qr-table-sign", "sticker-pack"]} />
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-8 sm:py-10 border-y border-border bg-card">
        <div className="content-width">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> Prices shown up front
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> Mobile-first design
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> Built for UK businesses
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> {DELIVERY_NOTE}
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to get"
        highlightedText="started?"
        description="Not sure which package fits? Send a short brief and we'll suggest one."
        primaryButtonText="Start Your Project"
        primaryButtonLink="/start"
      />
    </Layout>
  );
}
