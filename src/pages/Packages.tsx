import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";

const packages = [
  {
    name: "Starter",
    price: "£497",
    description: "Perfect for new businesses that need to get online fast.",
    features: [
      "1-page website",
      "Fixed industry template",
      "Mobile responsive",
      "Basic SEO setup",
      "Contact form",
      "1 revision round",
      "5-day delivery",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "£997",
    description: "For established businesses ready to convert more customers.",
    features: [
      "Multi-page site (up to 5)",
      "Home, Services, About, Contact",
      "Industry-optimised layout",
      "Advanced SEO foundation",
      "Lead capture forms",
      "Google Analytics setup",
      "1 revision round",
      "7-day delivery",
    ],
    popular: true,
  },
  {
    name: "Growth",
    price: "£1,497",
    description: "Everything you need to scale with tracking and support.",
    features: [
      "Everything in Pro",
      "Up to 8 pages",
      "Conversion tracking",
      "Google Business Profile",
      "Social media integration",
      "Monthly maintenance option",
      "Priority support",
      "10-day delivery",
    ],
    popular: false,
  },
];

const addons = [
  { name: "Logo Design", price: "£197" },
  { name: "Professional Copywriting", price: "£297" },
  { name: "Booking System", price: "£197" },
  { name: "Blog Setup", price: "£247" },
  { name: "Additional Pages", price: "£97/page" },
  { name: "Monthly Maintenance", price: "£47/mo" },
];

export default function Packages() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="content-width">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-primary mb-6 inline-block">Pricing</span>
            <h1 className="text-display mb-8">
              Simple pricing. <span className="text-primary">No surprises.</span>
            </h1>
            <p className="text-body-lg max-w-2xl">
              Pick a package. Get your site. Every package includes industry
              research, proven layouts, and one revision round.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section-sm">
        <div className="content-width">
          <div className="grid gap-6 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  pkg.popular
                    ? "bg-secondary border-2 border-primary"
                    : "bg-secondary"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute -top-3 left-8">
                    <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8 pt-2">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-primary">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground text-sm">one-time</span>
                  </div>
                  <p className="text-muted-foreground">{pkg.description}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/start"
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-base font-semibold transition-all ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground hover:brightness-110"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  Get Started
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section">
        <div className="content-width">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-headline">
              Optional <span className="text-primary">add-ons</span>
            </h2>
            <p className="text-body-lg mt-4">
              Need something extra? Add these to any package.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="flex items-center justify-between p-5 rounded-xl bg-secondary"
              >
                <span className="font-medium">{addon.name}</span>
                <span className="text-primary font-bold">{addon.price}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="grey-box text-center px-8 py-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-title mb-4">
              Not sure which <span className="text-primary">package?</span>
            </h2>
            <p className="text-body-lg mb-8 max-w-lg mx-auto">
              Start with Pro. It's our most popular and includes everything
              most local businesses need.
            </p>
            <Link
              to="/start"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:brightness-110 transition-all"
            >
              Start with Pro
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
