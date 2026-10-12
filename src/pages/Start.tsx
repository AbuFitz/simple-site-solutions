import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  name: z.string().min(2, "Your name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  businessDescription: z.string().min(5, "Please tell us what your business does"),
  websiteUrl: z.string().optional(),
  details: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

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
      <h1 className="t-h2 mb-3">
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
        <Progress value={progress} aria-label="Form progress" className="h-1 sm:h-1.5" />
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
    id: "starter",
    name: "The Starter",
    price: "£199",
    description: "Everything you need to get online properly",
  },
  {
    id: "sorted",
    name: "The Sorted",
    price: "£399",
    description: "Look established and win trust",
    popular: true,
  },
  {
    id: "works",
    name: "The Works",
    price: "£649",
    description: "Compete seriously and scale",
  },
  {
    id: "unsure",
    name: "Not sure yet",
    price: "",
    description: "Help me choose the right package",
  },
];

const availableAddons = [
  { id: "logo", name: "Logo Design", price: "£49" },
  { id: "google-business", name: "Google Business Profile Setup", price: "£39" },
  { id: "booking", name: "Booking System Setup", price: "£39" },
  { id: "email-templates", name: "Extra Email Templates (×3)", price: "£29" },
  { id: "seo-audit", name: "SEO Audit Report", price: "£59" },
  { id: "legal-pages", name: "Legal Pages Pack", price: "£19" },
];

export default function Start() {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      businessName: "",
      name: "",
      email: "",
      phone: "",
      businessDescription: "",
      websiteUrl: "",
      details: "",
    },
  });

  const onSubmit = async (data: FormData) => {
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
          selectedAddons,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit form");
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const canProceedStep1 = selectedPackage !== null;

  const getProgressValue = () => {
    if (!selectedPackage) return 0;
    if (step === 1) return 33;
    if (step === 2) return 66;
    return 100;
  };

  return (
    <Layout>
      <section className="pt-10 pb-16 md:pt-16 relative flex flex-col justify-start">
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
                                  Most Popular
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground truncate">
                              {pkg.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            {pkg.price && (
                              <span className="text-base sm:text-lg md:text-xl font-bold text-primary">
                                {pkg.price}
                              </span>
                            )}
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

                {/* Step 2: Add-ons Selection */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <StepHeader
                      title={
                        <>
                          Any <span className="text-primary">add-ons?</span>
                        </>
                      }
                      description="Optional extras to enhance your website. Select any or skip."
                      progress={getProgressValue()}
                    />

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                      {availableAddons.map((addon) => (
                        <button
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all border-2 bg-card ${
                            selectedAddons.includes(addon.id)
                              ? "border-primary"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-xs sm:text-sm font-semibold leading-tight">{addon.name}</span>
                            <div
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ml-2 ${
                                selectedAddons.includes(addon.id)
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {selectedAddons.includes(addon.id) && (
                                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] sm:text-xs text-primary font-medium">{addon.price}</span>
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
                        onClick={() => setStep(1)}
                        className="btn-outline btn-md sm:btn-lg justify-center order-2 sm:order-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        className="btn-primary btn-md sm:btn-lg justify-center order-1 sm:order-2"
                      >
                        {selectedAddons.length > 0 ? "Continue" : "Skip & Continue"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Your Details */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <StepHeader
                      title={
                        <>
                          Tell us about <span className="text-primary">you</span>
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
                            Phone Number
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
                          Email Address *
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
                          What does your business do? *
                        </label>
                        <input
                          {...register("businessDescription")}
                          placeholder="e.g. Mobile mechanic, Hair salon, Personal trainer..."
                          className={`input-base text-sm ${errors.businessDescription ? "border-destructive focus:ring-destructive/50" : ""}`}
                        />
                        <FormError message={errors.businessDescription?.message} />
                      </div>

                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">
                          Current website URL (if you have one)
                        </label>
                        <input
                          {...register("websiteUrl")}
                          placeholder="e.g. www.yourbusiness.co.uk"
                          className={`input-base text-sm ${errors.websiteUrl ? "border-destructive focus:ring-destructive/50" : ""}`}
                        />
                        <FormError message={errors.websiteUrl?.message} />
                      </div>

                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2">
                          Anything else we should know?
                        </label>
                        <textarea
                          {...register("details")}
                          placeholder="Tell us anything — your goals, timeline, questions..."
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
                          onClick={() => setStep(2)}
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
                    <div className="text-base sm:text-lg font-bold">
                      {packages.find((p) => p.id === selectedPackage)?.name || "Not sure yet"}
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
