import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Package",
    description: "Pick Starter, Pro, or Growth based on your needs. Each package has a fixed structure and price. No custom quotes, no negotiation.",
    details: [
      "Starter: 1-page website with fixed template",
      "Pro: Multi-page site with industry-optimised layout",
      "Growth: Everything above plus lead capture and tracking",
    ],
  },
  {
    number: "02",
    title: "We Analyse Your Industry",
    description: "We study 3-5 top-performing websites in your specific trade. We extract what works—sections, layouts, calls-to-action—and use that as your foundation.",
    details: [
      "Competitor-based analysis (you don't need to provide inspiration)",
      "Proven sections and layouts extracted",
      "No guesswork, no creative experiments",
    ],
  },
  {
    number: "03",
    title: "We Build Your Site",
    description: "We build a clean, fast, mobile-first version using the proven structure. You provide your content (or we can help with that as an add-on).",
    details: [
      "Fast turnaround (typically 5-7 days)",
      "Mobile-first, SEO-ready structure",
      "You supply text, images, and logo",
    ],
  },
  {
    number: "04",
    title: "One Structured Revision",
    description: "You get ONE revision round. This is not a redesign. It's for refinements only.",
    details: [
      "✓ Text changes allowed",
      "✓ Image swaps allowed",
      "✓ Minor colour tweaks within brand",
      "✗ No new sections",
      "✗ No layout changes",
      "✗ No 'I changed my mind' requests",
    ],
  },
  {
    number: "05",
    title: "Launch",
    description: "Your site goes live. You start getting enquiries. That's it.",
    details: [
      "SSL secured and mobile-optimised",
      "Ready for Google to index",
      "Built to convert visitors to calls",
    ],
  },
];

const revisionRules = {
  allowed: [
    "Text changes",
    "Image swaps",
    "Minor colour tweaks within brand",
    "Fixing typos or errors",
  ],
  notAllowed: [
    "New sections or pages",
    "Layout restructuring",
    "Feature additions",
    "Design direction changes",
    "'Can you make it more like this website?'",
    "'I changed my mind about the style'",
  ],
};

export default function HowItWorks() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
              How It Works
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              A systemised process. Not a collaborative journey. We lead, you refine, we deliver.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-16">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="flex items-start gap-6">
                  <div className="text-5xl font-bold text-primary shrink-0">{step.number}</div>
                  <div>
                    <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">—</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revision Policy */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Revision Policy</h2>
            <p className="section-subtitle">
              One structured revision round. Refinements only, not rethinking.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Allowed */}
            <div className="card-dark">
              <h3 className="text-lg font-bold mb-4 text-primary">Revisions Include</h3>
              <ul className="space-y-3">
                {revisionRules.allowed.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Not Allowed */}
            <div className="card-dark">
              <h3 className="text-lg font-bold mb-4 text-destructive">Revisions Do NOT Include</h3>
              <ul className="space-y-3">
                {revisionRules.notAllowed.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <X className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <p className="text-center text-muted-foreground mt-8 max-w-2xl mx-auto">
            Need more than refinements? Additional features, pages, or functionality are available as paid upgrades.
          </p>
        </div>
      </section>

      {/* Why This Works */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Why we work this way
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg">
                Traditional agencies offer unlimited revisions because they charge for the chaos. More meetings, more options, more "what about this?" means more billable hours.
              </p>
              <p className="text-lg">
                We've stripped all that out. You're not paying us to explore. You're paying us to deliver a website that works, based on what already works in your industry.
              </p>
              <p className="text-lg font-medium text-foreground">
                Fast. Focused. Final.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Choose your package and let's build your website.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/start">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/packages">View Packages</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
