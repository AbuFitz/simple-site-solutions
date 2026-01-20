import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Send } from "lucide-react";

const packages = [
  {
    id: "starter",
    name: "Starter",
    price: "£497",
    description: "1-page website, 5-day delivery",
  },
  {
    id: "pro",
    name: "Pro",
    price: "£997",
    description: "Multi-page site, 7-day delivery",
    popular: true,
  },
  {
    id: "growth",
    name: "Growth",
    price: "£1,497",
    description: "Full package, 10-day delivery",
  },
];

const industries = [
  "Plumber",
  "Electrician",
  "Mechanic",
  "Cleaner",
  "Tutor",
  "Barber/Salon",
  "Builder",
  "Decorator",
  "Landscaper",
  "Other",
];

export default function Start() {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: "",
    name: "",
    email: "",
    phone: "",
    details: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const canProceedStep1 = selectedPackage !== null;
  const canProceedStep2 = selectedIndustry !== null;
  const canProceedStep3 =
    formData.businessName && formData.name && formData.email;

  return (
    <Layout>
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="content-width max-w-2xl">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Progress */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground font-medium">
                      Step {step} of 3
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((step / 3) * 100)}%
                    </span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(step / 3) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Step 1: Package Selection */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h1 className="text-headline mb-4">
                      Choose your <span className="text-primary">package</span>
                    </h1>
                    <p className="text-body-lg mb-10">
                      Select the package that fits your business needs.
                    </p>

                    <div className="space-y-3 mb-10">
                      {packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={`relative w-full p-5 rounded-xl text-left transition-all flex items-center justify-between ${
                            selectedPackage === pkg.id
                              ? "bg-secondary border-2 border-primary"
                              : "bg-secondary border-2 border-transparent hover:border-border"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-lg font-bold">{pkg.name}</span>
                              {pkg.popular && (
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {pkg.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-primary">
                              {pkg.price}
                            </span>
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selectedPackage === pkg.id
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {selectedPackage === pkg.id && (
                                <Check className="w-3.5 h-3.5 text-primary-foreground" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Industry */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h1 className="text-headline mb-4">
                      What's your <span className="text-primary">industry?</span>
                    </h1>
                    <p className="text-body-lg mb-10">
                      This helps us apply the right proven layouts for your business.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
                      {industries.map((industry) => (
                        <button
                          key={industry}
                          onClick={() => setSelectedIndustry(industry)}
                          className={`p-4 rounded-xl text-center font-medium transition-all text-sm ${
                            selectedIndustry === industry
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground hover:bg-muted"
                          }`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-2 px-6 py-4 bg-secondary text-foreground rounded-full text-base font-semibold hover:bg-muted transition-all"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={!canProceedStep2}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h1 className="text-headline mb-4">
                      Tell us about <span className="text-primary">your business</span>
                    </h1>
                    <p className="text-body-lg mb-10">
                      Just the basics. We'll take it from here.
                    </p>

                    <div className="space-y-5 mb-10">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Business Name *
                        </label>
                        <input
                          value={formData.businessName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              businessName: e.target.value,
                            })
                          }
                          placeholder="e.g. Smith's Plumbing"
                          className="input-base"
                        />
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Your Name *
                          </label>
                          <input
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="John Smith"
                            className="input-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Phone
                          </label>
                          <input
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="07XXX XXXXXX"
                            className="input-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="john@example.com"
                          className="input-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Anything else?
                        </label>
                        <textarea
                          value={formData.details}
                          onChange={(e) =>
                            setFormData({ ...formData, details: e.target.value })
                          }
                          placeholder="Tell us about your services, target customers, or anything specific..."
                          rows={4}
                          className="input-base resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 px-6 py-4 bg-secondary text-foreground rounded-full text-base font-semibold hover:bg-muted transition-all"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!canProceedStep3}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // Success State
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Check className="w-10 h-10 text-primary" />
                </motion.div>
                <h1 className="text-headline mb-4">
                  <span className="text-primary">You're in!</span>
                </h1>
                <p className="text-body-lg max-w-md mx-auto mb-8">
                  We've received your request. Check your email — we'll be in
                  touch within 24 hours to get started.
                </p>
                <div className="inline-block p-6 rounded-xl bg-secondary text-left">
                  <div className="text-sm text-muted-foreground mb-1">
                    Selected Package
                  </div>
                  <div className="text-xl font-bold capitalize">
                    {selectedPackage}
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-secondary text-foreground rounded-full text-base font-semibold hover:bg-muted transition-all"
                  >
                    Back to Home
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
