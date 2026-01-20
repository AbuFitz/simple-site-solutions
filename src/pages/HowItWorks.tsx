import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Package",
    description:
      "Starter, Pro, or Growth. Pick what fits your business. No hidden costs.",
  },
  {
    number: "02",
    title: "Tell Us About Your Business",
    description:
      "A simple form. Your details, goals, and content. That's all we need.",
  },
  {
    number: "03",
    title: "We Research & Build",
    description:
      "We analyse top sites in your industry and build you a proven layout.",
  },
  {
    number: "04",
    title: "One Revision Round",
    description:
      "Text changes. Image swaps. Minor tweaks. One structured round.",
  },
  {
    number: "05",
    title: "Go Live",
    description:
      "Your site launches. Fast, mobile-first, and ready to convert.",
  },
];

const revisionIncludes = [
  "Text changes",
  "Image swaps",
  "Minor colour tweaks",
];

const revisionExcludes = [
  "New sections",
  "Layout changes",
  "Feature additions",
  '"I changed my mind"',
];

export default function HowItWorks() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="content-width">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-primary mb-6 inline-block">The Process</span>
            <h1 className="text-display mb-8">
              Simple. <span className="text-primary">Structured.</span>
            </h1>
            <p className="text-body-lg max-w-2xl">
              We've removed everything that slows down typical web projects.
              No discovery calls. No moodboards. No endless back-and-forth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-sm">
        <div className="content-width">
          <div className="max-w-3xl">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative flex gap-6 md:gap-8 pb-12 last:pb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-7 top-16 bottom-0 w-px bg-border" />
                )}

                {/* Number */}
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-2">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revision Policy */}
      <section className="section">
        <div className="content-width">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="badge-primary mb-4 inline-block">Important</span>
            <h2 className="text-headline max-w-2xl">
              Revision Policy: <span className="text-primary">One round</span>
            </h2>
            <p className="text-body-lg max-w-2xl mt-4">
              We're a productised service. One structured revision round keeps things fast and focused.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
            {/* Includes */}
            <motion.div
              className="feature-item border-2 border-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6">Revisions include</h3>
              <ul className="space-y-4">
                {revisionIncludes.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Excludes */}
            <motion.div
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6 text-muted-foreground">
                Revisions do NOT include
              </h3>
              <ul className="space-y-4">
                {revisionExcludes.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                      <X className="w-3.5 h-3.5 text-destructive" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="grey-box text-center px-8 py-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-title mb-4">
              Ready to <span className="text-primary">skip the drama?</span>
            </h2>
            <p className="text-body-lg mb-8 max-w-lg mx-auto">
              Pick your package, submit your details, and get a website that converts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/start"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:brightness-110 transition-all"
              >
                Get Started
                <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground rounded-full text-base font-semibold hover:bg-muted transition-all border border-border"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
