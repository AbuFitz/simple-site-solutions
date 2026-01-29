import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Send, Globe, X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { contactFormSchema, websiteUrlSchema, type ContactFormData } from "@/lib/validations";

function StepHeader({
  title,
  description,
  progress,
}: {
  title: React.ReactNode;
  description: string;
  progress: number;
}) {
  return (
    <div className="mb-5 sm:mb-7">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-3">
        {title}
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{description}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
            Progress
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1 sm:h-1.5" />
      </div>
    </div>
  );
}

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-[10px] sm:text-xs text-destructive mt-1.5"
    >
      {message}
    </motion.p>
  );
}

const packages = [
  {
    id: "essential",
    name: "Essential",
    price: "£199",
    description: "Get online properly, no frills",
  },
  {
    id: "business",
    name: "Business",
    price: "£399",
    description: "Clarity, trust positioning, 1-2 refinements",
    popular: true,
  },
  {
    id: "growth",
    name: "Growth",
    price: "£649",
    description: "Deep positioning, SEO-led, multiple refinements",
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

const availableAddons = [
  { id: "hosting", name: "Hosting + Domain", price: "£95/year", description: "We host and manage your site" },
  { id: "google-business", name: "Google Business Profile", price: "£99", description: "Setup and optimisation for local search" },
  { id: "performance", name: "Speed & Performance", price: "£99", description: "Image and mobile optimisation" },
  { id: "maintenance", name: "Yearly Maintenance", price: "£95/year", description: "Updates, changes, and support" },
];

export default function Start() {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [hasExistingWebsite, setHasExistingWebsite] = useState<boolean | null>(null);
  const [existingWebsiteUrl, setExistingWebsiteUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: {
      businessName: "",
      name: "",
      email: "",
      phone: "",
      details: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          selectedPackage,
          selectedIndustry,
          hasExistingWebsite,
          existingWebsiteUrl: hasExistingWebsite ? existingWebsiteUrl : undefined,
          selectedAddons,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit form");
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or email us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const validateUrl = (url: string): boolean => {
    const result = websiteUrlSchema.safeParse(url);
    if (!result.success) {
      setUrlError(result.error.errors[0]?.message || "Invalid URL");
      return false;
    }
    setUrlError(null);
    return true;
  };

  const canProceedStep1 = selectedPackage !== null;
  const canProceedStep2 = selectedIndustry !== null;
  const canProceedStep3 =
    hasExistingWebsite !== null &&
    (hasExistingWebsite === false || (existingWebsiteUrl.trim() !== "" && !urlError));

  const getProgressValue = () => {
    if (!selectedPackage) return 0;
    if (step === 1) return 20;
    if (step === 2) return 40;
    if (step === 3) return 60;
    if (step === 4) return 80;
    return 100;
  };

  return (
    <Layout>
      <section className="pt-20 pb-4 sm:pt-20 sm:pb-8 md:pt-20 md:pb-10 lg:pt-24 lg:pb-12 relative min-h-[calc(100dvh-3.5rem)] flex flex-col justify-start">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl relative z-10 flex-1 flex flex-col mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Step 1: Package Selection */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <StepHeader
                      title={
                        <>
                          Choose your <span className="text-primary">package</span>
                        </>
                      }
                      description="Select the package that fits your business needs."
                      progress={getProgressValue()}
                    />

                    <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      {packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={`relative w-full p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl text-left transition-all flex items-center justify-between border-2 bg-card ${
                            selectedPackage === pkg.id
                              ? "border-primary"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <div className="min-w-0 flex-1 mr-2 sm:mr-3">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                              <span className="text-sm sm:text-base md:text-lg font-bold">{pkg.name}</span>
                              {pkg.popular && (
                                <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] sm:text-[10px] font-medium border border-primary/30">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground truncate">
                              {pkg.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <div className="text-right flex items-baseline gap-1 sm:gap-2">
                              {pkg.originalPrice && (
                                <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                                  {pkg.originalPrice}
                                </span>
                              )}
                              <span className="text-base sm:text-lg md:text-xl font-bold text-primary">
                                {pkg.price}
                              </span>
                            </div>
                            <div
                              className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selectedPackage === pkg.id
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {selectedPackage === pkg.id && (
                                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                      className="btn-primary btn-md sm:btn-lg w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
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
                    <StepHeader
                      title={
                        <>
                          What's your <span className="text-primary">industry?</span>
                        </>
                      }
                      description="This helps us apply the right proven layouts for your business."
                      progress={getProgressValue()}
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                      {industries.map((industry) => (
                        <button
                          key={industry}
                          onClick={() => setSelectedIndustry(industry)}
                          className={`p-2.5 sm:p-3 rounded-lg text-center font-medium transition-all text-[11px] sm:text-xs md:text-sm border-2 ${
                            selectedIndustry === industry
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="btn-outline btn-md sm:btn-lg justify-center order-2 sm:order-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={!canProceedStep2}
                        className="btn-primary btn-md sm:btn-lg justify-center order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Existing Website */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <StepHeader
                      title={
                        <>
                          Do you have an <span className="text-primary">existing website?</span>
                        </>
                      }
                      description="This helps us understand where you're starting from."
                      progress={getProgressValue()}
                    />

                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <button
                        onClick={() => setHasExistingWebsite(true)}
                        className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all flex items-center gap-3 border-2 bg-card ${
                          hasExistingWebsite === true
                            ? "border-primary"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                            hasExistingWebsite === true ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <Globe
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              hasExistingWebsite === true ? "text-primary-foreground" : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm sm:text-base font-semibold block">Yes, I have a website</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            We'll review it before we start
                          </span>
                        </div>
                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                            hasExistingWebsite === true ? "border-primary bg-primary" : "border-muted-foreground/30"
                          }`}
                        >
                          {hasExistingWebsite === true && (
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setHasExistingWebsite(false);
                          setExistingWebsiteUrl("");
                          setUrlError(null);
                        }}
                        className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all flex items-center gap-3 border-2 bg-card ${
                          hasExistingWebsite === false
                            ? "border-primary"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                            hasExistingWebsite === false ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <X
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              hasExistingWebsite === false ? "text-primary-foreground" : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm sm:text-base font-semibold block">No, starting fresh</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            We'll build everything from scratch
                          </span>
                        </div>
                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                            hasExistingWebsite === false ? "border-primary bg-primary" : "border-muted-foreground/30"
                          }`}
                        >
                          {hasExistingWebsite === false && (
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                          )}
                        </div>
                      </button>
                    </div>

                    {/* URL Input - Only shows when "Yes" is selected */}
                    <AnimatePresence>
                      {hasExistingWebsite === true && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-4 sm:mb-6"
                        >
                          <label className="block text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">
                            Your website URL
                          </label>
                          <input
                            type="url"
                            value={existingWebsiteUrl}
                            onChange={(e) => {
                              setExistingWebsiteUrl(e.target.value);
                              if (e.target.value) validateUrl(e.target.value);
                              else setUrlError(null);
                            }}
                            onBlur={() => {
                              if (existingWebsiteUrl) validateUrl(existingWebsiteUrl);
                            }}
                            placeholder="https://www.example.com"
                            className={`input-base text-sm ${urlError ? "border-destructive focus:ring-destructive/50" : ""}`}
                          />
                          <FormError message={urlError || undefined} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={() => setStep(2)}
                        className="btn-outline btn-md sm:btn-lg justify-center order-2 sm:order-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </button>
                      <button
                        onClick={() => setStep(4)}
                        disabled={!canProceedStep3}
                        className="btn-primary btn-md sm:btn-lg justify-center order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Add-ons Selection */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <StepHeader
                      title={
                        <>
                          Any <span className="text-primary">extras?</span>
                        </>
                      }
                      description="Optional add-ons to enhance your website. Select any or skip."
                      progress={getProgressValue()}
                    />

                    <div className="grid gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                      {availableAddons.map((addon) => (
                        <button
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all flex items-center justify-between border-2 bg-card ${
                            selectedAddons.includes(addon.id)
                              ? "border-primary"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <div className="flex-1 min-w-0 mr-2">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 flex-wrap">
                              <span className="text-xs sm:text-sm font-semibold">{addon.name}</span>
                              <span className="text-[10px] sm:text-xs text-primary font-medium">{addon.price}</span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                              {addon.description}
                            </p>
                          </div>
                          <div
                            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
                              selectedAddons.includes(addon.id)
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/30"
                            }`}
                          >
                            {selectedAddons.includes(addon.id) && (
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {selectedAddons.length > 0 && (
                      <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 rounded-lg bg-secondary border border-border">
                        <div className="text-[10px] sm:text-xs text-muted-foreground">
                          Selected:{" "}
                          <span className="text-foreground font-medium">
                            {selectedAddons.length} add-on{selectedAddons.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={() => setStep(3)}
                        className="btn-outline btn-md sm:btn-lg justify-center order-2 sm:order-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </button>
                      <button
                        onClick={() => setStep(5)}
                        className="btn-primary btn-md sm:btn-lg justify-center order-1 sm:order-2"
                      >
                        {selectedAddons.length > 0 ? "Continue" : "Skip & Continue"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Details */}
                {step === 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <StepHeader
                      title={
                        <>
                          Tell us about <span className="text-primary">your business</span>
                        </>
                      }
                      description="Just the basics. We'll take it from here."
                      progress={getProgressValue()}
                    />

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">
                          Business Name *
                        </label>
                        <input
                          {...register("businessName")}
                          placeholder="e.g. Smith's Plumbing"
                          className={`input-base text-sm ${errors.businessName ? "border-destructive focus:ring-destructive/50" : ""}`}
                        />
                        <FormError message={errors.businessName?.message} />
                      </div>
                      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">
                            Your Name *
                          </label>
                          <input
                            {...register("name")}
                            placeholder="John Smith"
                            className={`input-base text-sm ${errors.name ? "border-destructive focus:ring-destructive/50" : ""}`}
                          />
                          <FormError message={errors.name?.message} />
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">
                            Phone
                          </label>
                          <input
                            {...register("phone")}
                            placeholder="07XXX XXXXXX"
                            className={`input-base text-sm ${errors.phone ? "border-destructive focus:ring-destructive/50" : ""}`}
                          />
                          <FormError message={errors.phone?.message} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          {...register("email")}
                          placeholder="john@example.com"
                          className={`input-base text-sm ${errors.email ? "border-destructive focus:ring-destructive/50" : ""}`}
                        />
                        <FormError message={errors.email?.message} />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">
                          Anything else?
                        </label>
                        <textarea
                          {...register("details")}
                          placeholder="Tell us about your services, target customers, or anything specific..."
                          rows={3}
                          className={`input-base resize-none text-sm ${errors.details ? "border-destructive focus:ring-destructive/50" : ""}`}
                        />
                        <FormError message={errors.details?.message} />
                      </div>

                      {submitError && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 sm:p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                        >
                          {submitError}
                        </motion.div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(4)}
                          disabled={isSubmitting}
                          className="btn-outline btn-md sm:btn-lg justify-center order-2 sm:order-1 disabled:opacity-50"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary btn-md sm:btn-lg justify-center order-1 sm:order-2 disabled:opacity-70"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Submit
                              <Send className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // Success State
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bordered-highlight text-center p-5 sm:p-6 md:p-10 relative"
              >
                <DottedGrid className="opacity-20" spacing={24} />
                <div className="relative z-10">
                  <motion.div
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4 sm:mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Check className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />
                  </motion.div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 sm:mb-3">
                    <span className="text-primary">You're in!</span>
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto mb-4 sm:mb-6">
                    We've sent a confirmation to your email. We'll be in touch within 24 hours.
                  </p>
                  <div className="inline-block p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-secondary border border-border text-left">
                    <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Selected Package</div>
                    <div className="text-base sm:text-lg font-bold capitalize">
                      {packages.find((p) => p.id === selectedPackage)?.name || selectedPackage}
                    </div>
                    {selectedAddons.length > 0 && (
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border">
                        <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Selected Add-ons</div>
                        <div className="text-xs sm:text-sm font-medium">
                          {selectedAddons.map((id) => availableAddons.find((a) => a.id === id)?.name).join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <Link to="/" className="btn-outline btn-md sm:btn-lg">
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
