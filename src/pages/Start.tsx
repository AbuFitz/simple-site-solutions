import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const packages = [
  { id: "starter", name: "Starter", description: "1-page website" },
  { id: "pro", name: "Pro", description: "Multi-page website" },
  { id: "growth", name: "Growth", description: "Full lead capture setup" },
];

export default function Start() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("pro");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
              Get Started
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Choose your package, tell us about your business, and we'll take it from there.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="text-center py-16">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Request Received</h2>
                <p className="text-muted-foreground mb-8">
                  We'll review your details and get back to you within 24 hours with next steps.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Package Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold">Select Package *</Label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          selectedPackage === pkg.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:border-muted-foreground"
                        }`}
                      >
                        <div className="font-bold">{pkg.name}</div>
                        <div className="text-sm text-muted-foreground">{pkg.description}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Not sure? <Link to="/packages" className="text-primary hover:underline">Compare packages</Link>
                  </p>
                </div>

                {/* Business Details */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold">Your Business</Label>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input id="name" placeholder="John Smith" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business">Business Name *</Label>
                      <Input id="business" placeholder="Smith's Plumbing" required />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" placeholder="07123 456789" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">What type of business? *</Label>
                    <Input id="industry" placeholder="e.g., Plumber, Electrician, Cleaner, Mechanic" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Where are you based? *</Label>
                    <Input id="location" placeholder="e.g., Manchester, London, Bristol" required />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold">Additional Info</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Existing website (if any)</Label>
                    <Input id="website" placeholder="www.example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Anything else we should know?</Label>
                    <Textarea
                      id="notes"
                      placeholder="Timeline, specific services you offer, etc."
                      rows={4}
                    />
                  </div>
                </div>

                {/* Confirmation */}
                <div className="p-4 rounded-lg bg-muted border border-border">
                  <p className="text-sm text-muted-foreground">
                    By submitting, you understand that we build from proven industry layouts (not custom designs), and revisions are limited to text/image changes only.
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
