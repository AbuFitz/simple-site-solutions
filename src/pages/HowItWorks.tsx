import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { CTASection } from "@/components/CTASection";
import { motion } from "framer-motion";
import { Check, Clock, Zap, Users, Target } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Package",
    description:
      "Essential, Business, or Growth. Pick what fits your business and budget. Clear pricing, no hidden costs.",
  },
  {
    number: "02",
    title: "Tell Us About Your Business",
    description:
      "Fill out a simple form with your details, services, and goals. Don't worry if you don't have everything — we'll guide you.",
  },
  {
    number: "03",
    title: "We Research & Build",
    description:
      "We look at what works in your industry and build you a site designed to convert. No guesswork, just proven layouts.",
  },
  {
    number: "04",
    title: "Review & Refine",
    description:
      "We'll share your site for feedback. Need changes? We'll work with you to get it right.",
  },
  {
    number: "05",
    title: "Go Live",
    description:
      "Your site launches. Fast, mobile-first, SEO-ready, and built to get you customers.",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "5-10 Days",
    description: "Not months. You'll have your site live quickly.",
  },
  {
    icon: Zap,
    title: "No Back-and-Forth",
    description: "We've streamlined the process. No endless meetings or emails.",
  },
  {
    icon: Target,
    title: "Built to Convert",
    description: "Every layout is designed to turn visitors into customers.",
  },
  {
    icon: Users,
    title: "We Handle It",
    description: "Just provide your content. We do the rest.",
  },
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
              Simple. <span className="text-primary">Straightforward.</span>
            </h1>
            <p className="text-body-lg max-w-2xl">
              No discovery calls. No moodboards. No endless revision cycles.
              Just a clear process that gets your site live fast.
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

      {/* Why This Works */}
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
            <h2 className="text-headline max-w-2xl">
              Why this <span className="text-primary">works</span>
            </h2>
            <p className="text-body-lg max-w-2xl mt-3 sm:mt-4">
              We've stripped out everything that makes traditional web projects drag on.
              Here's what you get instead.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="p-5 sm:p-6 rounded-xl bg-secondary border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Need From You */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="bordered-section p-5 sm:p-8 md:p-10 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <DottedGrid className="opacity-15" spacing={24} />
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                What we need from you
              </h2>
              <p className="text-muted-foreground mb-6">
                The more you can provide upfront, the faster we can build. But don't worry — we'll help if you're missing anything.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "Your business name and contact details",
                  "A list of your services",
                  "Any images or logos you want to use",
                  "A rough idea of what you want to say",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="check-icon w-5 h-5 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to skip the"
        highlightedText="drama?"
        description="Pick your package, send us your details, and get a website that actually works for your business."
        primaryButtonText="Get Started"
        primaryButtonLink="/start"
        secondaryButtonText="View Pricing"
        secondaryButtonLink="/packages"
      />
    </Layout>
  );
}
