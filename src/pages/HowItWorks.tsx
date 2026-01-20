import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
      "Competitor-based analysis (you don't provide inspiration)",
      "Proven sections and layouts extracted",
      "No guesswork, no creative experiments",
    ],
  },
  {
    number: "03",
    title: "We Build Your Site",
    description: "We build a clean, fast, mobile-first version using the proven structure. You provide your content (or we can help as an add-on).",
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
      <section className="section pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-subtle" />
        <div className="floating-shape w-[400px] h-[400px] bg-primary/20 -top-20 -right-20" />
        
        <div className="container relative">
          <motion.div 
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-gradient mb-6 inline-block">The Process</span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
              How It <span className="gradient-text">Works</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A systemised process. Not a collaborative journey. We lead, you refine, we deliver.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-16">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                className="relative"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="shrink-0">
                    <div className="number-gradient">{step.number}</div>
                  </div>
                  <div className="card-glow flex-1">
                    <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
                    <p className="text-muted-foreground mb-6">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revision Policy */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-subtle" />
        
        <div className="container relative">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="badge-gradient mb-6 inline-block">Important</span>
            <h2 className="section-title">Revision <span className="gradient-text">Policy</span></h2>
            <p className="section-subtitle">
              One structured revision round. Refinements only, not rethinking.
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Allowed */}
            <motion.div 
              className="gradient-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="gradient-border-inner p-6 md:p-8">
                <h3 className="text-lg font-bold mb-6 gradient-text">Revisions Include</h3>
                <ul className="space-y-4">
                  {revisionRules.allowed.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            {/* Not Allowed */}
            <motion.div 
              className="card-glass"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6 text-destructive">Revisions Do NOT Include</h3>
              <ul className="space-y-4">
                {revisionRules.notAllowed.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="h-4 w-4 text-destructive" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why This Works */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto card-glow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Why we work <span className="gradient-text">this way</span>
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg">
              <p>
                Traditional agencies offer unlimited revisions because they charge for the chaos. More meetings, more options, more "what about this?" means more billable hours.
              </p>
              <p>
                We've stripped all that out. You're not paying us to explore. You're paying us to deliver a website that works, based on what already works in your industry.
              </p>
              <p className="text-foreground font-bold gradient-text text-2xl">
                Fast. Focused. Final.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10" />
        
        <div className="container relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">get started</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Choose your package and let's build your website.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gradient-bg border-0 text-white hover:opacity-90">
                <Link to="/start">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/packages">View Packages</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
