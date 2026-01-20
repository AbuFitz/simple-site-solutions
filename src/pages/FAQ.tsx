import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { useState } from "react";

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

function FAQItem({ question, answer, isOpen, onToggle, index }: { 
  question: string; 
  answer: string; 
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      className={`border-b border-border last:border-b-0 ${isOpen ? 'bg-primary/5' : ''} transition-colors rounded-lg`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-4 sm:py-5 px-2 text-left group"
      >
        <span className="text-sm sm:text-base font-semibold group-hover:text-primary transition-colors">
          {question}
        </span>
        <motion.div 
          className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            isOpen 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-border text-muted-foreground group-hover:border-primary group-hover:text-primary'
          }`}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? (
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className="text-sm sm:text-base text-muted-foreground pb-4 sm:pb-5 px-2 pr-12 sm:pr-16 leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Layout showFooterCTA={true}>
      {/* Page Frame */}
      <div className="page-frame">
        <DottedGrid className="opacity-15" spacing={40} />

        {/* Hero */}
        <section className="pt-20 pb-8 sm:pt-24 sm:pb-12 md:pt-28 md:pb-16 relative z-10">
          <div className="content-width">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block px-4 py-2 mb-4 sm:mb-6 rounded-full border border-primary/40 bg-primary/5">
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-primary">
                  FAQ
                </span>
              </div>
              <h1 className="text-display mb-4 sm:mb-6">
                Straight <span className="text-primary">answers.</span>
              </h1>
              <p className="text-body-lg max-w-xl mx-auto">
                No jargon. No runaround. Everything you need to know before
                getting started.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-12 sm:py-16 relative z-10">
          <div className="content-width">
            <motion.div
              className="bordered-section p-4 sm:p-6 md:p-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 sm:py-16 relative z-10">
          <div className="content-width">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <Link
                  to="/packages"
                  className="card-base hover-lift group flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors">View Pricing</h3>
                    <p className="text-sm text-muted-foreground">See all packages</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="card-base hover-lift group flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors">Our Process</h3>
                    <p className="text-sm text-muted-foreground">How it works</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom padding for mobile nav */}
        <div className="h-20 md:h-0" />
      </div>
    </Layout>
  );
}
