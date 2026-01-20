import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { CTASection } from "@/components/CTASection";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { TrustStrip } from "@/components/TrustStrip";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, X, Zap, Target, Clock, Smartphone } from "lucide-react";

const typewriterWords = ["converts.", "performs.", "delivers.", "works."];

const benefits = [
  {
    icon: Zap,
    title: "5-10 Days",
    description: "Your site goes live fast. No waiting months.",
  },
  {
    icon: Target,
    title: "Proven Layouts",
    description: "Built from what already converts.",
  },
  {
    icon: Clock,
    title: "No Drama",
    description: "No endless meetings or moodboards.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Perfect on every device.",
  },
];

const notForYou = [
  "Unlimited revisions",
  "Design it yourself",
  "Custom web apps",
  "The cheapest option",
];

const forYou = [
  "A website that converts",
  "Proven industry layouts",
  "Fast, reliable delivery",
  "Results over opinions",
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section - Tighter on mobile */}
      <section className="min-h-[75vh] sm:min-h-[85vh] flex items-center pt-20 pb-6 sm:pt-24 sm:pb-10 md:pt-28 md:pb-16 relative">
        <DottedGrid className="opacity-40" spacing={28} />
        <div className="content-width relative z-10">
          <div className="max-w-4xl">
            <motion.div
              className="bordered-section inline-block px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Websites for Local UK Businesses
              </span>
            </motion.div>

            <motion.h1
              className="text-display mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Websites that{" "}
              <span className="text-primary">
                <TypewriterText texts={typewriterWords} speed={120} />
              </span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              Not just impress.
            </motion.h1>

            <motion.p
              className="text-body-lg max-w-2xl mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Fast, proven websites for local businesses using layouts that
              already work in your industry.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/start"
                className="btn-primary btn-lg w-full sm:w-auto justify-center"
              >
                Get Started
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
              <Link
                to="/packages"
                className="btn-outline btn-lg w-full sm:w-auto justify-center"
              >
                View Pricing
              </Link>
            </motion.div>

            {/* Trust strip */}
            <TrustStrip />
          </div>
        </div>
      </section>

      {/* Portfolio - Tighter spacing */}
      <PortfolioShowcase />

      {/* Benefits - Compact grid */}
      <section className="py-12 sm:py-16 md:py-24 relative">
        <DottedGrid className="opacity-30" spacing={36} />
        <div className="content-width relative z-10">
          <motion.div
            className="mb-6 sm:mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="badge-primary mb-3 inline-block">Why Us</span>
            <h2 className="text-headline max-w-xl">
              Built from what <span className="text-primary">already works</span>
            </h2>
          </motion.div>

          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="feature-item p-4 sm:p-5 md:p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="step-number w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4">
                  <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Is This For You - Compact */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="content-width">
          <motion.div
            className="bordered-section-lg p-4 sm:p-6 md:p-10 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <DottedGrid className="opacity-20" spacing={24} />
            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  This is <span className="text-primary">not</span> for everyone
                </h2>
              </div>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2 max-w-4xl mx-auto">
                {/* Not For You */}
                <motion.div
                  className="card-dark p-4 sm:p-5 md:p-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-muted-foreground">
                    Not for you if you want...
                  </h3>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {notForYou.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center shrink-0">
                          <X className="w-2.5 h-2.5 text-destructive" />
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* For You */}
                <motion.div
                  className="card-highlight p-4 sm:p-5 md:p-6"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-sm sm:text-base font-bold mb-3 sm:mb-4">
                    Perfect if you want...
                  </h3>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {forYou.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <div className="check-icon w-5 h-5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-xs sm:text-sm text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Let's build something"
        highlightedText="that converts."
        description="Pick your package. Send your details. Get a website in days, not months."
        primaryButtonText="Start Your Project"
        primaryButtonLink="/start"
        secondaryButtonText="See Pricing"
        secondaryButtonLink="/packages"
      />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />
    </Layout>
  );
}
