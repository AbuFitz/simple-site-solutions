import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Monitor, Pencil, RefreshCw, Smartphone } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { DeviceFrame } from "@/components/preview/DeviceFrame";
import { SitePreview } from "@/components/preview/SitePreview";
import { Wizard } from "@/components/preview/Wizard";
import { buildPreview, decodeInput, encodeInput, recommendPackage, rememberPreview, startHref } from "@/lib/preview/generate";
import { firstIncomplete, isComplete, type StepId } from "@/lib/preview/wizard";
import type { PreviewInput } from "@/lib/preview/types";
import { packages } from "@/data/packages";

const domainFor = (name: string) => `${(name === "Your Business Name" ? "yourbusiness" : name.toLowerCase().replace(/[^a-z0-9]+/g, "")) || "yourbusiness"}.co.uk`;

export default function Preview() {
  const search = typeof window === "undefined" ? "" : window.location.search;
  const initial = useMemo(() => decodeInput(search), [search]);
  const [input, setInput] = useState<PreviewInput>(initial);
  const [categoryChosen, setCategoryChosen] = useState(() => new URLSearchParams(search).has("c"));
  const [stage, setStage] = useState<"wizard" | "result">(() => (isComplete(initial, { categoryChosen: new URLSearchParams(search).has("c") }) ? "result" : "wizard"));
  const [step, setStep] = useState<StepId>(() => firstIncomplete(initial, { categoryChosen: new URLSearchParams(search).has("c") }));
  const [device, setDevice] = useState<"desktop" | "phone">(() => (typeof window !== "undefined" && window.innerWidth < 768 ? "phone" : "desktop"));
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Nothing is mandatory: if the trade was skipped the preview uses the general-purpose template.
  const effective = (i: PreviewInput): PreviewInput => (categoryChosen ? i : { ...i, category: "other" });
  const update = (patch: Partial<PreviewInput>) => setInput((i) => ({ ...i, ...patch }));

  // Keep the address bar shareable, and remember the preview for the project form (this tab only)
  const deferred = useDeferredValue(input);
  useEffect(() => {
    const t = window.setTimeout(() => {
      const qs = encodeInput(deferred);
      window.history.replaceState(null, "", `${window.location.pathname}?${categoryChosen ? qs : qs.replace(/(^|&)c=[^&]*/, "").replace(/^&/, "")}`);
      if (stage === "result") rememberPreview(effective(deferred));
    }, 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferred, categoryChosen, stage]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    if (stage === "result") headingRef.current?.focus();
  }, [stage]);

  const model = useMemo(() => buildPreview(effective(deferred)), [deferred, categoryChosen]);
  const rec = useMemo(() => recommendPackage(effective(deferred)), [deferred, categoryChosen]);
  const pkg = packages.find((p) => p.id === rec.id)!;
  const domain = domainFor(model.name);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/preview?${encodeInput(effective(input))}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  if (stage === "wizard") {
    return (
      <Layout>
        <Seo path="/preview" />
        <section className="relative pb-24 pt-24 sm:pb-20 sm:pt-32">
          <DottedGrid className="opacity-30" spacing={36} />
          <div className="content-width relative z-10">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <div className={step === "name" ? "" : "hidden lg:block"}>
                  <span className="badge-primary mb-3 inline-block text-[9px] sm:text-xs">Website preview</span>
                  <h1 className="mb-5 text-xl font-bold tracking-tight sm:mb-0 sm:text-3xl md:text-4xl">
                    See what your website <span className="text-primary">could look like</span>
                  </h1>
                  <p className="text-body mb-8 mt-3 hidden max-w-md sm:block">Answer a few quick questions and we'll build a sample website for your trade, with your name, your area on a real map and your services. It takes about a minute.</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/60 p-4 sm:p-6">
                  <Wizard
                    input={input}
                    update={update}
                    categoryChosen={categoryChosen}
                    setCategoryChosen={setCategoryChosen}
                    step={step}
                    goTo={setStep}
                    onFinish={() => {
                      setStage("result");
                    }}
                  />
                </div>
                <p className="mt-4 text-xs text-muted-foreground">Your answers stay in your browser. Nothing is sent to us until you choose to start a project.</p>
              </div>
              <div className="hidden lg:col-span-7 lg:block">
                <div className="sticky top-28">
                  <p className="mb-3 text-sm font-medium text-muted-foreground">Your preview so far</p>
                  <DeviceFrame device="desktop" domain={domain}>
                    <SitePreview model={model} compact={false} />
                  </DeviceFrame>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo path="/preview" />
      <section className="relative pb-4 pt-24 sm:pt-32">
        <DottedGrid className="opacity-30" spacing={36} />
        <div className="content-width relative z-10">
          <p className="text-sm text-muted-foreground">
            {model.category.label}
            {model.town ? ` · ${model.town}` : ""}
          </p>
          <h1 ref={headingRef} tabIndex={-1} className="text-headline mt-1 max-w-3xl focus:outline-none">
            {model.name === "Your Business Name" ? "Your" : <>{model.name}'s</>} <span className="text-primary">website preview</span>
          </h1>
          <p className="text-body mt-3 max-w-2xl">This is a sample built from your answers. Your real site uses your own photos and wording, and we write the rest with you.</p>
        </div>
      </section>

      <section className="pb-16 pt-4 sm:pb-24">
        <div className="content-width space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="tablist" aria-label="Preview size" className="inline-flex rounded-full border border-border bg-secondary p-1">
              {(
                [
                  ["desktop", "Desktop", Monitor],
                  ["phone", "Phone", Smartphone],
                ] as const
              ).map(([id, text, Icon]) => (
                <button key={id} type="button" role="tab" aria-selected={device === id} onClick={() => setDevice(id)} className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${device === id ? "bg-primary !text-background" : "text-foreground/80 hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {text}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary btn-sm min-h-[44px] gap-2"
                onClick={() => {
                  setStep("review");
                  setStage("wizard");
                }}
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit details
              </button>
              <button type="button" className="btn-secondary btn-sm min-h-[44px] gap-2" onClick={() => update({ seed: input.seed + 1 })}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try another style
              </button>
              <button type="button" className="btn-secondary btn-sm min-h-[44px] gap-2" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Link copied" : "Copy link"}
              </button>
            </div>
          </div>
          <p role="status" className="sr-only">
            {copied ? "Link copied to clipboard" : `Preview updated for ${model.name}`}
          </p>

          <motion.div key={device} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={device === "phone" ? "mx-auto max-w-[26rem]" : ""}>
            <DeviceFrame device={device} domain={domain}>
              <SitePreview model={model} compact={device === "phone"} />
            </DeviceFrame>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bordered-highlight order-first p-4 sm:p-6 md:order-last">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Suggested package</p>
              <div className="mt-2 flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-bold">{pkg.name}</h2>
                <p className="text-2xl font-bold text-primary">£{pkg.price}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Up to {pkg.pages} pages · {pkg.delivery}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {rec.reasons.map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to={startHref(effective(input), rec.id)} onClick={() => rememberPreview(effective(input))} className="btn-primary btn-md min-h-[48px] gap-2 !text-background">
                  Start this project
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link to="/packages" className="btn-outline btn-md min-h-[48px]">
                  Compare packages
                </Link>
              </div>
            </div>

            <div className="bordered-section p-4 sm:p-6">
              <h2 className="mb-3 text-lg font-bold">Still to add</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {model.placeholders.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" aria-hidden="true" />
                    {p}
                  </li>
                ))}
                <li className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" aria-hidden="true" />
                  Reviews, accreditations, prices and opening times (only what you can back up)
                </li>
              </ul>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            The map is a live view from OpenStreetMap (© <a className="underline underline-offset-2" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors<span className="sr-only"> (opens in a new tab)</span></a>), looked up from the town and postcode you entered. Nothing else is sent anywhere.
          </p>
        </div>
      </section>
    </Layout>
  );
}
