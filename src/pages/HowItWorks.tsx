import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { CTASection } from "@/components/CTASection";
import { FaqTeaser } from "@/components/sections/HomeSections";
import { motion } from "framer-motion";
import { Check, Clock, Zap, Users, Target } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose your package",
    description: "Launch or Growth at a fixed price, or Enterprise with a tailored quotation. Add any optional extras and, if you want it, the monthly Hosting & Care plan.",
  },
  {
    number: "02",
    title: "Send us your details",
    description: "Fill in one short form with your business, services and contact details. Missing something, such as wording or photos? Tell us and we will help.",
  },
  {
    number: "03",
    title: "We design and build",
    description: "We turn your information into clear wording and build your pages around your business, using your branding and images.",
  },
  {
    number: "04",
    title: "You review it",
    description: "We share your website so you can check it. Ask for changes within your package: 1 revision round for Launch, 3 for Growth.",
  },
  {
    number: "05",
    title: "It goes live",
    description: "Once you are happy and any payment due before launch is made, your website goes live.",
  },
];

const benefits = [
  {
    icon: Target,
    title: "A fixed price",
    description: "The price, page count and what is included are written down before you start.",
  },
  {
    icon: Clock,
    title: "A clear timeline",
    description: "Estimated 5 to 7 working days for Launch and 10 to 14 for Growth, from when we have everything we need.",
  },
  {
    icon: Users,
    title: "Revisions included",
    description: "One round of changes with Launch and three with Growth, before launch.",
  },
  {
    icon: Zap,
    title: "It belongs to you",
    description: "After full payment the website is yours, with the source files handed over.",
  },
];

export default function HowItWorks() {
  return (
    <Layout>
      <Seo path="/how-it-works" />
      {/* Hero */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 relative">
        <DottedGrid className="opacity-40" spacing={36} />
        <div className="content-width relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-display mb-6 sm:mb-8">
              How it <span className="text-primary">works.</span>
            </h1>
            <p className="text-body-lg max-w-2xl">
              You choose a package, send your details, review the website and approve it.
              Here is what happens at each step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="bordered-section-lg p-4 sm:p-8 md:p-12 relative"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h2 className="text-headline max-w-2xl">
              What you <span className="text-primary">can count on</span>
            </h2>
            <p className="text-body-lg max-w-2xl mt-3 sm:mt-4">
              Clear terms from the start, so there are no surprises later.
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
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <DottedGrid className="opacity-15" spacing={24} />
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                What we need from you
              </h2>
              <p className="text-muted-foreground mb-6">
                The more you can send up front, the sooner we can start. If you are missing anything, we will help.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "Your business name and contact details",
                  "A list of your services",
                  "Any images or logos you want to use",
                  "Rough notes on what you want to say (we turn them into clear wording)",
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
      <FaqTeaser />
      <CTASection
        title="Ready to"
        highlightedText="get started?"
        description="Pick a package and send us your details. We will reply by email with the next steps."
        primaryButtonText="Start a project"
        primaryButtonLink="/start"
        secondaryButtonText="See packages"
        secondaryButtonLink="/packages"
      />
    </Layout>
  );
}
