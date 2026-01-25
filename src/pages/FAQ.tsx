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
      "We have three packages: Starter at £349 (up to 3 pages), Core at £599 (up to 5 pages), and Growth at £899 (up to 6 pages). All packages include market research, proven layouts, mobile-friendly design, contact forms, and refinement rounds. No hidden fees.",
  },
  {
    question: "How long does it take to build my website?",
    answer:
      "5-10 business days from when you submit your content. Starter sites are typically faster (around 5 days), while Growth packages with more pages take closer to 10 days. We don't do endless timelines — you'll have your site live quickly.",
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
    question: "What if I don't like the design?",
    answer:
      "Each package includes refinement rounds (1 for Starter, 1-2 for Core, 2 for Growth). These cover text changes, image swaps, and minor layout tweaks. We don't do full redesigns — our layouts are proven to work. If you need an extra refinement round, it's £95.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "Business name and details, your services, contact information, and any images or logos you want to use. We guide you through it with a simple form. Don't worry if you don't have everything — we'll help you figure it out.",
  },
  {
    question: "Do you write the website content?",
    answer:
      "We provide a content guide and structure — you provide the raw details about your business. If you'd prefer professional copywriting, we offer SEO Content Writing at £95 per page, or Blog Post Writing at £75 per post.",
  },
  {
    question: "What about hosting and domains?",
    answer:
      "Hosting is optional at £15/month. This includes secure hosting, SSL certificate (https), regular backups, updates, and minor fixes if needed. You're also free to host it yourself — we'll hand over all the files. Domain registration is separate (we can help you set it up or point your existing domain).",
  },
  {
    question: "What are the payment terms?",
    answer:
      "Starter package: paid upfront in full. Core and Growth packages: 50% upfront to begin, 50% before we launch your site. We accept bank transfer and card payments.",
  },
  {
    question: "Can I make changes after the site goes live?",
    answer:
      "Yes. Small text or image updates are £30. Adding a new page is £85. Bigger changes are quoted separately. No monthly subscription required — just pay when you need something changed.",
  },
  {
    question: "What if I need a booking system or special features?",
    answer:
      "We offer add-ons: Booking System (£150), Blog Setup (£120), Local SEO Setup (£150), and Simple Logo Refresh (£120). These can be added to any package. We keep the core packages simple and add extras only when you need them.",
  },
  {
    question: "What's included in every package?",
    answer:
      "Market and competitor review, mobile-friendly modern design, contact form with click-to-call and WhatsApp, Google Map integration, trust sections (reviews, guarantees), basic SEO setup, cookie notice, and refinement rounds. Everything you need to look professional and convert visitors.",
  },
  {
    question: "Which package should I choose?",
    answer:
      "Starter (£349) is perfect for sole traders and new businesses who want it done properly. Core (£599) is our most popular — ideal for established businesses wanting more pages and clarity. Growth (£899) is for businesses ready to compete and look established with premium positioning.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Due to the nature of custom work, deposits are non-refundable once work has begun. However, we work with you through the refinement rounds to ensure you're happy with the result. We've never had an unhappy customer who followed the process.",
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
