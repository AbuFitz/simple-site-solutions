import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
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
      "We have three packages: The Starter at £199 (everything you need to get online properly), The Sorted at £399 (look established and win trust), and The Works at £649 (compete seriously and scale). Each package lists exactly what is included on the packages page. Optional extras and the optional £19/month Keep It Running plan are priced separately and shown there.",
  },
  {
    question: "How long does it take to build my website?",
    answer:
      "Our estimate is 5–7 days for The Starter, 7–10 for The Sorted and 10–14 for The Works, counted from when we have your content and the go-ahead. Late content or slow feedback moves the date.",
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
      "The Starter is perfect for new businesses and sole traders who need to get online fast. The Sorted suits growing businesses that want clearer trust signals, booking and room to refine. The Works is for businesses investing seriously in competing and scaling.",
  },
  {
    question: "Is SEO included?",
    answer:
      "Yes — local SEO foundations are included in every package. This means your site is built with proper structure, meta tags, and local optimisation from day one. No separate SEO add-on needed.",
  },
  {
    question: "How is this different from hiring a web designer?",
    answer:
      "We're a productised service, not a custom agency. We don't offer unlimited revisions, moodboards, or 'design by committee.' We start from a layout planned for your kind of business and fill it with your details. It is faster and costs less than a fully custom design, with less room for bespoke changes.",
  },
  {
    question: "Can I choose my own design?",
    answer:
      "No — and that's intentional. We build from layouts planned for your kind of business, so you don't choose the design from scratch. If you want full creative control, we're probably not the right fit.",
  },
  {
    question: "What if I need changes after we launch?",
    answer:
      "We're here to help. The optional Keep It Running plan (£19/month) includes up to 5 content updates a month. Anything beyond that, or without the plan, we'll quote before doing the work.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "Business name and details, your services, contact information, and any images or logos you want to use. We guide you through it with a simple form. Don't worry if you don't have everything — we'll help you figure it out.",
  },
  {
    question: "What about hosting?",
    answer:
      "One optional plan: Keep It Running at £19/month covers hosting and domain, SSL, weekly backups, security monitoring and up to 5 content updates a month. Whether you can host the site yourself, and how files are handed over, is still to be confirmed in writing, so ask us before you order.",
  },
  {
    question: "What are the payment terms?",
    answer:
      "The Starter: paid upfront in full. The Sorted and The Works: 50% upfront to begin, 50% before we launch your site. How payment is taken is confirmed with you when your enquiry is accepted.",
  },
  {
    question: "What add-ons do you offer?",
    answer:
      "Logo Design (£49), Google Business Profile Setup (£39), Booking System Setup (£39), Extra Email Templates ×3 (£29), SEO Audit Report (£59), and Legal Pages Pack (£19). These are optional extras you can add to any package. Speed and performance optimisation is already included in every package — we build fast sites by default.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Due to the nature of custom work, deposits are non-refundable once work has begun. If you need to cancel, tell us as soon as you can and we'll explain where things stand.",
  },
  {
    question: "What industries do you work with?",
    answer:
      "We specialise in local UK businesses: plumbers, electricians, mechanics, cleaners, barbers and salons, tutors, small shops, builders, and other trades. Our layouts are researched and proven for these industries.",
  },
  {
    question: "Can I see examples of your work?",
    answer:
      "Yes! See the Our Work section on the homepage for real sites we have built or have in preview.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

export default function FAQ() {
  return (
    <Layout>
      <Seo path="/faq" jsonLd={faqJsonLd} />
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
