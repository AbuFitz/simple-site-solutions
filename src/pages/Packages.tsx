import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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

const included = [
  "Mobile-first design",
  "Fast-loading pages",
  "SSL security",
  "GDPR-compliant forms",
  "Industry-proven layout",
  "1 structured revision round",
  "Hosting setup guidance",
  "Launch support",
];

export default function Packages() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-subtle" />
        <div className="floating-shape w-[500px] h-[500px] bg-pink-500/20 -top-40 -left-40" />
        
        <div className="container relative">
          <motion.div 
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-gradient mb-6 inline-block">Pricing</span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
              <span className="gradient-text">Packages</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Three packages. Clear deliverables. No custom quotes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="section">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={pkg.popular ? "gradient-border lg:-mt-8 lg:mb-8" : ""}
              >
                <div className={`${pkg.popular ? "gradient-border-inner p-6 md:p-8 h-full" : "card-glow h-full"} flex flex-col`}>
                  {pkg.popular && (
                    <div className="text-xs font-bold text-primary mb-4">MOST POPULAR</div>
                  )}
                  <h3 className="text-3xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-muted-foreground mb-8">{pkg.description}</p>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full ${pkg.popular ? 'gradient-bg' : 'bg-primary/20'} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Check className={`h-3 w-3 ${pkg.popular ? 'text-white' : 'text-primary'}`} />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${pkg.popular ? 'gradient-bg border-0 text-white hover:opacity-90' : ''}`}
                    variant={pkg.popular ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link to="/start">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
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
            <h2 className="section-title">
              What's <span className="gradient-text">included</span> in every package
            </h2>
          </motion.div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {included.map((item, index) => (
              <motion.div 
                key={item}
                className="card-glass flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Paid Upgrades */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="badge-gradient mb-6 inline-block">Add-ons</span>
            <h2 className="section-title">Paid <span className="gradient-text">Upgrades</span></h2>
            <p className="section-subtitle">
              Need more? These are available as add-ons to any package.
            </p>
          </motion.div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {upgrades.map((upgrade, index) => (
              <motion.div 
                key={upgrade.name}
                className="card-glow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <h3 className="font-bold mb-1">{upgrade.name}</h3>
                <p className="text-sm text-muted-foreground">{upgrade.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-subtle" />
        
        <div className="container relative">
          <motion.div 
            className="max-w-3xl mx-auto card-glass"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">Important to <span className="gradient-text">know</span></h2>
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
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Know what you <span className="gradient-text">want</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Pick your package and let's get your website live.
            </p>
            <Button size="lg" asChild className="gradient-bg border-0 text-white hover:opacity-90">
              <Link to="/start">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
