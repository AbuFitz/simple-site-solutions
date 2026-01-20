import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

const faqCategories = [
  {
    title: "The Process",
    faqs: [
      {
        question: "How is this different from a normal web design agency?",
        answer: "We don't offer custom design or unlimited revisions. We build from proven industry layouts that already convert. You're not paying for creativity—you're paying for speed, structure, and results.",
      },
      {
        question: "Can I choose my own design or provide inspiration?",
        answer: "No. We analyse your industry and build from what works. You don't pick designs, compare options, or provide moodboards. We lead the process.",
      },
      {
        question: "What if I don't like the design?",
        answer: "You get one structured revision round for text changes, image swaps, and minor tweaks. If you want a completely different design direction, this isn't the right service for you.",
      },
      {
        question: "How long does it take?",
        answer: "Starter: 5 days. Pro: 7 days. Growth: 10 days. These timelines assume you provide content promptly.",
      },
    ],
  },
  {
    title: "Revisions & Changes",
    faqs: [
      {
        question: "What counts as a revision?",
        answer: "Text changes, image swaps, and minor colour adjustments within your brand. That's it.",
      },
      {
        question: "What's NOT included in revisions?",
        answer: "New sections, layout changes, additional pages, feature additions, or 'I changed my mind' requests. These are paid upgrades.",
      },
      {
        question: "Why only one revision round?",
        answer: "Because endless revisions don't make better websites—they make bloated projects and scope creep. We build from proven layouts. One round of refinement is all you need.",
      },
      {
        question: "What if I need more changes after launch?",
        answer: "Additional changes are available as paid work. We offer ongoing maintenance packages if you need regular updates.",
      },
    ],
  },
  {
    title: "Content & Assets",
    faqs: [
      {
        question: "What do I need to provide?",
        answer: "Your logo (if you have one), text content for each page, photos of your work/team/premises, and any specific contact details or calls-to-action.",
      },
      {
        question: "What if I don't have content ready?",
        answer: "We can help with copywriting and source stock images as paid add-ons. But the project timeline only starts when we have your content.",
      },
      {
        question: "Can you take photos for me?",
        answer: "We don't offer photography, but we can recommend partners or source relevant stock images.",
      },
    ],
  },
  {
    title: "Technical & Hosting",
    faqs: [
      {
        question: "Do you provide hosting?",
        answer: "We set up your site and provide guidance on hosting. We recommend simple, reliable options. Ongoing hosting costs are separate from the build.",
      },
      {
        question: "Will my site work on mobile?",
        answer: "Yes. Every site we build is mobile-first. It's designed for phones first, then scales up to tablets and desktops.",
      },
      {
        question: "Is SEO included?",
        answer: "Basic on-page SEO is included (proper titles, meta descriptions, clean structure). Advanced SEO or content strategy is a paid upgrade.",
      },
      {
        question: "Can I edit the site myself after?",
        answer: "Depends on the setup. We'll provide guidance on making simple updates. Complex changes should go through us.",
      },
    ],
  },
  {
    title: "Pricing & Payment",
    faqs: [
      {
        question: "Why don't you show prices on the site?",
        answer: "Because pricing depends on your specific needs and any add-ons. Contact us to get a clear quote for your package.",
      },
      {
        question: "Can I negotiate on price?",
        answer: "No. Our packages are fixed. The structure is the structure. This keeps things fair and efficient for everyone.",
      },
      {
        question: "When do I pay?",
        answer: "Typically 50% upfront to start, 50% before launch. Payment terms are confirmed during onboarding.",
      },
      {
        question: "Do you offer payment plans?",
        answer: "Not currently. Our pricing is already streamlined to be accessible. We keep things simple.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
              FAQ
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Common questions about how we work. Read before you reach out.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {faqCategories.map((category) => (
              <div key={category.title} className="mb-12">
                <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.title}-${index}`}
                      className="border border-border rounded-lg px-6 bg-card"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Got it?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              If this sounds like what you need, let's get started.
            </p>
            <Button size="lg" asChild>
              <Link to="/start">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
