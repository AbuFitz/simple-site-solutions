import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { CTASection } from "@/components/CTASection";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";

const packages = [
  {
    name: "Essential",
    price: "£199",
    originalPrice: "£249",
    description: "Everything you need to get online properly. Clean, professional, done.",
    features: [
      "Complete website (all necessary pages)",
      "Clean, mobile-first design",
      "Clear services & contact flow",
      "Local SEO foundations baked in",
      "Google Maps integration",
      "Contact forms, click-to-call & WhatsApp",
      "Cookie notice & privacy compliance",
      "Speed optimised",
    ],
    popular: false,
    perfectFor: ["New businesses", "Sole traders", "Getting online fast"],
    payment: "Paid upfront",
  },
  {
    name: "Business",
    price: "£399",
    description: "Our most popular. Built for businesses that want to look established and win trust.",
    features: [
      "Everything in Essential, plus:",
      "Conversion-focused layout",
      "Trust positioning (reviews, guarantees, proof)",
      "Clear service hierarchy",
      "Refined messaging that actually sells",
      "Built to make you look like the obvious choice",
    ],
    popular: true,
    perfectFor: ["Established businesses", "Service-based trades", "Anyone wanting it done right"],
    payment: "50% upfront / 50% before launch",
  },
  {
    name: "Growth",
    price: "£649",
    description: "For businesses investing seriously in standing out and scaling.",
    features: [
      "Everything in Business, plus:",
      "Deeper positioning & differentiation",
      "SEO-led structure from day one",
      "Analytics setup",
      "Built to scale with future content",
      "Multiple rounds of refinements",
    ],
    popular: false,
    perfectFor: ["Competitive markets", "Businesses investing in growth", "Long-term thinkers"],
    payment: "50% upfront / 50% before launch",
  },
];

const optionalExtras = [
  {
    name: "Hosting + Maintenance",
    price: "£95/year",
    description: "We host your site, handle updates, make minor changes throughout the year, and support you when needed. Everything handled.",
  },
  {
    name: "Google Business Profile Setup",
    price: "£79",
    description: "Profile creation or cleanup, category optimisation, service area setup, photo guidance, first posts, and review response templates.",
  },
];

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
              Pick a package. Get your site. Local SEO and speed optimisation included in every package.
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
                    {pkg.originalPrice && (
                      <span className="text-lg sm:text-xl text-muted-foreground line-through">
                        {pkg.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl sm:text-4xl font-bold text-primary">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">one-time</span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">{pkg.description}</p>
                </div>

                <ul className="space-y-2.5 sm:space-y-3 flex-1 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 sm:gap-3">
                      <div className="check-icon w-4 h-4 sm:w-5 sm:h-5">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

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

      {/* Optional Extras */}
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

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 max-w-3xl">
                {optionalExtras.map((extra) => (
                  <div
                    key={extra.name}
                    className="p-5 sm:p-6 rounded-xl bg-secondary border border-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base sm:text-lg font-semibold">{extra.name}</span>
                      <span className="text-primary font-bold text-base sm:text-lg">{extra.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{extra.description}</p>
                  </div>
                ))}
              </div>

              {/* What's included note */}
              <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-border">
                <h4 className="font-semibold mb-4 text-base sm:text-lg">What's included in every package</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    "Local SEO foundations",
                    "Mobile-first design",
                    "Speed & performance optimised",
                    "Contact forms & WhatsApp",
                    "Google Maps integration",
                    "Cookie & privacy compliance",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs sm:text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* This might not be for you */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-headline mb-6">
              We're not for <span className="text-primary">everyone</span>
            </h2>
            <p className="text-body-lg text-muted-foreground mb-6">
              We build websites that work — clean, fast, and focused on getting you customers.
              If you want endless design options, mood boards, or "creative exploration", we're not the right fit.
            </p>
            <p className="text-body-lg text-muted-foreground mb-6">
              But if you want a professional site that makes you look established, ranks locally, and actually converts visitors into enquiries — that's exactly what we do.
            </p>
            <p className="text-body text-muted-foreground">
              We've built sites for plumbers, electricians, mechanics, cleaners, barbers, tutors, and more.
              We know what works because we've seen it work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Not sure which"
        highlightedText="package?"
        description="Most businesses go with Business — it's everything you need to look established and win trust. But if you just need to get online, Essential does the job."
        primaryButtonText="Get Started"
        primaryButtonLink="/start"
        showPhone={true}
      />
    </Layout>
  );
}
