import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap } from "lucide-react";
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
      <section className="section pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-subtle" />
        <div className="floating-shape w-[500px] h-[500px] bg-primary/20 -top-40 left-1/2 -translate-x-1/2" />
        
        <div className="container relative">
          <motion.div 
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-gradient mb-6 inline-flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Let's Build
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
              Get <span className="gradient-text">Started</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose your package, tell us about your business, and we'll take it from there.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {submitted ? (
              <div className="text-center py-16 card-glow">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full gradient-bg">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Request <span className="gradient-text">Received</span></h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  We'll review your details and get back to you within 24 hours with next steps.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Package Selection */}
                <div className="space-y-4">
                  <Label className="text-xl font-bold">Select Package *</Label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`p-5 rounded-xl text-left transition-all ${
                          selectedPackage === pkg.id
                            ? "gradient-border"
                            : "card-glow hover:border-primary/30"
                        }`}
                      >
                        <div className={selectedPackage === pkg.id ? "gradient-border-inner p-4 -m-[2px] rounded-[10px]" : ""}>
                          <div className="font-bold text-lg">{pkg.name}</div>
                          <div className="text-sm text-muted-foreground">{pkg.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Not sure? <Link to="/packages" className="text-primary hover:underline">Compare packages</Link>
                  </p>
                </div>

                {/* Business Details */}
                <div className="space-y-6 card-glow">
                  <Label className="text-xl font-bold">Your Business</Label>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input id="name" placeholder="John Smith" required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business">Business Name *</Label>
                      <Input id="business" placeholder="Smith's Plumbing" required className="bg-background" />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" placeholder="07123 456789" className="bg-background" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">What type of business? *</Label>
                    <Input id="industry" placeholder="e.g., Plumber, Electrician, Cleaner, Mechanic" required className="bg-background" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Where are you based? *</Label>
                    <Input id="location" placeholder="e.g., Manchester, London, Bristol" required className="bg-background" />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-6 card-glow">
                  <Label className="text-xl font-bold">Additional Info</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Existing website (if any)</Label>
                    <Input id="website" placeholder="www.example.com" className="bg-background" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Anything else we should know?</Label>
                    <Textarea
                      id="notes"
                      placeholder="Timeline, specific services you offer, etc."
                      rows={4}
                      className="bg-background"
                    />
                  </div>
                </div>

                {/* Confirmation */}
                <div className="p-6 rounded-xl gradient-bg-subtle border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    By submitting, you understand that we build from <span className="text-foreground font-medium">proven industry layouts</span> (not custom designs), and revisions are limited to <span className="text-foreground font-medium">text/image changes only</span>.
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full gradient-bg border-0 text-white text-lg py-6 hover:opacity-90">
                  Submit Request
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
