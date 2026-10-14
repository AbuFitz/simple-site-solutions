import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase, CalendarCheck, Car, Check, Droplets, FileText, GraduationCap, HardHat, MapPin, Pencil, Phone, Scissors, Sparkles, Store, Zap, type LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { categories, categoryById } from "@/lib/preview/categories";
import { cleanName, cleanTown, inferCategory, normaliseUkPhone } from "@/lib/preview/generate";
import { embedUrl, lookupPlace, normalisePostcode, type Place } from "@/lib/preview/geo";
import { STEPS, STEP_TITLES, stepProblem, suggestedServices, validEmail, type StepId } from "@/lib/preview/wizard";
import type { ActionKind, CategoryId, PreviewInput } from "@/lib/preview/types";

const TRADE_ICONS: Record<CategoryId, LucideIcon> = { plumbing: Droplets, electrical: Zap, mechanic: Car, cleaning: Sparkles, barber: Scissors, tutoring: GraduationCap, shop: Store, builder: HardHat, other: Briefcase };

const ACTIONS: { id: ActionKind; label: string; text: string; icon: LucideIcon }[] = [
  { id: "call", label: "Phone calls", text: "A big call button on every page", icon: Phone },
  { id: "quote", label: "Quote requests", text: "An enquiry form for jobs and quotes", icon: FileText },
  { id: "book", label: "Bookings", text: "Customers book a time with you", icon: CalendarCheck },
  { id: "visit", label: "Visits", text: "Customers come to your shop or premises", icon: Store },
];

const label = "mb-1.5 block text-sm font-medium";
const hint = "mt-1.5 text-xs text-muted-foreground";
const errText = "mt-2 text-sm text-destructive";

interface WizardProps {
  input: PreviewInput;
  update: (patch: Partial<PreviewInput>) => void;
  categoryChosen: boolean;
  setCategoryChosen: (v: boolean) => void;
  step: StepId;
  goTo: (s: StepId) => void;
  onFinish: () => void;
}

/** A real map of what they typed, shown while they answer, so they can see it is right. */
function PlaceCheck({ town, postcode, pin, onUseTown }: { town: string; postcode: string; pin: boolean; onUseTown: (t: string) => void }) {
  const [state, setState] = useState<{ status: "idle" | "loading" | "found" | "missing"; place?: Place }>({ status: "idle" });
  useEffect(() => {
    const pc = normalisePostcode(postcode);
    if (!pc && town.trim().length < 3) {
      setState({ status: "idle" });
      return;
    }
    setState({ status: "loading" });
    let live = true;
    const id = setTimeout(() => {
      lookupPlace({ postcode: pc, town }).then((p) => live && setState(p ? { status: "found", place: p } : { status: "missing" }));
    }, 650);
    return () => {
      live = false;
      clearTimeout(id);
    };
  }, [town, postcode]);

  if (state.status === "idle") return null;
  const place = state.place;
  const suggest = place?.precise && place.town && place.town.toLowerCase() !== town.trim().toLowerCase() ? place.town : "";
  return (
    <div className="space-y-3" aria-live="polite">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-secondary sm:aspect-[2/1]">
        {state.status === "found" && place ? (
          <iframe title={`Map of ${normalisePostcode(postcode) || town}`} src={embedUrl(place, { pin })} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" className="absolute inset-0 h-full w-full border-0" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {state.status === "loading" ? "Finding it on the map…" : "We couldn't find that on the map. Check the spelling, or add a postcode."}
          </div>
        )}
      </div>
      {state.status === "found" && place && (
        <p className="flex items-start gap-2 text-sm">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            {place.precise ? `Found ${place.label ?? normalisePostcode(postcode)}. ${pin ? "Your map shows a pin here." : "Your map shows this area, with no pin."}` : `Found ${place.label ? place.label.split(",").slice(0, 3).join(",") : "it"}. Your map shows this area. Not the right place? Add a postcode.`}
          </span>
        </p>
      )}
      {suggest && (
        <button type="button" onClick={() => onUseTown(suggest)} className="btn-secondary btn-sm min-h-[44px]">
          Use {suggest} as my town
        </button>
      )}
    </div>
  );
}

export function Wizard({ input, update, categoryChosen, setCategoryChosen, step, goTo, onFinish }: WizardProps) {
  const uid = useId();
  const idx = STEPS.indexOf(step);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [tried, setTried] = useState(false);
  const [custom, setCustom] = useState("");
  const [areaText, setAreaText] = useState("");
  const [guess, setGuess] = useState<CategoryId | null>(null);
  const flags = { categoryChosen };
  const problem = tried ? stepProblem(step, input, flags) : null;
  const first = useRef(true);

  useEffect(() => {
    setTried(false);
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const next = () => goTo(STEPS[Math.min(STEPS.length - 1, idx + 1)]);
  const back = () => goTo(STEPS[Math.max(0, idx - 1)]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step === "review") {
      for (const s of STEPS) {
        if (s !== "review" && stepProblem(s, input, flags)) {
          goTo(s);
          setTried(true);
          return;
        }
      }
      onFinish();
      return;
    }
    if (stepProblem(step, input, flags)) {
      setTried(true);
      const el = document.querySelector<HTMLElement>(`[data-step-field="${step}"]`);
      el?.focus();
      return;
    }
    next();
  };

  const services = input.services;
  const suggestions = suggestedServices(input);
  const addArea = () => {
    const v = cleanTown(areaText);
    if (!v || input.areas.length >= 6 || input.areas.some((x) => x.toLowerCase() === v.toLowerCase())) return;
    update({ areas: [...input.areas, v], multiArea: true });
    setAreaText("");
  };
  const toggleService = (s: string) => {
    const has = services.includes(s);
    if (!has && services.length >= 6) return;
    update({ services: has ? services.filter((x) => x !== s) : [...services, s] });
  };
  const addCustom = () => {
    const v = custom.trim().slice(0, 40);
    if (!v || services.length >= 6 || services.some((x) => x.toLowerCase() === v.toLowerCase())) return;
    update({ services: [...services, v] });
    setCustom("");
  };

  const cat = categoryById(input.category);
  const summary: { id: StepId; title: string; value: string }[] = [
    { id: "name", title: "Business", value: cleanName(input.name) || "Not added" },
    { id: "trade", title: "Trade", value: categoryChosen ? cat.label : "Not chosen" },
    { id: "place", title: "Location", value: [input.town, normalisePostcode(input.postcode)].filter(Boolean).join(", ") || "Not added" },
    { id: "services", title: "Services", value: services.length ? services.join(", ") : "We'll use examples for your trade" },
    { id: "contact", title: "Contact", value: [normaliseUkPhone(input.phone)?.display, validEmail(input.email) ? input.email.trim() : ""].filter(Boolean).join(" · ") || "Not added" },
  ];

  return (
    <form onSubmit={submit} noValidate aria-labelledby={`${uid}-h`} className="relative">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Step {idx + 1} of {STEPS.length}: {STEP_TITLES[step]}
          </span>
          <span className="nums">{Math.round(((idx + 1) / STEPS.length) * 100)}%</span>
        </div>
        <Progress value={((idx + 1) / STEPS.length) * 100} aria-label="Preview setup progress" className="h-1.5" />
      </div>

      <>
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
          {step === "name" && (
            <div>
              <h2 id={`${uid}-h`} ref={headingRef} tabIndex={-1} className="text-2xl font-bold tracking-tight focus:outline-none sm:text-3xl">
                What's your business called?
              </h2>
              <p className="mt-2 text-muted-foreground">We'll put it on your sample website, exactly as you type it.</p>
              <div className="mt-6">
                <label htmlFor={`${uid}-name`} className={label}>
                  Business name
                </label>
                <input
                  id={`${uid}-name`}
                  data-step-field="name"
                  className="input-base text-base"
                  placeholder="e.g. Smith & Sons Plumbing"
                  maxLength={60}
                  autoComplete="organization"
                  value={input.name}
                  aria-invalid={Boolean(problem)}
                  aria-describedby={problem ? `${uid}-err` : undefined}
                  onChange={(e) => {
                    const v = e.target.value;
                    const g = inferCategory(v);
                    setGuess(g);
                    update({ name: v, ...(g && !categoryChosen ? { category: g, action: categoryById(g).defaultAction } : {}) });
                  }}
                />
                {guess && !categoryChosen && <p className={hint}>That sounds like {categoryById(guess).label.toLowerCase()}. You'll confirm that next.</p>}
              </div>
            </div>
          )}

          {step === "trade" && (
            <div>
              <h2 id={`${uid}-h`} ref={headingRef} tabIndex={-1} className="text-2xl font-bold tracking-tight focus:outline-none sm:text-3xl">
                What kind of business is it?
              </h2>
              <p className="mt-2 text-muted-foreground">Each trade gets its own design, photography and wording.</p>
              <div role="radiogroup" aria-label="Type of business" data-step-field="trade" tabIndex={-1} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map((c) => {
                  const Icon = TRADE_ICONS[c.id];
                  const on = categoryChosen && input.category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => {
                        setCategoryChosen(true);
                        update({ category: c.id, action: categoryById(c.id).defaultAction, seed: 0, services: [], pin: c.id === "shop" || c.id === "barber" });
                      }}
                      className={`flex min-h-[88px] flex-col items-start justify-between gap-3 rounded-xl border-2 p-3.5 text-left transition-colors ${on ? "border-primary bg-primary/10" : "border-border bg-card hover:border-muted-foreground/50"}`}
                    >
                      <Icon className={`h-6 w-6 ${on ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
                      <span className="text-sm font-semibold leading-tight">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === "place" && (
            <div>
              <h2 id={`${uid}-h`} ref={headingRef} tabIndex={-1} className="text-2xl font-bold tracking-tight focus:outline-none sm:text-3xl">
                Where do you work?
              </h2>
              <p className="mt-2 text-muted-foreground">Your website shows a real map. Add a postcode to put a pin on it.</p>
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor={`${uid}-town`} className={label}>
                    Town or area
                  </label>
                  <input id={`${uid}-town`} data-step-field="place" className="input-base text-base" placeholder="e.g. Watford" maxLength={40} autoComplete="address-level2" value={input.town} onChange={(e) => update({ town: e.target.value })} />
                </div>
                <div>
                  <label htmlFor={`${uid}-pc`} className={label}>
                    Postcode <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <input id={`${uid}-pc`} className="input-base text-base uppercase" placeholder="e.g. WD17 1AA" maxLength={9} autoComplete="postal-code" value={input.postcode} onChange={(e) => update({ postcode: e.target.value })} aria-describedby={`${uid}-pc-hint`} />
                  <p id={`${uid}-pc-hint`} className={hint}>
                    Your business address or a central postcode. Customers will see it on your site.
                  </p>
                </div>
                <PlaceCheck town={input.town} postcode={input.postcode} pin={input.pin} onUseTown={(t) => update({ town: t })} />
                {normalisePostcode(input.postcode) && (
                  <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm">
                    <input type="checkbox" className="mt-1 h-5 w-5 accent-[hsl(var(--primary))]" checked={input.pin} onChange={(e) => update({ pin: e.target.checked })} />
                    <span>
                      Put a pin on my premises
                      <span className="block text-xs text-muted-foreground">Leave this off if you work from home. We'll show the area instead, with no pin.</span>
                    </span>
                  </label>
                )}
                <div>
                  <label htmlFor={`${uid}-areas`} className={label}>
                    Other towns you cover <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      id={`${uid}-areas`}
                      className="input-base text-base"
                      placeholder="e.g. Bushey"
                      maxLength={40}
                      value={areaText}
                      onChange={(e) => setAreaText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && areaText.trim()) {
                          e.preventDefault();
                          addArea();
                        }
                      }}
                    />
                    <button type="button" onClick={addArea} disabled={!areaText.trim() || input.areas.length >= 6} className="btn-secondary btn-md min-h-[44px] shrink-0">
                      Add
                    </button>
                  </div>
                  {input.areas.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2" aria-label="Other towns you cover">
                      {input.areas.map((a) => (
                        <li key={a}>
                          <button type="button" onClick={() => update({ areas: input.areas.filter((x) => x !== a), multiArea: input.areas.length > 1 })} className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-card px-4 text-sm">
                            {a}
                            <span aria-hidden="true">×</span>
                            <span className="sr-only">Remove {a}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === "services" && (
            <div>
              <h2 id={`${uid}-h`} ref={headingRef} tabIndex={-1} className="text-2xl font-bold tracking-tight focus:outline-none sm:text-3xl">
                What do you offer?
              </h2>
              <p className="mt-2 text-muted-foreground">Tap to choose up to six, or add your own. Skip it and we'll use examples for your trade.</p>
              <div role="group" aria-label="Services" className="mt-6 flex flex-wrap gap-2">
                {[...suggestions, ...services.filter((s) => !suggestions.includes(s))].map((s) => {
                  const on = services.includes(s);
                  return (
                    <button key={s} type="button" aria-pressed={on} onClick={() => toggleService(s)} className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 px-4 text-sm font-medium transition-colors ${on ? "border-primary bg-primary/10" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>
                      {on && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
                      {s}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5">
                <label htmlFor={`${uid}-custom`} className={label}>
                  Add your own
                </label>
                <div className="flex gap-2">
                  <input
                    id={`${uid}-custom`}
                    className="input-base text-base"
                    placeholder="e.g. Emergency call-outs"
                    maxLength={40}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustom();
                      }
                    }}
                  />
                  <button type="button" onClick={addCustom} className="btn-secondary btn-md min-h-[44px] shrink-0" disabled={!custom.trim() || services.length >= 6}>
                    Add
                  </button>
                </div>
                <p className={hint}>{services.length} of 6 chosen.</p>
              </div>
            </div>
          )}

          {step === "contact" && (
            <div>
              <h2 id={`${uid}-h`} ref={headingRef} tabIndex={-1} className="text-2xl font-bold tracking-tight focus:outline-none sm:text-3xl">
                How should customers get in touch?
              </h2>
              <p className="mt-2 text-muted-foreground">Your main button and contact details are built around this.</p>
              <div role="radiogroup" aria-label="Main action" className="mt-6 grid gap-3 sm:grid-cols-2">
                {ACTIONS.map((a) => {
                  const on = input.action === a.id;
                  return (
                    <button key={a.id} type="button" role="radio" aria-checked={on} onClick={() => update({ action: a.id })} className={`flex min-h-[72px] items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-colors ${on ? "border-primary bg-primary/10" : "border-border bg-card hover:border-muted-foreground/50"}`}>
                      <a.icon className={`mt-0.5 h-5 w-5 shrink-0 ${on ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-semibold">{a.label}</span>
                        <span className="block text-xs text-muted-foreground">{a.text}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-phone`} className={label}>
                    Phone {input.action !== "call" && <span className="font-normal text-muted-foreground">(or email)</span>}
                  </label>
                  <input id={`${uid}-phone`} data-step-field="contact" type="tel" inputMode="tel" className="input-base text-base" placeholder="07123 456789" autoComplete="tel" value={input.phone} aria-invalid={Boolean(problem)} aria-describedby={problem ? `${uid}-err` : undefined} onChange={(e) => update({ phone: e.target.value })} />
                </div>
                <div>
                  <label htmlFor={`${uid}-email`} className={label}>
                    Email {input.action === "call" && <span className="font-normal text-muted-foreground">(optional)</span>}
                  </label>
                  <input id={`${uid}-email`} type="email" className="input-base text-base" placeholder="you@example.com" autoComplete="email" value={input.email} onChange={(e) => update({ email: e.target.value })} />
                </div>
              </div>
              <p className={hint}>These only appear on your preview, in your browser. Nothing is sent to us.</p>
            </div>
          )}

          {step === "review" && (
            <div>
              <h2 id={`${uid}-h`} ref={headingRef} tabIndex={-1} className="text-2xl font-bold tracking-tight focus:outline-none sm:text-3xl">
                Ready to build your preview
              </h2>
              <p className="mt-2 text-muted-foreground">Check your details. You can change anything now or later.</p>
              <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
                {summary.map((s) => (
                  <li key={s.id} className="flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.title}</p>
                      <p className="mt-0.5 break-words text-sm font-medium">{s.value}</p>
                    </div>
                    <button type="button" onClick={() => goTo(s.id)} className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 px-2 text-sm text-primary underline-offset-4 hover:underline">
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Change<span className="sr-only"> {s.title.toLowerCase()}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </>

      {problem && (
        <p id={`${uid}-err`} role="alert" className={errText}>
          {problem}
        </p>
      )}

      <div className="sticky bottom-0 z-20 -mx-4 mt-8 flex items-center gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        {idx > 0 && (
          <button type="button" onClick={back} className="btn-outline btn-md min-h-[48px] gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
        )}
        <button type="submit" className="btn-primary btn-lg min-h-[48px] flex-1 justify-center gap-2 !text-background sm:flex-none">
          {step === "review" ? "Show my preview" : step === "services" && services.length === 0 ? "Skip, use examples" : "Continue"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
