import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, X, Zap, Target, Clock, Smartphone } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "5-10 Days",
    description: "Your site goes live fast. No waiting months for a simple website.",
  },
  {
    icon: Target,
    title: "Proven Layouts",
    description: "Built from what already converts in your industry. Data-driven design.",
  },
  {
    icon: Clock,
    title: "No Drama",
    description: "No endless meetings. No moodboards. No design-by-committee stress.",
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
      <section className="min-h-screen flex items-center pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="content-width">
          <div className="max-w-4xl">
            <motion.span
              className="badge-primary mb-8 inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Websites for Local UK Businesses
            </motion.span>

            <motion.h1
              className="text-display mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Websites that{" "}
              <span className="text-primary">convert.</span>
              <br />
              Not just impress.
            </motion.h1>

            <motion.p
              className="text-body-lg max-w-2xl mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Fast, proven websites for local businesses using layouts that
              already work in your industry. No fluff. No endless revisions.
              Just results.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/start"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:brightness-110 transition-all"
              >
                Get Started
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-foreground rounded-full text-base font-semibold hover:bg-muted transition-all"
              >
                View Pricing
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <PortfolioShowcase />

      {/* Benefits */}
      <section className="section">
        <div className="content-width">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="badge-primary mb-4 inline-block">Why Us</span>
            <h2 className="text-headline max-w-2xl">
              Built from what <span className="text-primary">already works</span>
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="feature-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Is This For You */}
      <section className="section">
        <div className="content-width">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-headline">
              This is <span className="text-primary">not</span> for everyone
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Not For You */}
            <motion.div
              className="feature-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6 text-muted-foreground">
                Not for you if you want...
              </h3>
              <ul className="space-y-4">
                {notForYou.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                      <X className="w-3.5 h-3.5 text-destructive" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* For You */}
            <motion.div
              className="feature-item border-2 border-primary"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6">
                Perfect if you want...
              </h3>
              <ul className="space-y-4">
                {forYou.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="grey-box text-center px-8 py-16 md:py-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-title mb-4">
              Ready for a website that{" "}
              <span className="text-primary">works?</span>
            </h2>
            <p className="text-body-lg mb-8 max-w-lg mx-auto">
              Choose your package, tell us about your business, and get a site that converts.
            </p>
            <Link
              to="/start"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:brightness-110 transition-all"
            >
              Get Started Now
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
