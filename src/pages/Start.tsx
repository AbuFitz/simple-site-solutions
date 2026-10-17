import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { recallPreview } from "@/lib/preview/generate";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FlowGlow } from "@/components/oss/FlowGlow";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { PayOnline } from "@/components/PayOnline";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { addons as addonData, hosting, packages as packageData, getPackage, getAddon } from "@/data/packages";
import { AddonChoice, MonthlyChoice, PackageChoice } from "@/components/form/Choices";
import { briefFieldsSchema } from "@/lib/brief-schema";
import { clearDraft, loadDraft, saveDraft } from "@/lib/draft";
import { REPLY_COPY } from "@/data/site";

const formSchema = briefFieldsSchema;
type FormData = z.infer<typeof formSchema>;

function StepHeader({
  title,
  description,
  progress,
  headingRef,
}: {
  title: React.ReactNode;
  description: string;
  progress: number;
  headingRef?: React.Ref<HTMLHeadingElement>;
}) {
  return (
    <div className="mb-5 sm:mb-7">
      <h1 ref={headingRef} tabIndex={-1} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-3 focus:outline-none">
        {title}
      </h1>
      {description ? <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{description}</p> : null}

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Progress</span>
          <span className="text-xs font-semibold text-foreground">{progress}%</span>
        </div>
        <Progress value={progress} aria-label="Project brief progress" className="h-1.5" />
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: (a: { id: string; "aria-invalid": boolean; "aria-describedby"?: string; "aria-required"?: boolean }) => React.ReactNode;
}) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5">
        {label}
        {required ? <span className="text-muted-foreground font-normal"> (required)</span> : <span className="text-muted-foreground font-normal"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground mb-1.5">
          {hint}
        </p>
      )}
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy, "aria-required": required })}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}

const packages = [
  ...packageData,
];

type StepKey = "package" | "addons" | "details" | "monthly";
const STEP_NUMBER: Record<StepKey, number> = { package: 1, addons: 2, monthly: 3, details: 4 };

/** Enterprise is quoted individually, so add-ons and the monthly plan are agreed in the quotation instead. */
const stepsFor = (pkg: string | null): StepKey[] => (pkg === "enterprise" ? ["package", "details"] : ["package", "addons", "monthly", "details"]);

const FIELD_NAMES = ["businessName", "name", "email", "phone", "businessDescription", "websiteUrl", "details"] as const;

export default function Start() {
  const [params] = useSearchParams();
  const prefillPackage = params.get("package");
  const draft = useMemo(() => loadDraft(), []);
  const [stepNo, setStepNo] = useState(() => (draft && (!prefillPackage || prefillPackage === draft.selectedPackage) ? draft.step : 1));
  const [selectedPackage, setSelectedPackage] = useState<string | null>(
    packages.some((p) => p.id === prefillPackage) ? prefillPackage : draft?.selectedPackage ?? null
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>(draft?.selectedAddons ?? []);
  const [monthlyPlan, setMonthlyPlan] = useState<"hosting-care" | "none" | null>(draft?.monthlyPlan === "hosting-care" || draft?.monthlyPlan === "none" ? draft.monthlyPlan : null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [restored] = useState(Boolean(draft));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const stored = useMemo(() => recallPreview(), []);
  const steps = stepsFor(selectedPackage);
  const step: StepKey = (Object.keys(STEP_NUMBER) as StepKey[]).find((k) => STEP_NUMBER[k] === stepNo && steps.includes(k)) ?? "package";
  const stepIndex = steps.indexOf(step);
  const goTo = (k: StepKey) => setStepNo(STEP_NUMBER[k]);
  const next = () => steps[stepIndex + 1] && goTo(steps[stepIndex + 1]);
  const back = () => steps[stepIndex - 1] && goTo(steps[stepIndex - 1]);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      businessName: (params.get("business") ?? draft?.fields.businessName ?? "").slice(0, 100),
      name: draft?.fields.name ?? "",
      email: draft?.fields.email ?? stored?.email ?? "",
      phone: draft?.fields.phone ?? stored?.phone ?? "",
      businessDescription: (params.get("type") ?? draft?.fields.businessDescription ?? "").slice(0, 200),
      websiteUrl: draft?.fields.websiteUrl ?? "",
      details: draft?.fields.details ?? "",
    },
  });

  // Keep the draft in this browser so a refresh or an accidental close doesn't lose the brief
  const values = watch();
  useEffect(() => {
    if (isSubmitted) return;
    const fields: Record<string, string> = {};
    FIELD_NAMES.forEach((k) => {
      fields[k] = String((values as Record<string, unknown>)[k] ?? "");
    });
    saveDraft({ step: stepNo, selectedPackage, selectedAddons, monthlyPlan, fields });
  }, [values, stepNo, selectedPackage, selectedAddons, monthlyPlan, isSubmitted]);

  // Move focus to the new step's heading so keyboard and screen-reader users land in the right place
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stepNo, isSubmitted]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    const form = document.getElementById("brief-form") as HTMLFormElement | null;
    const honeypot = (form?.elements.namedItem("company_site") as HTMLInputElement | null)?.value ?? "";

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          details: data.details,
          selectedPackage: selectedPackage ?? "unsure",
          selectedAddons: selectedPackage === "enterprise" ? [] : selectedAddons,
          monthlyPlan: selectedPackage === "enterprise" ? "none" : monthlyPlan ?? "none",
          company_site: honeypot,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400 && errorData.fields) {
          for (const [field, message] of Object.entries(errorData.fields as Record<string, string>)) {
            if ((FIELD_NAMES as readonly string[]).includes(field)) setError(field as keyof FormData, { message });
          }
          throw new Error("Some details need fixing. Check the highlighted fields.");
        }
        if (response.status === 429) throw new Error("Too many attempts. Please wait a few minutes and try again.");
        throw new Error(errorData.error || "We couldn't send your brief. Your answers are saved here, so you can try again or email us.");
      }

      clearDraft();
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "We couldn't send your brief. Your answers are saved here, so you can try again or email us."
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

  const getProgressValue = () => (selectedPackage ? Math.round(((stepIndex + 1) / steps.length) * 100) : 0);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(onSubmit)(e);
  };

  const chosen = selectedPackage ? getPackage(selectedPackage) : undefined;
  const addonTotal = selectedAddons.reduce((sum, id) => sum + Number(getAddon(id)?.price ?? 0), 0);

  const glowLevel = stepNo + (monthlyPlan ? 1 : 0) + (selectedPackage ? 1 : 0) + selectedAddons.length + (values ? Object.values(values).filter((v) => typeof v === "string" && v.trim()).length : 0);

  return (
    <Layout>
      <Seo path="/start" />
      <section className="pt-20 pb-4 sm:pt-20 sm:pb-8 md:pt-20 md:pb-10 lg:pt-24 lg:pb-12 relative min-h-[calc(100dvh-3.5rem)] flex flex-col justify-start">
        <FlowGlow level={glowLevel} />
        <DottedGrid className="opacity-30" spacing={32} />
        <div className={`content-width relative z-10 flex-1 flex flex-col mx-auto w-full sm:w-[620px] sm:!px-0 !max-w-full`}>
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                
              >
                <div>
                {/* Step: package */}
                {step === "package" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <StepHeader
                      title={<>Pick a <span className="text-primary">package</span></>}
                      description="Pick a fixed package, or tell us about a bigger project and we will quote for it."
                      progress={getProgressValue()}
                      headingRef={headingRef}
                    />

                    <div role="radiogroup" aria-label="Package" className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      {packages.map((pkg) => (
                        <PackageChoice key={pkg.id} pkg={pkg} selected={selectedPackage === pkg.id} onSelect={() => setSelectedPackage(pkg.id)} />
                      ))}
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selectedPackage === "unsure"}
                        onClick={() => setSelectedPackage("unsure")}
                        className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors sm:p-4 md:p-5 ${selectedPackage === "unsure" ? "border-primary/70 bg-primary/[0.07]" : "border-foreground/10 bg-foreground/[0.035] hover:border-foreground/25"}`}
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-bold sm:text-base md:text-lg">Not sure yet</span>
                        </span>
                        <span aria-hidden="true" className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border sm:h-5 sm:w-5 ${selectedPackage === "unsure" ? "border-primary bg-primary" : "border-foreground/30"}`}>
                          {selectedPackage === "unsure" && <Check className="h-3 w-3 text-primary-foreground" />}
                        </span>
                      </button>
                    </div>

                    <button type="button" onClick={next} disabled={!selectedPackage} className="btn-primary btn-md sm:btn-lg w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </motion.div>
                )}

                {/* Step: add-ons */}
                {step === "addons" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <StepHeader
                      title={<>Any <span className="text-primary">add-ons?</span></>}
                      description="Optional extras, priced separately."
                      progress={getProgressValue()}
                      headingRef={headingRef}
                    />

                    <div className="grid grid-cols-2 auto-rows-fr gap-2 sm:gap-3 mb-4 sm:mb-6">
                      {addonData.map((addon, i) => (
                        <AddonChoice key={addon.id} side={i % 2 === 0 ? "left" : "right"} addon={addon} selected={selectedAddons.includes(addon.id)} onToggle={() => toggleAddon(addon.id)} />
                      ))}
                    </div>

                    <p className="mb-4 text-sm text-muted-foreground sm:mb-6">
                      <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">Tap an add-on to pick it and see what it is.</span>
                      <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">Hover over an add-on to see what it is.</span>
                    </p>

                    {selectedAddons.length > 0 && (
                      <p className="mb-4 sm:mb-6 rounded-xl border border-foreground/10 bg-foreground/[0.035] p-3 text-sm text-muted-foreground" aria-live="polite">
                        {selectedAddons.length} add-on{selectedAddons.length > 1 ? "s" : ""} selected:{" "}
                        <span className="font-medium text-foreground">£{addonTotal}</span>
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button type="button" onClick={back} className="btn-outline btn-md sm:btn-lg justify-center order-2 sm:order-1">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </button>
                      <button type="button" onClick={next} className="btn-primary btn-md sm:btn-lg justify-center order-1 sm:order-2">
                        {selectedAddons.length > 0 ? "Continue" : "Skip and continue"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Steps: your details, then the monthly plan. One form so a single submit sends everything. */}
            {step === "monthly" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <StepHeader
                      title={<>Monthly <span className="text-primary">plan</span></>}
                      description="Want us to look after the website once it is live? It runs month to month."
                      progress={getProgressValue()}
                      headingRef={headingRef}
                    />

                    <MonthlyChoice value={monthlyPlan} onChange={setMonthlyPlan} />
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {hosting.terms.slice(0, 2).map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-5">
                      <button type="button" onClick={back} className="btn-outline btn-md sm:btn-lg justify-center order-2 sm:order-1 min-h-[44px]">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </button>
                      <button type="button" onClick={next} disabled={monthlyPlan === null} className="btn-primary btn-md sm:btn-lg justify-center order-1 sm:order-2 disabled:opacity-60 min-h-[44px]">
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "details" && (
                  <form id="brief-form" onSubmit={onFormSubmit} noValidate>
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <StepHeader
                          title={<>Your <span className="text-primary">details</span></>}
                          description="Last step. Tell us how to reach you."
                          progress={getProgressValue()}
                          headingRef={headingRef}
                        />

                        <div className="space-y-4 mb-6 sm:mb-8">
                          {restored && (
                            <p className="text-sm text-muted-foreground">
                              We kept your earlier answers in this browser.{" "}
                              <button
                                type="button"
                                className="underline underline-offset-2 hover:text-foreground min-h-[44px]"
                                onClick={() => {
                                  clearDraft();
                                  window.location.assign("/start");
                                }}
                              >
                                Start again
                              </button>
                            </p>
                          )}
                          <Field id="businessName" label="Business name" required error={errors.businessName?.message}>
                            {(a) => <input {...a} {...register("businessName")} autoComplete="organization" placeholder="e.g. Smith's Plumbing" className="input-base text-base" />}
                          </Field>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field id="name" label="Your name" required error={errors.name?.message}>
                              {(a) => <input {...a} {...register("name")} autoComplete="name" placeholder="John Smith" className="input-base text-base" />}
                            </Field>
                            <Field id="phone" label="Phone number" error={errors.phone?.message}>
                              {(a) => <input {...a} {...register("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="07XXX XXXXXX" className="input-base text-base" />}
                            </Field>
                          </div>

                          <Field id="email" label="Email address" required hint="We reply here." error={errors.email?.message}>
                            {(a) => <input {...a} {...register("email")} type="email" autoComplete="email" placeholder="john@example.com" className="input-base text-base" />}
                          </Field>

                          <Field id="businessDescription" label="What does your business do?" required error={errors.businessDescription?.message}>
                            {(a) => <input {...a} {...register("businessDescription")} placeholder="e.g. Mobile mechanic, hair salon, personal trainer" className="input-base text-base" />}
                          </Field>

                          <Field id="websiteUrl" label="Current website" error={errors.websiteUrl?.message}>
                            {(a) => <input {...a} {...register("websiteUrl")} inputMode="url" autoComplete="url" placeholder="e.g. www.yourbusiness.co.uk" className="input-base text-base" />}
                          </Field>

                          <Field id="details" label="Anything else we should know?" error={errors.details?.message}>
                            {(a) => <textarea {...a} {...register("details")} placeholder="Goals, timeline, questions" rows={3} className="input-base resize-none text-base" />}
                          </Field>

                          <p className="text-sm text-muted-foreground">
                            Used only to reply to you. <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">Privacy</Link>
                          </p>
                        </div>

                        {/* What you are sending, with the sums shown. */}
                        <dl className="mt-1 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 rounded-xl border border-foreground/10 bg-foreground/[0.035] p-3 text-sm sm:p-4" aria-label="Summary">
                          <dt className="text-muted-foreground">Package</dt>
                          <dd className="text-right font-medium">{chosen ? `${chosen.name}${chosen.price ? ` £${chosen.price}` : ""}` : "Not sure yet"}</dd>
                          {selectedAddons.length > 0 && (
                            <>
                              <dt className="text-muted-foreground">Add-ons</dt>
                              <dd className="text-right font-medium">£{addonTotal}</dd>
                            </>
                          )}
                          {chosen?.price && (
                            <>
                              <dt className="text-muted-foreground">One-off total</dt>
                              <dd className="text-right font-semibold">£{Number(chosen.price) + addonTotal}</dd>
                            </>
                          )}
                          <dt className="text-muted-foreground">Monthly</dt>
                          <dd className="text-right font-medium">{monthlyPlan === "hosting-care" ? `£${hosting.price}/month` : monthlyPlan === "none" ? "None" : "Choose above"}</dd>
                        </dl>
                      </motion.div>

                    {/* Honeypot: hidden from people and assistive tech. Bots tend to fill it in. */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label>
                        Leave this empty
                        <input type="text" name="company_site" tabIndex={-1} autoComplete="off" defaultValue="" />
                      </label>
                    </div>

                    {submitError && (
                      <div role="alert" className="mt-4 p-3 sm:p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                        {submitError}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                      <button type="button" onClick={back} disabled={isSubmitting} className="btn-outline btn-md sm:btn-lg justify-center order-2 sm:order-1 disabled:opacity-50 min-h-[44px]">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                        className="btn-primary btn-md sm:btn-lg justify-center order-1 sm:order-2 disabled:opacity-60 min-h-[44px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send my brief
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
                </div>
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
                    transition={{ delay: 0.1, type: "spring" }}
                  >
                    <Check className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />
                  </motion.div>
                  <h1 ref={headingRef} tabIndex={-1} className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 sm:mb-3 focus:outline-none">
                    <span className="text-primary">Brief received</span>
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto mb-4 sm:mb-6">
                    {REPLY_COPY}
                  </p>
                  <div className="inline-block p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-secondary border border-border text-left">
                    <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Selected Package</div>
                    <div className="text-base sm:text-lg font-bold">
                      {getPackage(selectedPackage ?? "")?.name || "Not sure yet"}
                    </div>
                    {selectedAddons.length > 0 && (
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border">
                        <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Selected Add-ons</div>
                        <div className="text-xs sm:text-sm font-medium">
                          {selectedAddons.map((id) => getAddon(id)?.name).join(", ")}
                        </div>
                      </div>
                    )}
                    {selectedPackage !== "enterprise" && (
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border">
                        <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">Monthly plan</div>
                        <div className="text-xs sm:text-sm font-medium">{monthlyPlan === "hosting-care" ? `${hosting.name}, £${hosting.price}/month` : "None for now"}</div>
                      </div>
                    )}
                  </div>
                  <PayOnline packageId={selectedPackage} />
                  <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:mt-6 sm:flex-row">
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
