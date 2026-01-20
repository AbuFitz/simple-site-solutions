import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Zap, 
  Shield, 
  Smartphone, 
  Search, 
  Clock, 
  MessageSquare,
  Star,
  ArrowRight,
  ChevronRight
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Fast Turnaround",
    description: "Your site live in as little as 5 days. No endless waiting.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "70% of your customers search on mobile. We design for that first.",
  },
  {
    icon: Search,
    title: "SEO-Ready",
    description: "Built to rank. Get found by local customers searching for your services.",
  },
  {
    icon: Shield,
    title: "Reliable Hosting",
    description: "Fast, secure hosting with 99.9% uptime. Your site is always online.",
  },
  {
    icon: MessageSquare,
    title: "Lead Capture Forms",
    description: "Convert visitors into enquiries with smart contact and quote forms.",
  },
  {
    icon: Clock,
    title: "Ongoing Support",
    description: "Need changes? We're here. Affordable maintenance plans available.",
  },
];

const process = [
  {
    step: "01",
    title: "Quick Discovery Call",
    description: "15 minutes to understand your business, goals, and what makes you different.",
  },
  {
    step: "02",
    title: "We Build Your Site",
    description: "Our team designs and develops your custom website with all the essentials.",
  },
  {
    step: "03",
    title: "Review & Refine",
    description: "You review, we revise. Up to 2 rounds of changes included.",
  },
  {
    step: "04",
    title: "Launch & Grow",
    description: "Your site goes live. Start getting more enquiries from day one.",
  },
];

const testimonials = [
  {
    name: "James Mitchell",
    business: "Mitchell's Plumbing, Bristol",
    quote: "Within two weeks of launching, I got 8 new job enquiries. Best money I've spent on my business.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    business: "Sparkle Clean Services, Manchester",
    quote: "They made the whole process so easy. My new site looks incredible and my phone hasn't stopped ringing.",
    rating: 5,
  },
  {
    name: "David Okonkwo",
    business: "Dave's Auto Repairs, London",
    quote: "Professional, fast, and they actually listened to what I needed. Highly recommend.",
    rating: 5,
  },
];

const stats = [
  { value: "500+", label: "Websites Launched" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "5 Days", label: "Average Turnaround" },
  { value: "24/7", label: "Site Uptime" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Websites for UK Local Businesses
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Get a Professional Website That{" "}
              <span className="gradient-text">Brings You Customers</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Simple. Fast. Built to Convert. We create beautiful, mobile-friendly websites 
              for plumbers, electricians, cleaners, and local service businesses across the UK.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/contact">
                  Get Your Free Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              <Check className="mr-1 inline h-4 w-4 text-success" />
              No upfront payment required • Free consultation
            </p>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need to Grow Online</h2>
            <p className="section-description">
              We handle all the technical stuff so you can focus on running your business.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card-elevated">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section bg-muted/30">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Four simple steps to your new website. We make it effortless.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="mb-4 text-5xl font-bold text-primary/20">{item.step}</div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {index < process.length - 1 && (
                  <ChevronRight className="absolute right-0 top-8 hidden h-8 w-8 text-border lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trusted by Local Businesses</h2>
            <p className="section-description">
              Don't just take our word for it. Here's what our clients say.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="card-elevated">
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="mb-4 text-foreground">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Get More Customers?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join 500+ UK businesses who trust us with their online presence. 
              Get your professional website in as little as 5 days.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/contact">
                  Get Your Free Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center md:p-12">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Shield className="h-8 w-8 text-success" />
            </div>
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">Our 100% Satisfaction Guarantee</h2>
            <p className="mb-6 text-muted-foreground">
              If you're not completely happy with your website, we'll keep working until you are. 
              No questions asked. We're not satisfied until you are.
            </p>
            <Button asChild>
              <Link to="/contact">Start Your Project</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
