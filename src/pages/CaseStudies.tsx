import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, TrendingUp } from "lucide-react";

const caseStudies = [
  {
    business: "Mitchell's Plumbing",
    industry: "Plumbing",
    location: "Bristol",
    challenge: "Had no online presence and was losing jobs to competitors with websites.",
    solution: "Built a professional 5-page website with quote request forms, service area map, and emergency callout button.",
    results: [
      "312% increase in enquiries",
      "£15,000+ in new jobs within 3 months",
      "Page 1 Google ranking for 'plumber Bristol'",
    ],
    testimonial: "Within two weeks of launching, I got 8 new job enquiries. Best money I've spent on my business.",
    package: "Professional",
  },
  {
    business: "Sparkle Clean Services",
    industry: "Cleaning",
    location: "Manchester",
    challenge: "Old DIY website that looked unprofessional and wasn't mobile-friendly.",
    solution: "Complete redesign with modern aesthetics, easy booking system, and before/after photo gallery.",
    results: [
      "47% more website visitors",
      "Booking requests doubled",
      "Professional image boosted referrals",
    ],
    testimonial: "They made the whole process so easy. My new site looks incredible and my phone hasn't stopped ringing.",
    package: "Professional",
  },
  {
    business: "Dave's Auto Repairs",
    industry: "Automotive",
    location: "London",
    challenge: "Needed a way to showcase services and build trust with car owners.",
    solution: "Premium website with service catalog, customer reviews section, and online MOT booking integration.",
    results: [
      "200+ new customers in first year",
      "Average 4.9★ rating displayed prominently",
      "Reduced phone enquiries with FAQ section",
    ],
    testimonial: "Professional, fast, and they actually listened to what I needed. Highly recommend.",
    package: "Premium",
  },
  {
    business: "The Perfect Cut",
    industry: "Barber Shop",
    location: "Birmingham",
    challenge: "Wanted to attract younger clientele and offer online booking.",
    solution: "Trendy, modern design with Instagram feed integration and integrated booking calendar.",
    results: [
      "35% of bookings now come online",
      "Reached new demographic under 35",
      "Social following grew 400%",
    ],
    testimonial: "The website has completely changed how we get new customers. It pays for itself every month.",
    package: "Premium",
  },
];

export default function CaseStudies() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Real Results for <span className="gradient-text">Real Businesses</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              See how we've helped local businesses across the UK grow with professional websites.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section">
        <div className="container">
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <div
                key={study.business}
                className={`grid gap-8 rounded-2xl border border-border bg-card p-8 md:grid-cols-2 lg:p-12 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image placeholder */}
                <div className="flex items-center justify-center rounded-xl bg-muted p-8">
                  <div className="text-center">
                    <div className="mb-4 text-6xl font-bold text-primary/20">
                      {study.business.charAt(0)}
                    </div>
                    <div className="text-lg font-semibold">{study.business}</div>
                    <div className="text-sm text-muted-foreground">
                      {study.industry} • {study.location}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  <div className="mb-2 inline-flex items-center gap-2 text-sm text-primary">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5">{study.package} Package</span>
                  </div>
                  
                  <h2 className="mb-4 text-2xl font-bold">{study.business}</h2>
                  
                  <div className="mb-4">
                    <h3 className="mb-1 text-sm font-semibold text-muted-foreground">THE CHALLENGE</h3>
                    <p className="text-muted-foreground">{study.challenge}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="mb-1 text-sm font-semibold text-muted-foreground">OUR SOLUTION</h3>
                    <p className="text-muted-foreground">{study.solution}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">THE RESULTS</h3>
                    <ul className="space-y-2">
                      {study.results.map((result) => (
                        <li key={result} className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="font-medium">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                    "{study.testimonial}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Ready to Be Our Next Success Story?
            </h2>
            <p className="mb-6 opacity-90">
              Join hundreds of UK businesses who've transformed their online presence with OneSimpleSite.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                Get Your Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
