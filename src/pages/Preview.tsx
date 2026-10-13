import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Monitor, RefreshCw, Smartphone } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { DeviceFrame } from "@/components/preview/DeviceFrame";
import { SitePreview } from "@/components/preview/SitePreview";
import { categories, categoryById } from "@/lib/preview/categories";
import {
  buildPreview,
  decodeInput,
  encodeInput,
  inferCategory,
  normaliseUkPhone,
  recommendPackage,
  rememberPreview,
  startHref,
} from "@/lib/preview/generate";
import type { ActionKind, CategoryId, PreviewInput } from "@/lib/preview/types";
import { packages } from "@/data/packages";

const ACTIONS: { id: ActionKind; label: string }[] = [
  { id: "call", label: "Call" },
  { id: "quote", label: "Get a quote" },
  { id: "book", label: "Book" },
  { id: "visit", label: "Visit" },
];

const splitServices = (t: string) =>
  t
    .split(/[,\n|]/)
    .map((s) => s.trim().slice(0, 40))
    .filter(Boolean)
    .slice(0, 6);

const label = "mb-1.5 block text-sm font-medium";
const hint = "mt-1.5 text-xs text-muted-foreground";

export default function Preview() {
  const initial = useMemo(() => decodeInput(typeof window === "undefined" ? "" : window.location.search), []);
  const [input, setInput] = useState<PreviewInput>(initial);
  const [servicesText, setServicesText] = useState(initial.services.join(", "));
  const [categoryTouched, setCategoryTouched] = useState(Boolean(new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get("c")));
  const [actionTouched, setActionTouched] = useState(false);
  const [device, setDevice] = useState<"desktop" | "phone">(() => (typeof window !== "undefined" && window.innerWidth < 768 ? "phone" : "desktop"));
  const [copied, setCopied] = useState(false);
  const [suggested, setSuggested] = useState<CategoryId | null>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  const update = (patch: Partial<PreviewInput>) => setInput((i) => ({ ...i, ...patch }));

  const onName = (name: string) => {
    const guess = inferCategory(name);
    setSuggested(guess);
    setInput((i) => {
      if (!categoryTouched && guess && guess !== i.category) {
        return { ...i, name, category: guess, action: actionTouched ? i.action : categoryById(guess).defaultAction, seed: 0 };
      }
      return { ...i, name };
    });
  };

  const onCategory = (id: CategoryId) => {
    setCategoryTouched(true);
    setInput((i) => ({ ...i, category: id, action: actionTouched ? i.action : categoryById(id).defaultAction, seed: 0 }));
  };

  const onServices = (text: string) => {
    setServicesText(text);
    update({ services: splitServices(text) });
  };

  // Keep the address bar shareable without adding history entries
  const deferred = useDeferredValue(input);
  useEffect(() => {
    const t = window.setTimeout(() => {
      const qs = encodeInput(deferred);
      window.history.replaceState(null, "", `${window.location.pathname}?${qs}`);
    }, 350);
    return () => window.clearTimeout(t);
  }, [deferred]);

  const model = useMemo(() => buildPreview(deferred), [deferred]);
  const rec = useMemo(() => recommendPackage(deferred), [deferred]);
  const pkg = packages.find((p) => p.id === rec.id)!;
  const phoneProblem = input.phone.trim() !== "" && !normaliseUkPhone(input.phone);
  const emailProblem = input.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim());

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/preview?${encodeInput(input)}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>See What Your Website Could Look Like | OneSimpleSite</title>
        <meta
          name="description"
          content="Enter your business name and trade and see a preview of your website, built on a layout that already works in your industry. Nothing is sent or stored."
        />
        <link rel="canonical" href="https://onesimplesite.co.uk/preview" />
      </Helmet>

      <section className="relative pb-6 pt-24 sm:pt-32 md:pt-36">
        <DottedGrid className="opacity-30" spacing={36} />
        <div className="content-width relative z-10">
          <span className="badge-primary mb-3 inline-block text-[9px] sm:text-xs">Website preview</span>
          <h1 className="text-headline max-w-3xl">
            See what your website <span className="text-primary">could look like</span>
          </h1>
          <p className="text-body-lg mt-4 max-w-2xl">
            Add a few details and we will build a preview on the layout that already works for your trade. Nothing is sent or stored; your details stay in your browser.
          </p>
        </div>
      </section>

      <section className="pb-16 pt-6 sm:pb-24">
        <div className="content-width grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Form */}
          <form id="pv-form" className="bordered-section order-2 h-fit scroll-mt-24 space-y-5 p-4 sm:p-6 lg:order-none lg:col-span-4 lg:sticky lg:top-28" onSubmit={(e) => e.preventDefault()} aria-label="Your business details" noValidate>
            <div>
              <label htmlFor="pv-name" className={label}>
                Business name
              </label>
              <input id="pv-name" className="input-base" placeholder="e.g. Smith & Sons Plumbing" maxLength={60} autoComplete="organization" value={input.name} onChange={(e) => onName(e.target.value)} />
            </div>

            <div>
              <label htmlFor="pv-cat" className={label}>
                Type of business
              </label>
              <select id="pv-cat" className="input-base" value={input.category} onChange={(e) => onCategory(e.target.value as CategoryId)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              {suggested && !categoryTouched && <p className={hint}>Picked from your name. Change it if that is not right.</p>}
            </div>

            <div>
              <label htmlFor="pv-town" className={label}>
                Town or area
              </label>
              <input id="pv-town" className="input-base" placeholder="e.g. Watford" maxLength={40} autoComplete="address-level2" value={input.town} onChange={(e) => update({ town: e.target.value })} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <label htmlFor="pv-phone" className={label}>
                  Phone <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <input id="pv-phone" type="tel" className="input-base" placeholder="07123 456789" autoComplete="tel" aria-invalid={phoneProblem} aria-describedby={phoneProblem ? "pv-phone-err" : undefined} value={input.phone} onChange={(e) => update({ phone: e.target.value })} />
                {phoneProblem && (
                  <p id="pv-phone-err" className="mt-1.5 text-xs text-destructive">
                    Enter a UK number, like 07123 456789 or 01923 456789.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="pv-email" className={label}>
                  Email <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <input id="pv-email" type="email" className="input-base" placeholder="you@example.com" autoComplete="email" aria-invalid={emailProblem} aria-describedby={emailProblem ? "pv-email-err" : undefined} value={input.email} onChange={(e) => update({ email: e.target.value })} />
                {emailProblem && (
                  <p id="pv-email-err" className="mt-1.5 text-xs text-destructive">
                    That email address does not look right.
                  </p>
                )}
              </div>
            </div>

            <fieldset>
              <legend className={label}>What should visitors do first?</legend>
              <div className="grid grid-cols-2 gap-2">
                {ACTIONS.map((a) => (
                  <label
                    key={a.id}
                    className={`flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border px-3 text-sm font-medium transition-colors focus-within:ring-2 focus-within:ring-primary/50 ${
                      input.action === a.id ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pv-action"
                      value={a.id}
                      checked={input.action === a.id}
                      onChange={() => {
                        setActionTouched(true);
                        update({ action: a.id });
                      }}
                      className="sr-only"
                    />
                    {a.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="pv-services" className={label}>
                Your main services <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea id="pv-services" rows={3} className="input-base resize-none" placeholder="Boiler repairs, Bathrooms, Leaks" value={servicesText} onChange={(e) => onServices(e.target.value)} aria-describedby="pv-services-hint" />
              <p id="pv-services-hint" className={hint}>
                Separate with commas, up to six. Leave blank to see example services for your trade.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" checked={input.multiArea} onChange={(e) => update({ multiArea: e.target.checked })} />
              <span>
                We cover more than one town
                <span className="block text-xs text-muted-foreground">This changes the package we suggest.</span>
              </span>
            </label>

            <a href="#pv-stage" className="btn-primary btn-md w-full justify-center !text-background lg:hidden">
              See the preview
            </a>
          </form>

          {/* Stage */}
          <div id="pv-stage" className="order-1 min-w-0 scroll-mt-24 space-y-5 lg:order-none lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div role="tablist" aria-label="Preview size" className="inline-flex rounded-full border border-border bg-secondary p-1">
                {([
                  ["desktop", "Desktop", Monitor],
                  ["phone", "Phone", Smartphone],
                ] as const).map(([id, text, Icon]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={device === id}
                    onClick={() => setDevice(id)}
                    className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${device === id ? "bg-primary !text-background" : "text-foreground/80 hover:text-foreground"}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {text}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-secondary btn-sm gap-2" onClick={() => update({ seed: input.seed + 1 })}>
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Try another style
                </button>
                <button type="button" className="btn-secondary btn-sm gap-2" onClick={copyLink}>
                  {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                  {copied ? "Link copied" : "Copy link"}
                </button>
              </div>
            </div>
            <a href="#pv-form" className="btn-secondary btn-sm w-full justify-center lg:hidden">
              Edit your details
            </a>
            <p ref={statusRef} role="status" className="sr-only">
              {copied ? "Link copied to clipboard" : `Preview updated for ${model.name}`}
            </p>

            <motion.div key={device} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <DeviceFrame device={device} domain={`${(model.name === "Your Business Name" ? "yourbusiness" : model.name.toLowerCase().replace(/[^a-z0-9]+/g, "")) || "yourbusiness"}.co.uk`}>
                <SitePreview model={model} compact={device === "phone"} />
              </DeviceFrame>
            </motion.div>

            <p className="text-xs text-muted-foreground">
              This is a preview with sample wording. Your real site uses your own details, photos and text, and the address shown is an example.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="bordered-section p-4 sm:p-6">
                <h2 className="mb-3 text-lg font-bold">Still to add</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {model.placeholders.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bordered-highlight p-4 sm:p-6">
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
                  <Link to={startHref(input, rec.id)} onClick={() => rememberPreview(input)} className="btn-primary btn-md gap-2 !text-background">
                    Start this project
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link to="/packages" className="btn-outline btn-md">
                    Compare packages
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
