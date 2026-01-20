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
    title: "Getting Started",
    faqs: [
      {
        question: "How do I get started with OneSimpleSite?",
        answer: "Simply fill out our contact form or give us a call. We'll arrange a free 15-minute consultation to understand your business and requirements. After that, we'll send you a quote and can get started right away.",
      },
      {
        question: "What information do I need to provide?",
        answer: "We'll need your business details, logo (if you have one), any existing website, photos of your work/business, and content for your pages. Don't worry if you don't have everything ready – we can help with copywriting and source professional stock images.",
      },
      {
        question: "How long does it take to build my website?",
        answer: "Most websites are completed within 5-10 working days after we receive all your content. Our Premium package may take up to 2 weeks due to additional features and design complexity.",
      },
    ],
  },
  {
    title: "Pricing & Payment",
    faqs: [
      {
        question: "What's included in the price?",
        answer: "Each package includes design, development, hosting (for the period specified), SSL certificate, SEO basics, and the number of pages listed. Check our pricing page for detailed breakdowns of each package.",
      },
      {
        question: "Are there any hidden costs?",
        answer: "No hidden costs whatsoever. The price you see is the price you pay. After your included hosting period, hosting renewal is just £10/month.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept bank transfer, credit/debit cards, and PayPal. We offer flexible payment options: 50% upfront and 50% on completion, or split into 3 monthly payments.",
      },
      {
        question: "Do you offer refunds?",
        answer: "If you're not happy after the first design draft, we'll refund your deposit in full. After the design is approved and we proceed to development, refunds are not available, but we'll keep working until you're satisfied.",
      },
    ],
  },
  {
    title: "Design & Development",
    faqs: [
      {
        question: "Will my website work on mobile phones?",
        answer: "Absolutely! All our websites are mobile-first, meaning they're designed for mobile devices first and then scaled up for tablets and desktops. Your site will look great on any device.",
      },
      {
        question: "Can I see examples of your work?",
        answer: "Yes! Check out our Case Studies page to see examples of websites we've built for other local businesses. We're happy to share more examples relevant to your industry.",
      },
      {
        question: "Can I make changes to my website after it's built?",
        answer: "Yes! We provide basic training so you can make simple text and image updates yourself. For larger changes, our monthly maintenance plan covers unlimited content updates.",
      },
      {
        question: "Will my website appear on Google?",
        answer: "We set up basic SEO including proper page titles, meta descriptions, and Google Search Console registration. For more advanced SEO and local ranking, consider our Premium package or SEO add-on.",
      },
    ],
  },
  {
    title: "Technical & Support",
    faqs: [
      {
        question: "What happens after my website launches?",
        answer: "We'll provide you with all login details and basic training. Your site will continue to be hosted and secured. We're available for any questions, and you can opt for our monthly maintenance plan for ongoing support.",
      },
      {
        question: "Do you provide hosting?",
        answer: "Yes! Hosting is included in all packages for the specified period. Our hosting includes SSL security, daily backups, and 99.9% uptime guarantee. Renewal after the included period is £10/month.",
      },
      {
        question: "What if something breaks on my website?",
        answer: "During your included hosting period, we'll fix any technical issues at no extra cost. With our maintenance plan, you get priority support and quick fixes for any problems.",
      },
      {
        question: "Can I transfer my website to another host later?",
        answer: "Yes, you own your website. If you ever want to move to a different host, we'll provide all the files and assist with the transfer.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Everything you need to know about working with OneSimpleSite.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {faqCategories.map((category) => (
              <div key={category.title} className="mb-12">
                <h2 className="mb-6 text-2xl font-bold">{category.title}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.title}-${index}`}
                      className="rounded-lg border border-border bg-card px-6"
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

      {/* Still Have Questions */}
      <section className="section bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Still Have Questions?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Can't find the answer you're looking for? We're here to help.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild>
                <Link to="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:hello@onesimplesite.co.uk">
                  Email Us Directly
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
