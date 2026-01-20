import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { Button } from "@/components/ui/button";
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
  "Mobile Services",
];

const benefits = [
  {
    icon: Zap,
    title: "Built Fast",
    description: "Your site live in 5-10 days. Not months.",
  },
  {
    icon: Target,
    title: "Built to Convert",
    description: "Layouts proven to turn visitors into calls.",
  },
  {
    icon: Clock,
    title: "No Wasted Time",
    description: "No endless meetings. No moodboards. No drama.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Perfect on every device. Because that's where your customers are.",
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
  "You want fast delivery, not endless meetings",
  "You value results over opinions",
];

const process = [
  {
    number: "01",
    title: "Choose Your Package",
    description: "Starter, Pro, or Growth. Pick what fits.",
  },
  {
    number: "02",
    title: "We Analyse & Build",
    description: "Industry research. Proven layouts. Fast execution.",
  },
  {
    number: "03",
    title: "One Revision Round",
    description: "Text changes. Image swaps. That's it.",
  },
  {
    number: "04",
    title: "Go Live",
    description: "Your site launches. Calls start coming in.",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-shape w-[600px] h-[600px] bg-primary/30 -top-40 -left-40 animate-float" />
          <div className="floating-shape w-[500px] h-[500px] bg-pink-500/20 top-1/2 -right-40 animate-float animation-delay-200" />
          <div className="floating-shape w-[400px] h-[400px] bg-cyan-500/20 -bottom-20 left-1/3 animate-float animation-delay-400" />
        </div>

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="badge-gradient mb-8 inline-block">
                <Zap className="w-4 h-4" />
                Productised Website Service
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Websites that{" "}
              <span className="gradient-text">convert.</span>
              <br />
              <span className="text-muted-foreground">Not websites that impress.</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Fast, proven websites for local businesses using layouts that already work in your industry. 
              No fluff. No endless revisions. <span className="text-foreground font-medium">Just results.</span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Button size="lg" asChild className="gradient-bg border-0 text-white text-lg px-8 py-6 hover:opacity-90">
                <Link to="/start">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-border hover:bg-muted">
                <a href="#work">See Our Work</a>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-3 bg-muted-foreground/50 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Industries Ticker */}
      <section className="py-8 border-y border-border bg-muted/30 overflow-hidden">
        <div className="flex animate-scroll">
          {[...industries, ...industries, ...industries].map((industry, index) => (
            <span 
              key={index} 
              className="text-sm font-medium text-muted-foreground whitespace-nowrap px-8 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {industry}
            </span>
          ))}
        </div>
      </section>

      {/* Portfolio Showcase */}
      <PortfolioShowcase />

      {/* Benefits */}
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
            <span className="badge-gradient mb-6 inline-block">Why OneSimpleSite</span>
            <h2 className="section-title">
              Built from what <span className="gradient-text">already works</span>
            </h2>
            <p className="section-subtitle">
              We don't guess. We analyse top-performing sites in your industry and build you a proven layout.
            </p>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={benefit.title}
                className="card-glow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-6">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Is This For You */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">This is <span className="gradient-text">not</span> for everyone.</h2>
            <p className="section-subtitle">
              We're a productised service, not a custom agency. Know what you're getting into.
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Not For You */}
            <motion.div 
              className="card-glass"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-6 text-muted-foreground">This is NOT for you if...</h3>
              <ul className="space-y-4">
                {notForYou.map((item) => (
                  <li key={item} className="flex items-start gap-3">
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
              className="gradient-border"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="gradient-border-inner p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6">This IS for you if...</h3>
                <ul className="space-y-4">
                  {forYou.map((item) => (
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
          </div>
        </div>
      </section>

      {/* Process */}
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
            <span className="badge-gradient mb-6 inline-block">The Process</span>
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">
              Four steps. No discovery calls. No moodboards. No endless back-and-forth.
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {process.map((step, index) => (
              <motion.div 
                key={step.number}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="number-gradient mb-4">{step.number}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              Simple packages. <span className="gradient-text">Clear pricing.</span>
            </h2>
            <p className="section-subtitle">
              Pick a package. Get your site. No negotiation.
            </p>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Starter */}
            <motion.div 
              className="card-glow flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-muted-foreground mb-6">1-page website</p>
              <p className="text-muted-foreground text-sm flex-1">Fixed industry template. Fast delivery. One revision round.</p>
              <Button variant="outline" className="w-full mt-6" asChild>
                <Link to="/packages">View Details</Link>
              </Button>
            </motion.div>
            
            {/* Pro */}
            <motion.div 
              className="gradient-border flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="gradient-border-inner p-6 md:p-8 flex flex-col h-full">
                <div className="text-xs font-bold text-primary mb-2">MOST POPULAR</div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-muted-foreground mb-6">Multi-page website</p>
                <p className="text-muted-foreground text-sm flex-1">Home, Services, About, Contact. Industry-optimised structure.</p>
                <Button className="w-full mt-6 gradient-bg border-0 text-white hover:opacity-90" asChild>
                  <Link to="/packages">View Details</Link>
                </Button>
              </div>
            </motion.div>
            
            {/* Growth */}
            <motion.div 
              className="card-glow flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-2">Growth</h3>
              <p className="text-muted-foreground mb-6">Everything + extras</p>
              <p className="text-muted-foreground text-sm flex-1">Lead capture, tracking readiness, ongoing updates option.</p>
              <Button variant="outline" className="w-full mt-6" asChild>
                <Link to="/packages">View Details</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
