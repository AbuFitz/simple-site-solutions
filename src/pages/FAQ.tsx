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

function FAQItem({ question, answer, isOpen, onToggle }: { 
  question: string; 
  answer: string; 
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      className={`border-b border-border last:border-b-0 ${isOpen ? 'bg-muted/30' : ''} transition-colors`}
      initial={false}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 sm:py-6 text-left group"
      >
        <span className="text-sm sm:text-base md:text-lg font-semibold group-hover:text-primary transition-colors">
          {question}
        </span>
        <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all ${
          isOpen 
            ? 'bg-primary border-primary text-primary-foreground rotate-0' 
            : 'border-border text-muted-foreground group-hover:border-primary group-hover:text-primary'
        }`}>
          {isOpen ? (
            <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="text-sm sm:text-base text-muted-foreground pb-5 sm:pb-6 pr-12 sm:pr-16 leading-relaxed">
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
      {/* Hero Card Section */}
      <section className="pt-24 pb-8 sm:pt-28 sm:pb-12 md:pt-32 md:pb-16">
        <div className="content-width">
          <motion.div
            className="hero-card max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <DottedGrid className="opacity-30" spacing={28} />
            <div className="hero-card-inner relative z-10 text-center">
              <div className="inline-block px-4 py-2 mb-4 sm:mb-6 rounded-full border border-primary/30 bg-primary/5">
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="card-elevated max-w-3xl mx-auto"
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
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section-sm">
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
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                to="/how-it-works"
                className="card-base hover-lift group flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors">Our Process</h3>
                  <p className="text-sm text-muted-foreground">How it works</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
