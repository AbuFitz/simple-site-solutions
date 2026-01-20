import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Zap,
  Scissors,
  Car,
  Sparkles,
  GraduationCap,
  ShoppingBag,
  Hammer,
  ArrowRight,
  Check,
} from "lucide-react";

const industries = [
  { icon: Wrench, name: "Plumbers" },
  { icon: Zap, name: "Electricians" },
  { icon: Car, name: "Mechanics" },
  { icon: Sparkles, name: "Cleaners" },
  { icon: Scissors, name: "Barbers & Salons" },
  { icon: GraduationCap, name: "Tutors" },
  { icon: ShoppingBag, name: "Small Shops" },
  { icon: Hammer, name: "Builders & Trades" },
];

const services = [
  {
    title: "Custom Website Design",
    description: "A bespoke website designed specifically for your business, brand, and customers. No templates, no cookie-cutter solutions.",
    features: [
      "Unique design tailored to your brand",
      "Up to 5 custom pages",
      "Professional copywriting assistance",
      "High-quality stock images included",
    ],
  },
  {
    title: "Mobile-First Development",
    description: "Your website will look and work perfectly on every device. Because most of your customers are searching on their phones.",
    features: [
      "Responsive design for all screen sizes",
      "Fast loading speeds",
      "Touch-friendly navigation",
      "Tested on all major devices",
    ],
  },
  {
    title: "SEO Foundation",
    description: "Built from the ground up to help you rank higher in Google searches. Get found by local customers looking for your services.",
    features: [
      "Local SEO optimization",
      "Google Business Profile setup",
      "Meta tags and structured data",
      "Site speed optimization",
    ],
  },
  {
    title: "Lead Capture & Forms",
    description: "Turn website visitors into paying customers with strategic contact forms and calls-to-action.",
    features: [
      "Custom quote request forms",
      "Contact forms with spam protection",
      "Click-to-call buttons",
      "WhatsApp integration available",
    ],
  },
  {
    title: "Hosting & Security",
    description: "Reliable, fast, and secure hosting included. Your site is always online and protected.",
    features: [
      "SSL certificate included",
      "99.9% uptime guarantee",
      "Daily backups",
      "DDoS protection",
    ],
  },
  {
    title: "Ongoing Support",
    description: "Need to make changes? Add new services? We're here to help with affordable maintenance plans.",
    features: [
      "Content updates on request",
      "Technical support via email",
      "Monthly performance reports",
      "Priority response times",
    ],
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Website Services for <span className="gradient-text">Local Businesses</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Everything you need to establish a professional online presence and start getting more customers.
            </p>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="border-b border-border py-12">
        <div className="container">
          <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
            TRUSTED BY BUSINESSES ACROSS ALL TRADES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {industries.map((industry) => (
              <div key={industry.name} className="flex items-center gap-2 text-muted-foreground">
                <industry.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="card-elevated flex flex-col">
                <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>
                <p className="mb-4 text-muted-foreground">{service.description}</p>
                <ul className="mt-auto space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="section bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="section-header">
              <h2 className="section-title">What's Included in Every Project</h2>
              <p className="section-description">
                No hidden costs. No surprises. Here's exactly what you get.
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Custom responsive design",
                "Up to 5 pages included",
                "Contact & quote forms",
                "Mobile optimization",
                "Basic SEO setup",
                "SSL security certificate",
                "Google Analytics setup",
                "1 year hosting included",
                "2 rounds of revisions",
                "Social media links",
                "Map integration",
                "Fast loading speed",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-background p-4">
                  <Check className="h-5 w-5 text-success" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Ready to Get Started?
            </h2>
            <p className="mb-6 opacity-90">
              Book a free 15-minute call to discuss your project. No obligation, no pressure.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                Get Your Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
