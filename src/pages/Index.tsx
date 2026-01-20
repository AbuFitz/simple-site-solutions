import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  X,
  Zap,
  Target,
  Clock,
  Smartphone,
  ChevronDown,
} from "lucide-react";

const industries = [
  "Plumbers",
  "Electricians",
  "Mechanics",
  "Cleaners",
  "Tutors",
  "Barbers",
  "Builders",
  "Mobile Services",
  "Decorators",
  "Landscapers",
];

const benefits = [
  {
    icon: Zap,
    title: "5-10 Days",
    description: "Not months. Your site goes live fast.",
  },
  {
    icon: Target,
    title: "Proven Layouts",
    description: "Built from what already converts.",
  },
  {
    icon: Clock,
    title: "No Drama",
    description: "No endless meetings or moodboards.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Where your customers actually are.",
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
  { value: "98%", label: "Client Satisfaction" },
  { value: "7", label: "Day Avg Delivery" },
  { value: "3x", label: "More Enquiries" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden py-20 lg:py-0">
        <div className="container">
          <div className="max-w-5xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge-glow mb-8 inline-flex">
                <span className="w-2 h-2 rounded-full bg-electric animate-pulse mr-2" />
                Productised Website Service
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="heading-xl mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Websites that
              <br />
              <span className="text-gradient">convert.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-body max-w-2xl mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Fast, proven websites for local businesses using layouts that
              already work in your industry.{" "}
              <span className="text-foreground font-medium">
                No fluff. No endless revisions. Just results.
              </span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link to="/start" className="btn-primary group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/packages" className="btn-outline">
                View Packages
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-muted-foreground"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs font-medium uppercase tracking-widest">
              Scroll
            </span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Industries Marquee */}
      <section className="py-8 border-y border-border overflow-hidden">
        <div className="marquee">
          <div className="marquee-content">
            {[...industries, ...industries].map((industry, index) => (
              <span
                key={index}
                className="text-lg font-medium text-muted-foreground whitespace-nowrap flex items-center gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-electric" />
                {industry}
              </span>
            ))}
          </div>
          <div className="marquee-content" aria-hidden>
            {[...industries, ...industries].map((industry, index) => (
              <span
                key={index}
                className="text-lg font-medium text-muted-foreground whitespace-nowrap flex items-center gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-electric" />
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-tight">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center lg:text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-electric mb-2">
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
      <section className="section">
        <div className="container">
          <motion.div
            className="mb-16 lg:mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="badge-glow mb-6 inline-block">Why Us</span>
            <h2 className="heading-lg max-w-3xl">
              Built from what{" "}
              <span className="text-gradient">already works</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="card-glass p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-14 h-14 rounded-2xl bg-electric/10 flex items-center justify-center mb-6">
                  <benefit.icon className="w-7 h-7 text-electric" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="divider-glow" />
      </div>

      {/* Is This For You */}
      <section className="section">
        <div className="container">
          <motion.div
            className="mb-16 lg:mb-24 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-lg">
              This is <span className="text-gradient">not</span> for everyone
            </h2>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Not For You */}
            <motion.div
              className="card-solid p-8 lg:p-10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-8 text-muted-foreground">
                NOT for you if...
              </h3>
              <ul className="space-y-5">
                {notForYou.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="h-4 w-4 text-destructive" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* For You */}
            <motion.div
              className="card-glass p-8 lg:p-10"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-8">Perfect for you if...</h3>
              <ul className="space-y-5">
                {forYou.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-electric/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-electric" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-tight">
        <div className="container">
          <motion.div
            className="card-glass p-12 lg:p-20 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-md mb-6">
              Ready to get a website that{" "}
              <span className="text-gradient">actually works?</span>
            </h2>
            <p className="text-body mb-10 max-w-xl mx-auto">
              Choose your package, tell us about your business, and we'll build
              you a site that converts.
            </p>
            <Link to="/start" className="btn-primary group">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
