import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowRight, Check, X, AlertCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Package",
    description:
      "Starter, Pro, or Growth. Pick the one that fits your business. No hidden costs, no surprises.",
  },
  {
    number: "02",
    title: "Tell Us About Your Business",
    description:
      "A simple form. Your business details, goals, and content. That's all we need to get started.",
  },
  {
    number: "03",
    title: "We Research & Build",
    description:
      "We analyse top sites in your industry, extract what works, and build you a proven layout.",
  },
  {
    number: "04",
    title: "One Revision Round",
    description:
      "Text changes. Image swaps. Minor colour tweaks. One structured round. That's it.",
  },
  {
    number: "05",
    title: "Go Live",
    description:
      "Your site launches. Fast, mobile-first, and ready to convert visitors into customers.",
  },
];

const revisionIncludes = [
  "Text changes",
  "Image swaps",
  "Minor colour tweaks within brand",
];

const revisionExcludes = [
  "New sections",
  "Layout changes",
  "Feature additions",
  '"I changed my mind" requests',
];

export default function HowItWorks() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section">
        <div className="content-width">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge-primary mb-6 inline-block">The Process</span>
            <h1 className="text-display mb-8">
              Simple.{" "}
              <span className="text-accent">Structured.</span>
            </h1>
            <p className="text-body-lg max-w-2xl">
              We've removed everything that slows down typical web projects. No
              discovery calls. No moodboards. No endless back-and-forth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-sm bg-card">
        <div className="content-width">
          <div className="max-w-3xl">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative flex gap-8 pb-12 last:pb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[27px] top-14 bottom-0 w-px bg-border" />
                )}

                {/* Number */}
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-2">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-body">{step.description}</p>
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="badge-primary mb-4 inline-flex">
              <AlertCircle className="w-3 h-3 mr-2" />
              Important
            </span>
            <h2 className="text-headline max-w-2xl">
              Revision Policy:{" "}
              <span className="text-accent">One round only</span>
            </h2>
            <p className="text-body-lg max-w-2xl mt-4">
              We're a productised service. That means one structured revision
              round to keep things fast and focused.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
            {/* Includes */}
            <motion.div
              className="card-highlight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6">Revisions include</h3>
              <ul className="check-list">
                {revisionIncludes.map((item) => (
                  <li key={item} className="check-item">
                    <div className="check-icon">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Excludes */}
            <motion.div
              className="card-subtle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6 text-muted-foreground">
                Revisions do NOT include
              </h3>
              <ul className="check-list">
                {revisionExcludes.map((item) => (
                  <li key={item} className="check-item">
                    <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-destructive" />
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
            className="card-base text-center max-w-3xl mx-auto py-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-title mb-4">
              Ready to <span className="text-accent">skip the drama?</span>
            </h2>
            <p className="text-body-lg mb-8 max-w-lg mx-auto">
              Pick your package, submit your details, and get a website that
              converts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/start" className="btn-primary btn-lg">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/packages" className="btn-outline btn-lg">
                View Packages
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
