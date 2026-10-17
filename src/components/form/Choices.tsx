import { useId, useState } from "react";
import { Check, ChevronDown, Info } from "lucide-react";
import { sharedFeatures, type Addon, type PackageTier, hosting } from "@/data/packages";

/** Round tick used by single choice cards. */
function Radio({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors sm:h-6 sm:w-6 ${on ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
      {on && <Check className="h-3 w-3 text-primary-foreground" />}
    </span>
  );
}

function Price({ pkg }: { pkg: PackageTier }) {
  if (pkg.price === null) return <span className="text-sm font-bold text-primary sm:text-base">{pkg.priceLabel}</span>;
  return (
    <span className="flex items-baseline gap-2 whitespace-nowrap">
      {pkg.was && (
        <span className="text-xs text-muted-foreground line-through sm:text-sm">
          <span className="sr-only">Previously </span>£{pkg.was}
        </span>
      )}
      <span className="text-lg font-bold text-primary sm:text-xl">£{pkg.price}</span>
    </span>
  );
}

function List({ items }: { items: { title: string; text?: string }[] }) {
  return (
    <ul className="space-y-2">
      {items.map((f) => (
        <li key={f.title} className="flex gap-2 text-sm leading-snug">
          <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="font-medium">{f.title}.</span>
            {f.text && <span className="text-muted-foreground"> {f.text}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** What a package includes. Shown inside the dropdown on the form. */
export function PackageDetails({ pkg }: { pkg: PackageTier }) {
  const fixed = pkg.id !== "enterprise";
  return (
    <div className="space-y-4 text-left">
      <p className="text-sm text-muted-foreground">{pkg.tagline}</p>
      <p className="text-sm">
        <span className="font-medium">Best suited to: </span>
        <span className="text-muted-foreground">{pkg.ideal}</span>
      </p>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{fixed ? `In ${pkg.name}` : "Typical scope"}</p>
        <List items={pkg.features} />
        {pkg.note && <p className="mt-2 text-sm text-muted-foreground">{pkg.note}</p>}
      </div>
      {fixed && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">Included with every fixed package</p>
          <List items={sharedFeatures} />
        </div>
      )}
      <dl className="grid gap-x-6 gap-y-2 border-t border-border pt-3 text-sm sm:grid-cols-[auto_1fr]">
        {pkg.revisions && (
          <>
            <dt className="text-muted-foreground">Revisions</dt>
            <dd>{pkg.revisions}</dd>
          </>
        )}
        {pkg.delivery && (
          <>
            <dt className="text-muted-foreground">Delivery</dt>
            <dd>Estimated {pkg.delivery}</dd>
          </>
        )}
        <dt className="text-muted-foreground">Payment</dt>
        <dd>{pkg.paymentText}</dd>
      </dl>
    </div>
  );
}

/** A selectable package with its own "What's included" dropdown. The dropdown is a separate button so it never selects the card. */
export function PackageChoice({ pkg, selected, onSelect }: { pkg: PackageTier; selected: boolean; onSelect: () => void }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className={`rounded-lg border-2 bg-card transition-colors sm:rounded-xl ${selected ? "border-primary" : "border-border hover:border-muted-foreground/50"}`}>
      <button type="button" role="radio" aria-checked={selected} onClick={onSelect} className="flex min-h-[56px] w-full items-center justify-between gap-3 rounded-t-[inherit] p-3 text-left sm:p-4 md:p-5">
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold md:text-lg">{pkg.name}</span>
            {pkg.recommended && <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Recommended</span>}
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">{pkg.id === "enterprise" ? "Bespoke scope" : `Up to ${pkg.pages} pages · ${pkg.delivery}`}</span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <Price pkg={pkg} />
          <Radio on={selected} />
        </span>
      </button>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[44px] w-full items-center justify-between border-t border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground sm:px-4 md:px-5"
      >
        <span>{open ? "Hide what is included" : "What is included"}</span>
        <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={panelId} hidden={!open} className="border-t border-border px-3 pb-4 pt-3 sm:px-4 md:px-5">
        <PackageDetails pkg={pkg} />
      </div>
    </div>
  );
}

/** A selectable add-on with a short explainer: shown when it is picked, and on hover, focus or tap of the info control. */
export function AddonChoice({ addon, selected, onToggle }: { addon: Addon; selected: boolean; onToggle: () => void }) {
  const [tip, setTip] = useState(false);
  const [hover, setHover] = useState(false);
  const textId = useId();
  const show = selected || tip || hover;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`rounded-lg border-2 bg-card transition-colors sm:rounded-xl ${selected ? "border-primary" : "border-border hover:border-muted-foreground/50"}`}
    >
      <div className="flex items-stretch">
        <button type="button" aria-pressed={selected} aria-describedby={textId} onClick={onToggle} className="flex min-h-[56px] flex-1 items-center justify-between gap-3 rounded-l-[inherit] p-3 text-left sm:p-4">
          <span className="min-w-0">
            <span className="block text-sm font-semibold leading-tight">{addon.name}</span>
            <span className="mt-0.5 block text-sm font-medium text-primary">£{addon.price}</span>
          </span>
          <span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${selected ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
            {selected && <Check className="h-3 w-3 text-primary-foreground" />}
          </span>
        </button>
        <button
          type="button"
          aria-expanded={tip}
          aria-label={`About ${addon.name}`}
          onClick={() => setTip((v) => !v)}
          className="flex min-h-[44px] w-12 shrink-0 items-center justify-center rounded-r-[inherit] border-l border-border text-muted-foreground transition-colors hover:text-foreground"
        >
          <Info aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      <p id={textId} className={show ? "border-t border-border px-3 py-2.5 text-sm text-muted-foreground sm:px-4" : "sr-only"}>
        {addon.explain}
      </p>
    </div>
  );
}

/** The monthly rolling plan card: a choice with the full list of what it covers. */
export function MonthlyChoice({ value, onChange }: { value: string | null; onChange: (v: "hosting-care" | "none") => void }) {
  const on = value === hosting.id;
  const off = value === "none";
  return (
    <div role="radiogroup" aria-label="Monthly plan" className="space-y-3">
      <div className={`rounded-lg border-2 bg-card transition-colors sm:rounded-xl ${on ? "border-primary" : "border-border hover:border-muted-foreground/50"}`}>
        <button type="button" role="radio" aria-checked={on} onClick={() => onChange("hosting-care")} className="flex min-h-[56px] w-full items-center justify-between gap-3 rounded-t-[inherit] p-3 text-left sm:p-4 md:p-5">
          <span className="min-w-0">
            <span className="block text-base font-bold md:text-lg">{hosting.name}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">Monthly, rolling. Cancel with 30 days' notice.</span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="whitespace-nowrap text-lg font-bold text-primary sm:text-xl">£{hosting.price}<span className="text-xs font-medium text-muted-foreground">/month</span></span>
            <Radio on={on} />
          </span>
        </button>
        <ul className="space-y-2 border-t border-border px-3 py-3 sm:px-4 md:px-5">
          {hosting.features.map((f) => (
            <li key={f} className="flex gap-2 text-sm leading-snug">
              <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <button type="button" role="radio" aria-checked={off} onClick={() => onChange("none")} className={`flex min-h-[56px] w-full items-center justify-between gap-3 rounded-lg border-2 bg-card p-3 text-left transition-colors sm:rounded-xl sm:p-4 md:p-5 ${off ? "border-primary" : "border-border hover:border-muted-foreground/50"}`}>
        <span className="min-w-0">
          <span className="block text-base font-bold md:text-lg">No monthly plan for now</span>
          <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">You can add a monthly plan later.</span>
        </span>
        <Radio on={off} />
      </button>
    </div>
  );
}
