import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Target, Users, Award } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Simplicity First",
    description: "We believe great websites don't need to be complicated. Clean, clear, and effective.",
  },
  {
    icon: Target,
    title: "Results-Focused",
    description: "Every design decision we make is aimed at getting you more customers.",
  },
  {
    icon: Users,
    title: "Personal Service",
    description: "You're not a ticket number. You'll work directly with our team.",
  },
  {
    icon: Award,
    title: "Quality Always",
    description: "We take pride in every website we build. Your success is our reputation.",
  },
];

const team = [
  {
    name: "Alex Thompson",
    role: "Founder & Lead Developer",
    bio: "Former agency developer who saw too many local businesses being overcharged for simple websites. Started OneSimpleSite to change that.",
  },
  {
    name: "Emma Williams",
    role: "Design Lead",
    bio: "10 years of experience in web design. Passionate about creating beautiful, user-friendly experiences that convert visitors into customers.",
  },
  {
    name: "Marcus Chen",
    role: "SEO Specialist",
    bio: "Helps local businesses get found online. Has helped over 200 businesses improve their Google rankings.",
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              We're on a Mission to Help{" "}
              <span className="gradient-text">Local Businesses Thrive</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              OneSimpleSite was founded with one goal: make professional websites accessible to every local business in the UK.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold md:text-3xl">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We started OneSimpleSite after seeing the same problem over and over: talented tradespeople and local business owners being quoted thousands of pounds for basic websites, or worse, ending up with terrible DIY sites that hurt their credibility.
              </p>
              <p>
                A plumber shouldn't have to become a web developer. An electrician shouldn't need to understand SEO. And no local business should pay agency prices for a simple, effective website.
              </p>
              <p>
                That's why we created a straightforward service: professional websites at fair prices, delivered fast, with no technical jargon or hidden costs. Since launching in 2019, we've helped over 500 UK businesses establish their online presence and grow.
              </p>
              <p className="font-medium text-foreground">
                We believe every local business deserves a website they can be proud of.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-muted/30">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What We Stand For</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-description">
              A small, dedicated team focused on delivering exceptional results.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="card-elevated text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-muted" />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="mb-3 text-sm text-primary">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">500+</div>
              <div className="mt-1 text-sm text-muted-foreground">Websites Built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">5</div>
              <div className="mt-1 text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">98%</div>
              <div className="mt-1 text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">100+</div>
              <div className="mt-1 text-sm text-muted-foreground">5-Star Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Ready to Work With Us?
            </h2>
            <p className="mb-6 opacity-90">
              Let's chat about your business and how we can help you grow online.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
