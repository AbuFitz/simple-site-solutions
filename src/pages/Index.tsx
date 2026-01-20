import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, X, Zap, Target, Clock, Smartphone } from "lucide-react";

const typewriterWords = ["converts.", "performs.", "delivers.", "works."];

const benefits = [
  {
    icon: Zap,
    title: "5-10 Days",
    description: "Your site goes live fast. No waiting months for a simple website.",
  },
  {
    icon: Target,
    title: "Proven Layouts",
    description: "Built from what already converts in your industry.",
  },
  {
    icon: Clock,
    title: "No Drama",
    description: "No endless meetings. No moodboards. No design-by-committee.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Perfect on every device. Because that's where your customers are.",
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
      {/* Hero Section */}
      <section className="min-h-[85vh] sm:min-h-[90vh] flex items-center pt-20 pb-8 sm:pt-24 sm:pb-12 md:pt-28 md:pb-16">
        <div className="content-width">
          <motion.div
            className="hero-card max-w-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <DottedGrid className="opacity-40" spacing={32} />
            <div className="hero-card-inner relative z-10">
              <div className="inline-block px-4 py-2 mb-4 sm:mb-6 rounded-full border border-primary/30 bg-primary/5">
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-primary">
                  Websites for Local UK Businesses
                </span>
              </div>

              <h1 className="text-display mb-6 sm:mb-8">
                Websites that{" "}
                <span className="text-primary">
                  <TypewriterText texts={typewriterWords} speed={120} />
                </span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                Not just impress.
              </h1>

              <p className="text-body-lg max-w-2xl mb-8 sm:mb-10">
                Fast, proven websites for local businesses using layouts that
                already work in your industry. No fluff. No endless revisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio */}
      <PortfolioShowcase />

      {/* Benefits */}
      <section className="section">
        <div className="content-width">
          <motion.div
            className="mb-10 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="badge-primary mb-4 inline-block">Why Us</span>
            <h2 className="text-headline max-w-xl">
              Built from what <span className="text-primary">already works</span>
            </h2>
          </motion.div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="feature-item hover-lift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="step-number mb-4 sm:mb-6">
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{benefit.title}</h3>
                <p className="text-body">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Is This For You */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="hero-card max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <DottedGrid className="opacity-20" spacing={28} />
            <div className="hero-card-inner relative z-10">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-headline">
                  This is <span className="text-primary">not</span> for everyone
                </h2>
              </div>

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {/* Not For You */}
                <div className="card-subtle">
                  <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-muted-foreground">
                    Not for you if you want...
                  </h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {notForYou.map((item) => (
                      <li key={item} className="flex items-center gap-2 sm:gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-destructive" />
                        </div>
                        <span className="text-sm sm:text-base text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* For You */}
                <div className="card-highlight">
                  <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">
                    Perfect if you want...
                  </h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {forYou.map((item) => (
                      <li key={item} className="flex items-center gap-2 sm:gap-3">
                        <div className="check-icon">
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                        <span className="text-sm sm:text-base text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
