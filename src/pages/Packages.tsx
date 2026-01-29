import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { CTASection } from "@/components/CTASection";
import { motion } from "framer-motion";
import { Check, ArrowUpRight, X } from "lucide-react";

const packages = [
  {
    name: "Essential",
    price: "£199",
    description: "For getting online properly. No fluff, no upsell traps.",
    features: [
      "Complete website (all necessary pages)",
      "Clean, mobile-first design",
      "Clear services & contact flow",
      "Local SEO foundations baked in",
      "Google Map + service area",
      "Contact, call & WhatsApp setup",
      "Cookie notice & privacy compliance",
    ],
    notIncluded: [
      "Heavy strategy work",
      "Multiple refinement rounds",
      "Deep positioning work",
    ],
    popular: false,
    perfectFor: ["New businesses", "Sole traders", "Getting online fast"],
    payment: "Paid upfront",
  },
  {
    name: "Business",
    price: "£399",
    description: "For businesses that want clarity and confidence.",
    features: [
      "Everything in Essential, plus:",
      "Clear service hierarchy (built for Google + humans)",
      "Conversion-focused layout",
      "Trust positioning (reviews, guarantees, proof)",
      "Refined messaging (what you do, who it's for, why you)",
      "1–2 refinement rounds",
    ],
    popular: true,
    perfectFor: ["Established businesses", "Service-based trades", "Anyone wanting it done right"],
    payment: "50% upfront / 50% before launch",
  },
  {
    name: "Growth",
    price: "£649",
    description: "For businesses that want to compete seriously.",
    features: [
      "Everything in Business, plus:",
      "Deeper positioning & differentiation",
      "SEO-led structure from day one",
      "Analytics setup",
      "Built to scale with future content",
      "Multiple refinement rounds",
    ],
    popular: false,
    perfectFor: ["Businesses investing in growth", "Competitive markets", "Long-term thinkers"],
    payment: "50% upfront / 50% before launch",
  },
];

const addons = [
  {
    name: "Google Business Profile Setup",
    price: "£99",
    description: "Profile setup or clean-up, category optimisation, business description, service area setup"
  },
  {
    name: "Speed & Performance",
    price: "£99",
    description: "Image optimisation, performance clean-up, mobile optimisation pass"
  },
  {
    name: "Yearly Maintenance",
    price: "£95/year",
    description: "Security updates, minor text changes, basic health checks, support when needed"
  },
];

const hosting = {
  name: "Hosting + Domain",
  price: "£95/year",
  features: ["Reliable hosting", "Domain connection", "SSL certificate", "Basic monitoring", "One point of contact"],
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
              Honest pricing. <span className="text-primary">No surprises.</span>
            </h1>
            <p className="text-body-lg max-w-2xl">
              Pick a package. Get your site. Local SEO included in every package.
              No hidden fees, no upsell traps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section-sm">
        <div className="content-width">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                className={`relative rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col border-2 bg-card ${
                  pkg.popular
                    ? "border-primary lg:scale-105 lg:-my-4"
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
                    <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider border-2 border-primary">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6 sm:mb-8 pt-2">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">{pkg.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-primary">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">one-time</span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">{pkg.description}</p>
                </div>

                <ul className="space-y-2.5 sm:space-y-3 flex-1 mb-4">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 sm:gap-3">
                      <div className="check-icon w-4 h-4 sm:w-5 sm:h-5">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Not included section for Essential */}
                {pkg.notIncluded && (
                  <ul className="space-y-2 mb-6 pt-4 border-t border-border">
                    {pkg.notIncluded.map((item) => (
                      <li key={item} className="flex items-start gap-2 sm:gap-3 text-muted-foreground">
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/50" />
                        <span className="text-xs sm:text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Perfect for section */}
                <div className="mb-6 p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-2">Perfect for</div>
                  <ul className="space-y-1">
                    {pkg.perfectFor.map((item) => (
                      <li key={item} className="text-xs sm:text-sm text-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Payment terms */}
                <div className="mb-6 text-xs sm:text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Payment:</span> {pkg.payment}
                </div>

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
                  Don't want to deal with hosting and technical setup? We'll handle it.
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
                  Only if you need them. No pressure, no upsells.
                </p>
              </div>

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {addons.map((addon) => (
                  <div
                    key={addon.name}
                    className="p-4 sm:p-5 rounded-lg sm:rounded-xl bg-secondary border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm sm:text-base font-semibold">{addon.name}</span>
                      <span className="text-primary font-bold text-sm sm:text-base">{addon.price}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{addon.description}</p>
                  </div>
                ))}
              </div>

              {/* What's included note */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
                <h4 className="font-semibold mb-3 text-base sm:text-lg">What's included in every package</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    "Local SEO foundations",
                    "Mobile-first design",
                    "Contact forms & WhatsApp",
                    "Google Map integration",
                    "Cookie & privacy compliance",
                    "Clean, professional look",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs sm:text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refinements note */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border">
                <h4 className="font-semibold mb-3 text-base sm:text-lg">About refinements</h4>
                <p className="text-muted-foreground text-xs sm:text-sm mb-4">
                  Business and Growth packages include refinement rounds for text changes, image swaps,
                  and small layout tweaks. Essential is built right the first time — no back-and-forth needed.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Not sure which"
        highlightedText="package?"
        description="Business is our most popular — it includes everything most local businesses need, with room to refine."
        primaryButtonText="Start with Business"
        primaryButtonLink="/start"
      />
    </Layout>
  );
}
