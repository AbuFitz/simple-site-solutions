import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const onboardSchema = z.object({
  // Step 1: Your Details
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  businessName: z.string().min(2, "Please enter your business name"),

  // Step 2: About Your Business
  industry: z.string().min(1, "Please select your industry"),
  services: z.string().min(10, "Please briefly describe your services"),
  targetArea: z.string().min(2, "Please enter your target area"),
  hasExistingWebsite: z.boolean(),
  existingWebsiteUrl: z.string().optional(),
  hasLogo: z.boolean(),

  // Step 3: Your Project
  confirmedPackage: z.string().min(1, "Please confirm your package"),
  addons: z.array(z.string()),
  timeline: z.string().min(1, "Please select a timeline"),
  contentReady: z.string().min(1, "Please let us know about your content"),
  additionalNotes: z.string().optional(),
});

type OnboardFormData = z.infer<typeof onboardSchema>;

const packages = [
  { id: "essential", name: "Essential", price: "£199" },
  { id: "business", name: "Business", price: "£399" },
  { id: "growth", name: "Growth", price: "£649" },
];

const industries = [
  "Plumber",
  "Electrician",
  "Mechanic",
  "Cleaner",
  "Builder",
  "Decorator",
  "Landscaper",
  "Barber/Salon",
  "Tutor",
  "Restaurant/Cafe",
  "Retail Shop",
  "Other",
];

const availableAddons = [
  { id: "hosting", name: "Hosting + Maintenance", price: "£95/year" },
  { id: "google-business", name: "Google Business Profile Setup", price: "£79" },
];

const timelines = [
  { id: "asap", label: "As soon as possible" },
  { id: "1-2weeks", label: "Within 1-2 weeks" },
  { id: "flexible", label: "Flexible / No rush" },
];

const contentOptions = [
  { id: "ready", label: "I have everything ready" },
  { id: "mostly", label: "I have most of it" },
  { id: "need-help", label: "I'll need some guidance" },
  { id: "nothing", label: "Starting from scratch" },
];

function StepHeader({ step, totalSteps }: { step: number; totalSteps: number }) {
  const progress = (step / totalSteps) * 100;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">
          Step {step} of {totalSteps}
        </span>
        <span className="text-xs font-semibold">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-destructive mt-1.5"
    >
      {message}
    </motion.p>
  );
}

export default function Onboard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<OnboardFormData>({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      hasExistingWebsite: false,
      hasLogo: false,
      addons: [],
    },
  });

  const hasExistingWebsite = watch("hasExistingWebsite");
  const selectedAddons = watch("addons") || [];

  const toggleAddon = (addonId: string) => {
    const current = selectedAddons;
    if (current.includes(addonId)) {
      setValue("addons", current.filter((id) => id !== addonId));
    } else {
      setValue("addons", [...current, addonId]);
    }
  };

  const validateStep = async (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return await trigger(["name", "email", "phone", "businessName"]);
      case 2:
        return await trigger(["industry", "services", "targetArea", "hasExistingWebsite", "hasLogo"]);
      case 3:
        return await trigger(["confirmedPackage", "timeline", "contentReady"]);
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(step);
    if (isValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: OnboardFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/onboard-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError("Something went wrong. Please try again or call us on 01442 601387.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 relative min-h-[70vh] flex items-center">
          <DottedGrid className="opacity-30" spacing={32} />
          <div className="content-width relative z-10">
            <motion.div
              className="max-w-xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                All set, thank you!
              </h1>
              <p className="text-muted-foreground mb-6">
                We've received your details and sent you a confirmation email.
                We'll be in touch within 24 hours to get things moving.
              </p>
              <p className="text-sm text-muted-foreground">
                Questions? Call us on{" "}
                <a href="tel:01442601387" className="text-primary hover:underline">
                  01442 601387
                </a>
              </p>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 relative">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                Welcome aboard
              </h1>
              <p className="text-muted-foreground">
                Let's get everything we need to build your website.
              </p>
            </div>

            {/* Form Card */}
            <div className="bordered-section p-5 sm:p-8">
              <DottedGrid className="opacity-10" spacing={24} />
              <div className="relative z-10">
                <StepHeader step={step} totalSteps={totalSteps} />

                <form onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Your Details */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <h2 className="text-lg font-semibold mb-4">Your Details</h2>

                        <div>
                          <label className="block text-sm font-medium mb-2">Your Name</label>
                          <input
                            {...register("name")}
                            type="text"
                            className="input-field"
                            placeholder="John Smith"
                          />
                          <FormError message={errors.name?.message} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Email Address</label>
                          <input
                            {...register("email")}
                            type="email"
                            className="input-field"
                            placeholder="john@example.com"
                          />
                          <FormError message={errors.email?.message} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Phone Number</label>
                          <input
                            {...register("phone")}
                            type="tel"
                            className="input-field"
                            placeholder="07123 456789"
                          />
                          <FormError message={errors.phone?.message} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Business Name</label>
                          <input
                            {...register("businessName")}
                            type="text"
                            className="input-field"
                            placeholder="Smith Plumbing Ltd"
                          />
                          <FormError message={errors.businessName?.message} />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: About Your Business */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <h2 className="text-lg font-semibold mb-4">About Your Business</h2>

                        <div>
                          <label className="block text-sm font-medium mb-2">Industry</label>
                          <select {...register("industry")} className="input-field">
                            <option value="">Select your industry</option>
                            {industries.map((ind) => (
                              <option key={ind} value={ind}>{ind}</option>
                            ))}
                          </select>
                          <FormError message={errors.industry?.message} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            What services do you offer?
                          </label>
                          <textarea
                            {...register("services")}
                            className="input-field min-h-[100px]"
                            placeholder="e.g., Boiler installations, emergency repairs, bathroom fitting..."
                          />
                          <FormError message={errors.services?.message} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Target Area
                          </label>
                          <input
                            {...register("targetArea")}
                            type="text"
                            className="input-field"
                            placeholder="e.g., Hemel Hempstead and surrounding areas"
                          />
                          <FormError message={errors.targetArea?.message} />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Do you have an existing website?
                            </label>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => setValue("hasExistingWebsite", true)}
                                className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                                  hasExistingWebsite
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setValue("hasExistingWebsite", false)}
                                className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                                  !hasExistingWebsite
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Do you have a logo?
                            </label>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => setValue("hasLogo", true)}
                                className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                                  watch("hasLogo")
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setValue("hasLogo", false)}
                                className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                                  !watch("hasLogo")
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        </div>

                        {hasExistingWebsite && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <label className="block text-sm font-medium mb-2">
                              Current website URL
                            </label>
                            <input
                              {...register("existingWebsiteUrl")}
                              type="url"
                              className="input-field"
                              placeholder="https://www.example.com"
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* Step 3: Your Project */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <h2 className="text-lg font-semibold mb-4">Your Project</h2>

                        <div>
                          <label className="block text-sm font-medium mb-3">
                            Confirmed Package
                          </label>
                          <div className="grid gap-3">
                            {packages.map((pkg) => (
                              <label
                                key={pkg.id}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  watch("confirmedPackage") === pkg.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    {...register("confirmedPackage")}
                                    type="radio"
                                    value={pkg.id}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      watch("confirmedPackage") === pkg.id
                                        ? "border-primary bg-primary"
                                        : "border-border"
                                    }`}
                                  >
                                    {watch("confirmedPackage") === pkg.id && (
                                      <Check className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                  <span className="font-medium">{pkg.name}</span>
                                </div>
                                <span className="text-primary font-semibold">{pkg.price}</span>
                              </label>
                            ))}
                          </div>
                          <FormError message={errors.confirmedPackage?.message} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-3">
                            Any add-ons? (Optional)
                          </label>
                          <div className="grid gap-3">
                            {availableAddons.map((addon) => (
                              <button
                                key={addon.id}
                                type="button"
                                onClick={() => toggleAddon(addon.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                                  selectedAddons.includes(addon.id)
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                      selectedAddons.includes(addon.id)
                                        ? "border-primary bg-primary"
                                        : "border-border"
                                    }`}
                                  >
                                    {selectedAddons.includes(addon.id) && (
                                      <Check className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                  <span className="font-medium">{addon.name}</span>
                                </div>
                                <span className="text-primary font-semibold">{addon.price}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-3">Timeline</label>
                          <div className="grid gap-2">
                            {timelines.map((t) => (
                              <label
                                key={t.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  watch("timeline") === t.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <input
                                  {...register("timeline")}
                                  type="radio"
                                  value={t.id}
                                  className="sr-only"
                                />
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    watch("timeline") === t.id
                                      ? "border-primary bg-primary"
                                      : "border-border"
                                  }`}
                                >
                                  {watch("timeline") === t.id && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                                <span className="text-sm">{t.label}</span>
                              </label>
                            ))}
                          </div>
                          <FormError message={errors.timeline?.message} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-3">
                            Content readiness
                          </label>
                          <div className="grid gap-2">
                            {contentOptions.map((opt) => (
                              <label
                                key={opt.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  watch("contentReady") === opt.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <input
                                  {...register("contentReady")}
                                  type="radio"
                                  value={opt.id}
                                  className="sr-only"
                                />
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    watch("contentReady") === opt.id
                                      ? "border-primary bg-primary"
                                      : "border-border"
                                  }`}
                                >
                                  {watch("contentReady") === opt.id && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                          <FormError message={errors.contentReady?.message} />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <h2 className="text-lg font-semibold mb-4">Almost done!</h2>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Anything else we should know? (Optional)
                          </label>
                          <textarea
                            {...register("additionalNotes")}
                            className="input-field min-h-[120px]"
                            placeholder="Any specific requirements, preferences, or things you'd like us to know..."
                          />
                        </div>

                        {/* Summary */}
                        <div className="p-4 rounded-xl bg-secondary border border-border">
                          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                            Summary
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Name</span>
                              <span className="font-medium">{watch("name")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Business</span>
                              <span className="font-medium">{watch("businessName")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Package</span>
                              <span className="font-medium text-primary">
                                {packages.find((p) => p.id === watch("confirmedPackage"))?.name} (
                                {packages.find((p) => p.id === watch("confirmedPackage"))?.price})
                              </span>
                            </div>
                            {selectedAddons.length > 0 && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Add-ons</span>
                                <span className="font-medium">
                                  {selectedAddons.map((id) =>
                                    availableAddons.find((a) => a.id === id)?.name
                                  ).join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {submitError && (
                          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                            {submitError}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < totalSteps ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Help text */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Need help? Call us on{" "}
              <a href="tel:01442601387" className="text-primary hover:underline">
                01442 601387
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
