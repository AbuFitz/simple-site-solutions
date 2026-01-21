import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { CTASection } from "@/components/CTASection";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";

const packages = [
  {
    name: "Starter",
    price: "£499",
    description: "For businesses that want a proper, professional website. Not basic — just focused.",
    features: [
      "Market & competitor review",
      "Up to 3 pages",
      "Mobile-friendly, modern design",
      "Contact form, click-to-call, WhatsApp",
      "Google Map + service area",
      "Trust sections (reviews, guarantees)",
      "SEO basics + cookie notice",
      "1 refinement round",
    ],
    popular: false,
  },
  {
    name: "Core",
    price: "£699",
    description: "For businesses that want more room and clarity. The balance package.",
    features: [
      "Everything in Starter, plus:",
      "Deeper market review",
      "Up to 4–5 pages",
      "Clearer service breakdown",
      "Stronger trust & credibility flow",
      "Better content structure",
      "1–2 refinement rounds",
    ],
    popular: true,
  },
  {
    name: "Growth",
    price: "£899",
    description: "For businesses that want to compete and look established.",
    features: [
      "Everything in Core, plus:",
      "Deeper positioning decisions",
      "Up to 6 pages",
      "Clear service hierarchy (SEO-ready)",
      "Strong trust positioning",
      "Basic analytics setup",
      "2 refinement rounds",
    ],
    popular: false,
  },
];

const addons = [
  { name: "Booking System", price: "£150" },
  { name: "Blog Setup", price: "£120" },
  { name: "Blog Post Writing", price: "£75" },
  { name: "SEO Content Writing", price: "£95/page" },
  { name: "Local SEO Setup", price: "£150" },
  { name: "Simple Logo Refresh", price: "£120" },
];

const hosting = {
  name: "Hosting",
  price: "£15/month",
  features: ["Secure hosting", "SSL (https)", "Backups", "Updates", "Minor fixes if needed"],
};

export default function Packages() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 relative">
        <DottedGrid className="opacity-40" spacing={36} />
        <div className="content-width relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bordered-section inline-block px-4 py-2 mb-4 sm:mb-6">
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Pricing
              </span>
            </div>
            <h1 className="text-display mb-6 sm:mb-8">
              Simple pricing. <span className="text-primary">No surprises.</span>
            </h1>
            <p className="text-body-lg max-w-2xl">
              Pick a package. Get your site. Every package includes market research, 
              proven layouts, and refinement rounds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section-sm">
        <div className="content-width">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                className={`relative rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col border-2 bg-card hover-lift ${
                  pkg.popular
                    ? "border-primary"
                    : "border-border"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute -top-3 left-4 sm:left-6">
                    <span className="inline-flex items-center px-3 sm:px-4 py-1 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider border-2 border-primary">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6 sm:mb-8 pt-2">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-primary">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">one-time</span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">{pkg.description}</p>
                </div>

                <ul className="space-y-2.5 sm:space-y-3 flex-1 mb-6 sm:mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 sm:gap-3">
                      <div className="check-icon w-4 h-4 sm:w-5 sm:h-5">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/start"
                  className={`w-full flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold transition-all border-2 ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground border-primary hover:brightness-110"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  Get Started
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="bordered-section p-5 sm:p-8 md:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  {hosting.name} <span className="text-primary">(Optional)</span>
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-0">
                  Want us to host and maintain your site? You're also free to host it yourself.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl sm:text-3xl font-bold text-primary">{hosting.price}</span>
              </div>
            </div>
            <ul className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6">
              {hosting.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-xs sm:text-sm">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section relative">
        <DottedGrid className="opacity-30" spacing={40} />
        <div className="content-width relative z-10">
          <motion.div
            className="bordered-section p-4 sm:p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <DottedGrid className="opacity-15" spacing={24} />
            <div className="relative z-10">
              <div className="mb-8 sm:mb-12">
                <h2 className="text-headline">
                  Optional <span className="text-primary">extras</span>
                </h2>
                <p className="text-body-lg mt-3 sm:mt-4">
                  Only if you want them. One-off, clear, understandable.
                </p>
              </div>

              <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {addons.map((addon) => (
                  <div
                    key={addon.name}
                    className="flex items-center justify-between p-4 sm:p-5 rounded-lg sm:rounded-xl bg-secondary border border-border"
                  >
                    <span className="text-sm sm:text-base font-medium">{addon.name}</span>
                    <span className="text-primary font-bold text-sm sm:text-base">{addon.price}</span>
                  </div>
                ))}
              </div>

              {/* Updates section */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border">
                <h4 className="font-semibold mb-3 text-sm sm:text-base">Updates & Changes</h4>
                <p className="text-muted-foreground text-xs sm:text-sm mb-4">
                  No subscriptions. No pressure. Just fair, when you need it.
                </p>
                <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                  <span><strong className="text-primary">£30</strong> — Small text/image update</span>
                  <span><strong className="text-primary">£85</strong> — New page</span>
                  <span><strong className="text-primary">Quoted</strong> — Bigger changes</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Not sure which"
        highlightedText="package?"
        description="Start with Core. It's our most popular and includes everything most local businesses need."
        primaryButtonText="Start with Core"
        primaryButtonLink="/start"
      />
    </Layout>
  );
}
