import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Check } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - no actual submission
    setSubmitted(true);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Let's Build Your <span className="gradient-text">New Website</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Ready to get more customers? Fill out the form below and we'll be in touch within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-card p-8">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                      <Check className="h-8 w-8 text-success" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold">Thank You!</h2>
                    <p className="text-muted-foreground">
                      We've received your enquiry and will be in touch within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="07123 456789" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="service">What type of business do you have? *</Label>
                      <Input id="service" placeholder="e.g., Plumber, Electrician, Cleaner" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="budget">Approximate Budget</Label>
                      <select
                        id="budget"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select a budget range</option>
                        <option value="starter">£495 - Starter</option>
                        <option value="professional">£795 - Professional</option>
                        <option value="premium">£1,295 - Premium</option>
                        <option value="custom">Custom / Not Sure</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Tell us about your project *</Label>
                      <Textarea
                        id="message"
                        placeholder="What would you like to achieve with your new website? Any specific features you need?"
                        rows={5}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Do you have an existing website?</Label>
                      <Input id="website" placeholder="www.example.com (if applicable)" />
                    </div>
                    
                    <Button type="submit" size="lg" className="w-full">
                      Send Enquiry
                    </Button>
                    
                    <p className="text-center text-sm text-muted-foreground">
                      We'll respond within 24 hours. No spam, ever.
                    </p>
                  </form>
                )}
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Get in Touch</h2>
                  <p className="text-muted-foreground">
                    Prefer to reach out directly? Here's how you can contact us.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <a href="mailto:hello@onesimplesite.co.uk" className="text-muted-foreground hover:text-primary">
                        hello@onesimplesite.co.uk
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Phone</div>
                      <a href="tel:08001234567" className="text-muted-foreground hover:text-primary">
                        0800 123 4567
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Location</div>
                      <span className="text-muted-foreground">London, United Kingdom</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Response Time</div>
                      <span className="text-muted-foreground">Within 24 hours</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border border-border bg-muted/30 p-6">
                  <h3 className="mb-2 font-semibold">Free Consultation</h3>
                  <p className="text-sm text-muted-foreground">
                    Not sure what you need? Book a free 15-minute call and we'll help you figure out the best solution for your business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
