import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";

const industries = [
  "Plumbers",
  "Electricians",
  "Mechanics",
  "Cleaners",
  "Tutors",
  "Tradespeople",
  "Mobile Services",
];

const notForYou = [
  "You want unlimited revisions",
  "You want to choose your own design",
  "You need a custom web app",
  "You're looking for the cheapest option",
];

const forYou = [
  "You want a website that converts",
  "You trust proven industry layouts",
  "You want fast delivery, not endless meetings",
  "You value results over opinions",
];

const process = [
  {
    number: "01",
    title: "Choose Your Package",
    description: "Pick the package that fits your needs. No hidden costs, no surprises.",
  },
  {
    number: "02",
    title: "We Build It",
    description: "Using proven layouts from your industry. Fast, focused, conversion-ready.",
  },
  {
    number: "03",
    title: "One Revision Round",
    description: "Text changes, image swaps, minor tweaks. That's it. No redesigns.",
  },
  {
    number: "04",
    title: "Go Live",
    description: "Your site launches. You start getting calls. Simple.",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="badge mb-8">
              Productised Website Service
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl mb-6">
              Websites that convert.
              <br />
              <span className="text-muted-foreground">Not websites that impress.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              We build fast, proven websites for local businesses using layouts that already work in your industry. No fluff. No endless revisions. Just results.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/start">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground mb-6">
            BUILT FOR LOCAL SERVICE BUSINESSES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {industries.map((industry) => (
              <span key={industry} className="text-sm font-medium text-foreground">
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What This Is / Isn't */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">This is not for everyone.</h2>
            <p className="section-subtitle">
              We're a productised service, not a custom agency. Know what you're getting into.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Not For You */}
            <div className="card-dark">
              <h3 className="text-xl font-bold mb-6 text-muted-foreground">This is NOT for you if...</h3>
              <ul className="space-y-4">
                {notForYou.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <X className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* For You */}
            <div className="card-highlight">
              <h3 className="text-xl font-bold mb-6">This IS for you if...</h3>
              <ul className="space-y-4">
                {forYou.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">
              Four steps. No discovery calls. No moodboards. No endless back-and-forth.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {process.map((step) => (
              <div key={step.number} className="relative">
                <div className="text-6xl font-bold text-border mb-4">{step.number}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Built from what already works.
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg">
                We don't design from scratch. We don't guess. We analyse the top-performing websites in your industry—what sections they use, how they're structured, what converts.
              </p>
              <p className="text-lg">
                Then we rebuild a clean, fast, compliant version for you. No creative ego. No endless options. Just proven layouts that get results.
              </p>
              <p className="text-lg font-medium text-foreground">
                You're not paying for creativity. You're paying for clarity, speed, and conversions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Simple packages. Clear pricing.</h2>
            <p className="section-subtitle">
              Pick a package. Get your site. No negotiation.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="card-dark flex flex-col">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-muted-foreground text-sm mb-6">1-page website</p>
              <p className="text-muted-foreground text-sm mb-4">Fixed industry template. Fast delivery. One revision round.</p>
              <div className="mt-auto">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/packages">View Details</Link>
                </Button>
              </div>
            </div>
            
            {/* Pro */}
            <div className="card-highlight flex flex-col">
              <div className="inline-block text-xs font-bold text-primary mb-2">MOST POPULAR</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground text-sm mb-6">Multi-page website</p>
              <p className="text-muted-foreground text-sm mb-4">Home, Services, About, Contact. Industry-optimised structure.</p>
              <div className="mt-auto">
                <Button className="w-full" asChild>
                  <Link to="/packages">View Details</Link>
                </Button>
              </div>
            </div>
            
            {/* Growth */}
            <div className="card-dark flex flex-col">
              <h3 className="text-xl font-bold mb-2">Growth</h3>
              <p className="text-muted-foreground text-sm mb-6">Everything + extras</p>
              <p className="text-muted-foreground text-sm mb-4">Lead capture, tracking readiness, ongoing updates option.</p>
              <div className="mt-auto">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/packages">View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to stop wasting time?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get a website that works. Built fast. Built right. Built for results.
            </p>
            <Button size="lg" asChild>
              <Link to="/start">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
