import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
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
      {/* Hero Card */}
      <section className="pt-24 pb-8 sm:pt-28 sm:pb-12 md:pt-32 md:pb-16">
        <div className="content-width">
          <motion.div
            className="hero-card max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <DottedGrid className="opacity-30" spacing={28} />
            <div className="hero-card-inner relative z-10">
              <div className="inline-block px-4 py-2 mb-4 sm:mb-6 rounded-full border border-primary/30 bg-primary/5">
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-primary">
                  Pricing
                </span>
              </div>
              <h1 className="text-display mb-4 sm:mb-6">
                Simple pricing. <span className="text-primary">No surprises.</span>
              </h1>
              <p className="text-body-lg max-w-2xl">
                Pick a package. Get your site. Every package includes industry
                research, proven layouts, and one revision round.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section-sm">
        <div className="content-width">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                className={`relative flex flex-col hover-lift ${
                  pkg.popular
                    ? "card-highlight"
                    : "card-elevated"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute -top-3 left-4 sm:left-6">
                    <span className="inline-flex items-center px-3 sm:px-4 py-1 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6 sm:mb-8 pt-2">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-primary">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">one-time</span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">{pkg.description}</p>
                </div>

                <ul className="space-y-2.5 sm:space-y-3 flex-1 mb-6 sm:mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 sm:gap-3">
                      <div className="check-icon w-4 h-4 sm:w-5 sm:h-5">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/start"
                  className={`w-full flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold transition-all ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground hover:brightness-110"
                      : "bg-secondary text-foreground border border-border hover:bg-muted"
                  }`}
                >
                  Get Started
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
            className="card-elevated max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 sm:mb-8">
              <h2 className="text-headline">
                Optional <span className="text-primary">add-ons</span>
              </h2>
              <p className="text-body-lg mt-2 sm:mt-3">
                Need something extra? Add these to any package.
              </p>
            </div>

            <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {addons.map((addon) => (
                <div
                  key={addon.name}
                  className="flex items-center justify-between p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-secondary border border-border"
                >
                  <span className="text-sm sm:text-base font-medium">{addon.name}</span>
                  <span className="text-primary font-bold text-sm sm:text-base">{addon.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
