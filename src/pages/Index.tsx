import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { motion } from "framer-motion";
import { ArrowRight, Check, X, Zap, Target, Clock, Smartphone } from "lucide-react";

const industries = [
  "Plumbers",
  "Electricians",
  "Mechanics",
  "Cleaners",
  "Tutors",
  "Barbers",
  "Builders",
  "Decorators",
  "Landscapers",
  "Mobile Services",
];

const benefits = [
  {
    icon: Zap,
    title: "5-10 Days Delivery",
    description: "Your site goes live fast. No waiting months.",
  },
  {
    icon: Target,
    title: "Proven Layouts",
    description: "Built from what already converts in your industry.",
  },
  {
    icon: Clock,
    title: "No Drama",
    description: "No endless meetings. No moodboards. No stress.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Perfect on every device your customers use.",
  },
];

const notForYou = [
  "You want unlimited revisions",
  "You want to design it yourself",
  "You need a custom web app",
  "You're looking for the cheapest option",
];

const forYou = [
  "You want a website that converts",
  "You trust proven industry layouts",
  "You want fast delivery",
  "You value results over opinions",
];

const stats = [
  { value: "500+", label: "Sites Built" },
  { value: "98%", label: "Satisfaction" },
  { value: "7", label: "Day Average" },
  { value: "3x", label: "More Enquiries" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section">
        <div className="content-width">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="badge-primary mb-6 inline-block">
                Productised Website Service
              </span>
            </motion.div>

            <motion.h1
              className="text-display mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Websites that{" "}
              <span className="text-accent">convert.</span>
              <br />
              <span className="text-muted-foreground">Not just impress.</span>
            </motion.h1>

            <motion.p
              className="text-body-lg max-w-2xl mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Fast, proven websites for local businesses using layouts that
              already work in your industry. No fluff. No endless revisions.{" "}
              <span className="text-foreground font-medium">Just results.</span>
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/start" className="btn-primary btn-lg">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/packages" className="btn-outline btn-lg">
                View Packages
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries Ticker */}
      <section className="py-6 border-y border-border overflow-hidden">
        <div className="flex animate-marquee">
          {[...industries, ...industries, ...industries, ...industries].map((industry, index) => (
            <span
              key={index}
              className="text-base font-medium text-muted-foreground whitespace-nowrap px-6 flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {industry}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm">
        <div className="content-width">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <PortfolioShowcase />

      {/* Benefits */}
      <section className="section bg-card">
        <div className="content-width">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="badge-primary mb-4 inline-block">Why Us</span>
            <h2 className="text-headline max-w-3xl">
              Built from what <span className="text-accent">already works</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="card-subtle"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-body">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Is This For You */}
      <section className="section">
        <div className="content-width">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-headline">
              This is <span className="text-accent">not</span> for everyone
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Not For You */}
            <motion.div
              className="card-subtle"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6 text-muted-foreground">
                NOT for you if...
              </h3>
              <ul className="check-list">
                {notForYou.map((item) => (
                  <li key={item} className="check-item">
                    <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-destructive" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* For You */}
            <motion.div
              className="card-highlight"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold mb-6">Perfect for you if...</h3>
              <ul className="check-list">
                {forYou.map((item) => (
                  <li key={item} className="check-item">
                    <div className="check-icon">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm">
        <div className="content-width">
          <motion.div
            className="card-base text-center max-w-3xl mx-auto py-12 md:py-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-title mb-4">
              Ready for a website that{" "}
              <span className="text-accent">actually works?</span>
            </h2>
            <p className="text-body-lg mb-8 max-w-xl mx-auto">
              Choose your package, tell us about your business, and we'll build
              you a site that converts.
            </p>
            <Link to="/start" className="btn-primary btn-lg">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
