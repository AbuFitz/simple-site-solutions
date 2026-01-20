import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { CTASection } from "@/components/CTASection";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

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
                The Process
              </span>
            </div>
            <h1 className="text-display mb-6 sm:mb-8">
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
          <motion.div
            className="bordered-section-lg p-4 sm:p-8 md:p-12 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <DottedGrid className="opacity-20" spacing={28} />
            <div className="relative z-10 max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className="relative flex gap-4 sm:gap-6 md:gap-8 pb-8 sm:pb-12 last:pb-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-5 sm:left-6 top-12 sm:top-14 bottom-0 w-px bg-border" />
                  )}

                  {/* Number */}
                  <div className="shrink-0">
                    <div className="step-number">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-1 sm:pt-2">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{step.title}</h3>
                    <p className="text-body">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revision Policy */}
      <section className="section relative">
        <DottedGrid className="opacity-30" spacing={40} />
        <div className="content-width relative z-10">
          <motion.div
            className="mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="badge-primary mb-4 inline-block">Important</span>
            <h2 className="text-headline max-w-2xl">
              Revision Policy: <span className="text-primary">One round</span>
            </h2>
            <p className="text-body-lg max-w-2xl mt-3 sm:mt-4">
              We're a productised service. One structured revision round keeps things fast and focused.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 max-w-4xl">
            {/* Includes */}
            <motion.div
              className="card-base border-primary/30 hover-lift"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Revisions include</h3>
              <ul className="space-y-3 sm:space-y-4">
                {revisionIncludes.map((item) => (
                  <li key={item} className="flex items-center gap-2 sm:gap-3">
                    <div className="check-icon">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Excludes */}
            <motion.div
              className="feature-item hover-lift"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-muted-foreground">
                Revisions do NOT include
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {revisionExcludes.map((item) => (
                  <li key={item} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center shrink-0">
                      <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-destructive" />
                    </div>
                    <span className="text-sm sm:text-base text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to skip"
        highlightedText="the drama?"
        description="Pick your package, submit your details, and get a website that converts."
        primaryButtonText="Get Started"
        primaryButtonLink="/start"
        secondaryButtonText="View Pricing"
        secondaryButtonLink="/packages"
      />
    </Layout>
  );
}
