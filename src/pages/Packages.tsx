import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const packages = [
  {
    name: "Starter",
    description: "Perfect for businesses that just need a simple online presence.",
    features: [
      "1-page website",
      "Fixed industry template",
      "Mobile responsive",
      "Contact form",
      "1 revision round",
      "5-day delivery",
    ],
    popular: false,
  },
  {
    name: "Pro",
    description: "Our most popular option. Everything you need to convert visitors.",
    features: [
      "Multi-page site (Home, Services, About, Contact)",
      "Industry-optimised structure",
      "Mobile responsive",
      "Contact & quote forms",
      "Basic SEO setup",
      "Google Analytics ready",
      "1 revision round",
      "7-day delivery",
    ],
    popular: true,
  },
  {
    name: "Growth",
    description: "For businesses ready to capture leads and track results.",
    features: [
      "Everything in Pro",
      "Lead capture forms",
      "Tracking & analytics setup",
      "CRM integration ready",
      "Priority support",
      "Optional ongoing updates",
      "1 revision round",
      "10-day delivery",
    ],
    popular: false,
  },
];

const upgrades = [
  { name: "Additional pages", description: "Extra pages beyond your package" },
  { name: "Booking system", description: "Online appointment scheduling" },
  { name: "Blog setup", description: "News/blog section with CMS" },
  { name: "SEO content package", description: "Optimised copy for your pages" },
  { name: "Custom integrations", description: "Third-party tool connections" },
  { name: "Ongoing maintenance", description: "Monthly updates and support" },
];

export default function Packages() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
              Packages
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Three packages. Clear deliverables. No custom quotes.
            </p>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={pkg.popular ? "card-highlight flex flex-col" : "card-dark flex flex-col"}
              >
                {pkg.popular && (
                  <div className="text-xs font-bold text-primary mb-2">MOST POPULAR</div>
                )}
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{pkg.description}</p>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={pkg.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to="/start">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              What's included in every package
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Mobile-first design",
                "Fast-loading pages",
                "SSL security",
                "GDPR-compliant forms",
                "Industry-proven layout",
                "1 structured revision round",
                "Hosting setup guidance",
                "Launch support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-4 card-dark">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Paid Upgrades */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Paid Upgrades</h2>
            <p className="section-subtitle">
              Need more? These are available as add-ons to any package.
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {upgrades.map((upgrade) => (
              <div key={upgrade.name} className="card-dark">
                <h3 className="font-bold mb-1">{upgrade.name}</h3>
                <p className="text-sm text-muted-foreground">{upgrade.description}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-muted-foreground mt-8">
            Upgrade pricing provided during onboarding.
          </p>
        </div>
      </section>

      {/* Important Notes */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Important to know</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">One revision round only.</strong> Revisions cover text changes, image swaps, and minor colour tweaks. Not layout changes or new features.
              </p>
              <p>
                <strong className="text-foreground">No custom design requests.</strong> We build from proven industry layouts, not from inspiration or moodboards you provide.
              </p>
              <p>
                <strong className="text-foreground">Content is your responsibility.</strong> You provide text, images, and your logo. Content assistance is available as a paid add-on.
              </p>
              <p>
                <strong className="text-foreground">Pricing is fixed.</strong> No haggling, no special deals. The structure is the structure.
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
              Know what you want?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Pick your package and let's get your website live.
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
