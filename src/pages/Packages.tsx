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
      {/* Page Frame */}
      <div className="page-frame">
        <DottedGrid className="opacity-15" spacing={40} />

        {/* Hero */}
        <section className="pt-20 pb-8 sm:pt-24 sm:pb-12 md:pt-28 md:pb-16 relative z-10">
          <div className="content-width">
            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block px-4 py-2 mb-4 sm:mb-6 rounded-full border border-primary/40 bg-primary/5">
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
            </motion.div>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="py-12 sm:py-16 relative z-10">
          <div className="content-width">
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.name}
                  className={`relative flex flex-col hover-lift ${
                    pkg.popular
                      ? "card-highlight"
                      : "card-base"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
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

                  <div className="mb-5 sm:mb-6 pt-2">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">{pkg.name}</h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl sm:text-4xl font-bold text-primary">
                        {pkg.price}
                      </span>
                      <span className="text-muted-foreground text-xs sm:text-sm">one-time</span>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">{pkg.description}</p>
                  </div>

                  <ul className="space-y-2.5 sm:space-y-3 flex-1 mb-5 sm:mb-6">
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
                    className={`w-full flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold transition-all group ${
                      pkg.popular
                        ? "bg-primary text-primary-foreground hover:brightness-110"
                        : "bg-secondary text-foreground border border-border hover:border-primary/50"
                    }`}
                  >
                    Get Started
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Add-ons */}
        <section className="section relative z-10">
          <div className="content-width">
            <motion.div
              className="bordered-section p-5 sm:p-8 md:p-10 max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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
                {addons.map((addon, index) => (
                  <motion.div
                    key={addon.name}
                    className="flex items-center justify-between p-4 sm:p-5 rounded-xl bg-secondary border border-border hover:border-primary/50 transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-sm sm:text-base font-medium">{addon.name}</span>
                    <span className="text-primary font-bold text-sm sm:text-base">{addon.price}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom padding for mobile nav */}
        <div className="h-20 md:h-0" />
      </div>
    </Layout>
  );
}
