import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { CTASection } from "@/components/CTASection";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

const packages = [
  {
    id: "starter",
    name: "The Starter",
    price: "199",
    tagline: "Get online properly",
    ideal: "New businesses & sole traders",
    features: [
      "Up to 3 pages",
      "Professional copywriting",
      "Mobile-first design",
      "Contact form + WhatsApp",
      "Google Maps",
      "Basic SEO",
      "SSL + Speed optimised",
      "1 revision round",
    ],
    delivery: "5–7 days",
    payment: "Upfront",
  },
  {
    id: "sorted",
    name: "The Sorted",
    price: "399",
    tagline: "Look established, win trust",
    ideal: "Growing businesses",
    popular: true,
    features: [
      "Up to 6 pages",
      "Everything in Starter, plus:",
      "Conversion-focused layout",
      "Reviews & trust signals",
      "Booking system included",
      "Full on-page SEO",
      "Free domain (1st year)",
      "Business email setup",
      "2 revision rounds",
    ],
    delivery: "7–10 days",
    payment: "50% upfront",
  },
  {
    id: "works",
    name: "The Works",
    price: "649",
    tagline: "Compete seriously, scale",
    ideal: "Established businesses",
    features: [
      "Up to 10 pages",
      "Everything in Sorted, plus:",
      "SEO-led architecture",
      "Location pages for local SEO",
      "Blog setup + 1 post",
      "Google Analytics setup",
      "Advanced booking",
      "Full legal pages",
      "3 revision rounds",
    ],
    delivery: "10–14 days",
    payment: "50% upfront",
  },
];

const addons = [
  { name: "Logo Design", price: "49" },
  { name: "Google Business Setup", price: "39" },
  { name: "Booking System", price: "39" },
  { name: "Email Templates ×3", price: "29" },
  { name: "SEO Audit Report", price: "59" },
  { name: "Legal Pages Pack", price: "19" },
];

const hosting = {
  name: "Keep It Running",
  price: "19",
  features: [
    "Website hosting & domain",
    "SSL certificate",
    "Weekly backups",
    "Security monitoring",
    "Up to 5 content updates/month",
    "Priority support",
  ],
};

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
  return (
    <Layout>
      <Helmet>
        <title>Web Design Packages & Pricing | From £199 | OneSimpleSite</title>
        <meta
          name="description"
          content="Affordable web design packages for UK local businesses. The Starter £199, The Sorted £399, The Works £649. Professional websites with SEO, mobile-first design, and no hidden fees. Get online in 5-14 days."
        />
        <meta
          name="keywords"
          content="web design prices UK, website cost small business, affordable web design, local business website, website packages UK, cheap website design, professional website cost, web design pricing, small business website cost, tradesman website"
        />
        <link rel="canonical" href="https://onesimplesite.co.uk/packages" />

        {/* Open Graph */}
        <meta property="og:title" content="Web Design Packages | From £199 | OneSimpleSite" />
        <meta property="og:description" content="Professional websites for UK local businesses. Simple pricing, no hidden fees. Get online in days, not months." />
        <meta property="og:url" content="https://onesimplesite.co.uk/packages" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Web Design Packages | From £199" />
        <meta name="twitter:description" content="Professional websites for UK local businesses. Simple pricing, no hidden fees." />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

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
              One-time payment. No monthly fees for the website itself. No surprises.
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
                  pkg.popular
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
                {pkg.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full">
                      Most Popular
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
                  to="/start"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all ${
                    pkg.popular
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
              No contract. Cancel anytime. First month free with any package.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-8 sm:py-10 border-y border-border bg-card">
        <div className="content-width">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> No hidden fees
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> SEO included
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> Mobile-first
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> Fast delivery
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> UK-based
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to get"
        highlightedText="started?"
        description="Most businesses choose The Sorted. Not sure? We'll help you pick."
        primaryButtonText="Start Your Project"
        primaryButtonLink="/start"
      />
    </Layout>
  );
}
