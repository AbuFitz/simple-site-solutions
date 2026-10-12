import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { CTASection } from "@/components/CTASection";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How much does a website cost?",
    answer:
      "We have three packages: The Starter at £199 (everything you need to get online properly), The Sorted at £399 (our most popular — look established and win trust), and The Works at £649 (compete seriously and scale). All packages include local SEO foundations, mobile-first design, speed optimisation, and everything you need. No hidden fees, no upsell traps.",
  },
  {
    question: "How long does it take to build my website?",
    answer:
      "5-10 business days from when you submit your content. Starter sites are typically faster, while The Works packages with deeper positioning take a bit longer. We don't do endless timelines — you'll have your site live quickly.",
  },
  {
    question: "What's included in every package?",
    answer:
      "Local SEO foundations baked in, clean mobile-first design, speed and performance optimised, clear services and contact flow, Google Map integration, contact forms with click-to-call and WhatsApp, and cookie/privacy compliance. Every package gives you a complete, professional, fast-loading website.",
  },
  {
    question: "What's the difference between the packages?",
    answer:
      "The Starter (£199) gets you online properly — a clean, professional site with everything you need. The Sorted (£399) adds conversion-focused layouts, trust positioning, and messaging that actually sells. The Works (£649) goes deeper with positioning, SEO-led structure, analytics, and multiple rounds of refinements.",
  },
  {
    question: "Which package should I choose?",
    answer:
      "The Starter is perfect for new businesses and sole traders who need to get online fast. The Sorted is our most popular — ideal for established businesses wanting clarity, trust positioning, and room to refine. The Works is for businesses investing seriously in competing and scaling.",
  },
  {
    question: "Is SEO included?",
    answer:
      "Yes — local SEO foundations are included in every package. This means your site is built with proper structure, meta tags, and local optimisation from day one. No separate SEO add-on needed.",
  },
  {
    question: "How is this different from hiring a web designer?",
    answer:
      "We're a productised service, not a custom agency. We don't offer unlimited revisions, moodboards, or 'design by committee.' We analyse what works in your industry and build you a proven layout. It's faster, more affordable, and gets better results.",
  },
  {
    question: "Can I choose my own design?",
    answer:
      "No — and that's intentional. We build based on layouts that already convert in your industry. We've researched what works for plumbers, electricians, mechanics, cleaners, and other local trades. If you want full creative control, we're not the right fit. If you want results, we are.",
  },
  {
    question: "What if I need changes after we launch?",
    answer:
      "We're here to help. If you're on our Keep It Fresh hosting plan, monthly content updates are included. For bigger updates or changes outside of your plan, we'll quote you fairly. Our goal is happy customers, not nickel-and-diming you.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "Business name and details, your services, contact information, and any images or logos you want to use. We guide you through it with a simple form. Don't worry if you don't have everything — we'll help you figure it out.",
  },
  {
    question: "What about hosting?",
    answer:
      "We offer two hosting plans: Keep It Live (£9/month) includes domain, hosting, SSL, backups, and security updates. Keep It Fresh (£19/month) adds monthly content updates so your site stays current. You're also free to host it yourself — we'll hand over all the files.",
  },
  {
    question: "What are the payment terms?",
    answer:
      "The Starter: paid upfront in full. The Sorted and The Works: 50% upfront to begin, 50% before we launch your site. We accept bank transfer and card payments.",
  },
  {
    question: "What add-ons do you offer?",
    answer:
      "Logo Design (£49), Google Business Profile Setup (£39), Booking System Setup (£39), Extra Email Templates ×3 (£29), SEO Audit Report (£59), and Legal Pages Pack (£19). These are optional extras you can add to any package. Speed and performance optimisation is already included in every package — we build fast sites by default.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Due to the nature of custom work, deposits are non-refundable once work has begun. That said, we work with you to make sure you're happy with the result — we're not in the business of leaving customers disappointed.",
  },
  {
    question: "What industries do you work with?",
    answer:
      "We specialise in local UK businesses: plumbers, electricians, mechanics, cleaners, barbers and salons, tutors, small shops, builders, and other trades. Our layouts are researched and proven for these industries.",
  },
  {
    question: "Can I see examples of your work?",
    answer:
      "Yes! Check out our portfolio on the homepage. We've built sites for businesses like FixNow Mechanics, ARF Mods, and ReadySold. Each site follows our proven layout approach tailored to their industry.",
  },
];

export default function FAQ() {
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
                FAQ
              </span>
            </div>
            <h1 className="text-display mb-6 sm:mb-8">
              Straight <span className="text-primary">answers.</span>
            </h1>
            <p className="text-body-lg max-w-2xl">
              No jargon. No runaround. Everything you need to know before
              getting started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="bordered-section-lg p-4 sm:p-6 md:p-8 max-w-3xl relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <DottedGrid className="opacity-15" spacing={24} />
            <div className="relative z-10">
              <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-secondary rounded-lg sm:rounded-xl px-4 sm:px-6 border border-border"
                  >
                    <AccordionTrigger className="text-left text-sm sm:text-base font-semibold hover:no-underline py-4 sm:py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 sm:pb-5 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Still have"
        highlightedText="questions?"
        description="The best way to learn more is to start. Fill out the form, choose your package, and we'll take it from there."
        primaryButtonText="Get Started"
        primaryButtonLink="/start"
        secondaryButtonText="View Pricing"
        secondaryButtonLink="/packages"
      />
    </Layout>
  );
}
