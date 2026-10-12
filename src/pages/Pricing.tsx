import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, HelpCircle } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "£495",
    description: "Perfect for new businesses or those just getting started online.",
    features: [
      "3-page website",
      "Mobile responsive design",
      "Contact form",
      "Basic SEO setup",
      "SSL certificate",
      "6 months hosting",
      "1 round of revisions",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "£795",
    description: "Our most popular option. Everything you need to grow.",
    features: [
      "5-page website",
      "Custom design",
      "Mobile-first approach",
      "Advanced SEO setup",
      "Google Analytics",
      "Contact & quote forms",
      "1 year hosting included",
      "2 rounds of revisions",
      "Social media integration",
      "Google Maps integration",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Premium",
    price: "£1,295",
    description: "For established businesses wanting the complete package.",
    features: [
      "Up to 10 pages",
      "Premium custom design",
      "Advanced animations",
      "Full SEO package",
      "Google Business setup",
      "Advanced contact forms",
      "1 year premium hosting",
      "3 rounds of revisions",
      "Blog/news section",
      "Priority support",
      "Monthly analytics report",
    ],
    cta: "Get Started",
    popular: false,
  },
];

const addons = [
  { name: "Additional pages", price: "£75/page" },
  { name: "Logo design", price: "£150" },
  { name: "Professional photography", price: "From £200" },
  { name: "Copywriting service", price: "£50/page" },
  { name: "Monthly maintenance", price: "£45/month" },
  { name: "E-commerce integration", price: "From £300" },
];

const faqs = [
  {
    question: "Are there any hidden costs?",
    answer: "No hidden costs. The price you see is the price you pay. Hosting is included for the first year, after which it's £10/month.",
  },
  {
    question: "What payment options do you offer?",
    answer: "We offer flexible payment options. Pay 50% upfront and 50% on completion, or split it into 3 monthly payments.",
  },
  {
    question: "How long does it take to build my website?",
    answer: "Most websites are completed within 5-10 working days after we receive your content. Premium packages may take up to 2 weeks.",
  },
  {
    question: "Can I update the website myself?",
    answer: "Yes! We provide simple instructions for basic updates. For larger changes, our maintenance plan covers unlimited text and image updates.",
  },
];

export default function Pricing() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Simple, <span className="gradient-text">Transparent Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              No hidden fees. No surprises. Just honest pricing for quality websites.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.popular
                    ? "border-primary bg-card shadow-lg"
                    : "border-border bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> one-time</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </div>
                
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  asChild
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                >
                  <Link to="/contact">
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section bg-muted/30">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Optional Add-ons</h2>
            <p className="section-description">
              Enhance your website with these optional extras.
            </p>
          </div>
          
          <div className="mx-auto max-w-2xl">
            <div className="grid gap-4 sm:grid-cols-2">
              {addons.map((addon) => (
                <div
                  key={addon.name}
                  className="flex items-center justify-between rounded-lg bg-background p-4"
                >
                  <span className="font-medium">{addon.name}</span>
                  <span className="text-primary font-semibold">{addon.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Pricing Questions</h2>
          </div>
          
          <div className="mx-auto max-w-2xl space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Not Sure Which Plan Is Right for You?
            </h2>
            <p className="mb-6 opacity-90">
              Book a free consultation and we'll help you choose the best option for your business.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                Book Free Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
