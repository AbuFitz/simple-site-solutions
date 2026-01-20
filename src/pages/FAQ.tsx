import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How is this different from hiring a web designer?",
    answer:
      "We're a productised service, not a custom agency. We don't offer unlimited revisions, moodboards, or 'design by committee.' We analyse what works in your industry and build you a proven layout. It's faster, more affordable, and gets better results.",
  },
  {
    question: "Can I choose my own design?",
    answer:
      "No. That's by design. We build based on layouts that already convert in your industry. If you want full creative control, we're not the right fit. If you want results, we are.",
  },
  {
    question: "What if I don't like the design?",
    answer:
      "You get one structured revision round for text changes, image swaps, and minor colour tweaks. We don't do redesigns. Our layouts are proven to work — trust the process.",
  },
  {
    question: "How long does it take?",
    answer:
      "Starter: 5 days. Pro: 7 days. Growth: 10 days. This is from the moment you submit your content. No endless timelines.",
  },
  {
    question: "What do you need from me?",
    answer:
      "Business info, service details, contact information, and any images/logos you want to use. We guide you through it with a simple form.",
  },
  {
    question: "Do you write the content?",
    answer:
      "We provide a content guide and structure. You provide the raw content. Professional copywriting is available as an add-on for £297.",
  },
  {
    question: "What about hosting and domain?",
    answer:
      "Hosting for the first year is included. Domain registration is separate (we can help you set it up). After year one, hosting is £47/month.",
  },
  {
    question: "Can I make changes after the site goes live?",
    answer:
      "Yes. You can add our monthly maintenance plan (£47/mo) which includes small content updates. Larger changes are quoted separately.",
  },
  {
    question: "What if I need a booking system or special features?",
    answer:
      "These are available as add-ons. Booking system integration is £197. We keep the core packages simple and add extras as needed.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Due to the nature of custom work, we don't offer refunds once work has begun. However, we do offer a satisfaction guarantee — if we can't agree on a final design within the revision scope, we'll work with you to find a solution.",
  },
];

export default function FAQ() {
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
            <span className="badge-primary mb-6 inline-block">FAQ</span>
            <h1 className="text-display mb-8">
              Straight <span className="text-accent">answers.</span>
            </h1>
            <p className="text-body-lg max-w-2xl">
              No jargon. No runaround. Here's everything you need to know before
              getting started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="card-base border-border px-6"
                >
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
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
              Still have <span className="text-accent">questions?</span>
            </h2>
            <p className="text-body-lg mb-8 max-w-lg mx-auto">
              The best way to learn more is to start. Fill out the form, choose
              your package, and we'll take it from there.
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
