import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const packages = [
  {
    id: "starter",
    name: "Starter",
    price: "£499",
    description: "Up to 3 pages, 1 refinement round",
  },
  {
    id: "core",
    name: "Core",
    price: "£699",
    description: "Up to 5 pages, 1-2 refinement rounds",
    popular: true,
  },
  {
    id: "growth",
    name: "Growth",
    price: "£899",
    description: "Up to 6 pages, 2 refinement rounds",
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

  const progressValue = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <Layout>
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 relative min-h-screen">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width max-w-2xl relative z-10">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Progress - Only shows after package is selected */}
                <AnimatePresence>
                  {selectedPackage && (
                    <motion.div 
                      className="bordered-section p-4 sm:p-6 mb-8 sm:mb-12"
                      initial={{ opacity: 0, y: -10, height: 0, marginBottom: 0, padding: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto", marginBottom: "2rem", padding: "1rem" }}
                      exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0, padding: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between text-xs sm:text-sm mb-2 sm:mb-3 text-muted-foreground">
                        <span className={step >= 1 ? "text-primary font-medium" : ""}>Package</span>
                        <span className={step >= 2 ? "text-primary font-medium" : ""}>Industry</span>
                        <span className={step >= 3 ? "text-primary font-medium" : ""}>Details</span>
                      </div>
                      <Progress value={progressValue} className="h-1.5 sm:h-2" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 1: Package Selection */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h1 className="text-headline mb-3 sm:mb-4">
                      Choose your <span className="text-primary">package</span>
                    </h1>
                    <p className="text-body-lg mb-8 sm:mb-10">
                      Select the package that fits your business needs.
                    </p>

                    <div className="space-y-2 sm:space-y-3 mb-8 sm:mb-10">
                      {packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={`relative w-full p-4 sm:p-5 rounded-xl text-left transition-all flex items-center justify-between border-2 bg-card ${
                            selectedPackage === pkg.id
                              ? "border-primary"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-1">
                              <span className="text-base sm:text-lg font-bold">{pkg.name}</span>
                              {pkg.popular && (
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-medium border border-primary/30">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {pkg.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 sm:gap-4">
                            <span className="text-lg sm:text-xl font-bold text-primary">
                              {pkg.price}
                            </span>
                            <div
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selectedPackage === pkg.id
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {selectedPackage === pkg.id && (
                                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-foreground" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                      className="btn-primary btn-lg w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
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
                    <h1 className="text-headline mb-3 sm:mb-4">
                      What's your <span className="text-primary">industry?</span>
                    </h1>
                    <p className="text-body-lg mb-8 sm:mb-10">
                      This helps us apply the right proven layouts for your business.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-8 sm:mb-10">
                      {industries.map((industry) => (
                        <button
                          key={industry}
                          onClick={() => setSelectedIndustry(industry)}
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl text-center font-medium transition-all text-xs sm:text-sm border-2 ${
                            selectedIndustry === industry
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button
                        onClick={() => setStep(1)}
                        className="btn-outline btn-lg justify-center order-2 sm:order-1"
                      >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Back
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={!canProceedStep2}
                        className="btn-primary btn-lg justify-center order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
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
                    <h1 className="text-headline mb-3 sm:mb-4">
                      Tell us about <span className="text-primary">your business</span>
                    </h1>
                    <p className="text-body-lg mb-8 sm:mb-10">
                      Just the basics. We'll take it from here.
                    </p>

                    <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2">
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
                          className="input-base text-sm sm:text-base"
                        />
                      </div>
                      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-2">
                            Your Name *
                          </label>
                          <input
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="John Smith"
                            className="input-base text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-2">
                            Phone
                          </label>
                          <input
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="07XXX XXXXXX"
                            className="input-base text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="john@example.com"
                          className="input-base text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2">
                          Anything else?
                        </label>
                        <textarea
                          value={formData.details}
                          onChange={(e) =>
                            setFormData({ ...formData, details: e.target.value })
                          }
                          placeholder="Tell us about your services, target customers, or anything specific..."
                          rows={4}
                          className="input-base resize-none text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button
                        onClick={() => setStep(2)}
                        className="btn-outline btn-lg justify-center order-2 sm:order-1"
                      >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!canProceedStep3}
                        className="btn-primary btn-lg justify-center order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
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
                className="bordered-highlight text-center p-6 sm:p-8 md:p-12 relative"
              >
                <DottedGrid className="opacity-20" spacing={24} />
                <div className="relative z-10">
                  <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6 sm:mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Check className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </motion.div>
                  <h1 className="text-headline mb-3 sm:mb-4">
                    <span className="text-primary">You're in!</span>
                  </h1>
                  <p className="text-body-lg max-w-md mx-auto mb-6 sm:mb-8">
                    We've received your request. Check your email — we'll be in
                    touch within 24 hours to get started.
                  </p>
                  <div className="inline-block p-4 sm:p-6 rounded-xl bg-secondary border border-border text-left">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Selected Package
                    </div>
                    <div className="text-lg sm:text-xl font-bold capitalize">
                      {packages.find(p => p.id === selectedPackage)?.name || selectedPackage}
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-8">
                    <Link
                      to="/"
                      className="btn-outline btn-lg"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
