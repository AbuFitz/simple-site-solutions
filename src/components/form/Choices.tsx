import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Info } from "lucide-react";
import { sharedFeatures, type Addon, type PackageTier, hosting } from "@/data/packages";

/** Round tick used by single choice cards. */
function Radio({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors sm:h-5 sm:w-5 md:h-6 md:w-6 ${on ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
      {on && <Check className="h-3 w-3 text-primary-foreground" />}
    </span>
  );
}

function Price({ pkg }: { pkg: PackageTier }) {
  if (pkg.price === null) return <span className="text-xs font-bold text-primary sm:text-base">{pkg.priceLabel}</span>;
  return (
    <span className="flex items-baseline gap-2 whitespace-nowrap">
      {pkg.was && (
        <span className="hidden text-xs text-muted-foreground line-through min-[400px]:inline sm:text-sm">
          <span className="sr-only">Previously </span>£{pkg.was}
        </span>
      )}
      <span className="text-base font-bold text-primary sm:text-lg md:text-xl">£{pkg.price}</span>
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
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{fixed ? `${pkg.name} includes` : "Examples"}</p>
        <List items={pkg.features} />
        {pkg.note && <p className="mt-2 text-sm text-muted-foreground">{pkg.note}</p>}
      </div>
      {fixed && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">Included with both packages</p>
          <List items={sharedFeatures} />
        </div>
      )}
      <dl className="grid gap-x-6 gap-y-2 pt-1 text-sm sm:grid-cols-[auto_1fr]">
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

/** A selectable package with its own "What is included" dropdown. Same single-row size as before; the dropdown is a separate button so it never selects the card. */
export function PackageChoice({ pkg, selected, onSelect }: { pkg: PackageTier; selected: boolean; onSelect: () => void }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className={`rounded-lg border-2 bg-card transition-colors sm:rounded-xl ${selected ? "border-primary" : "border-border hover:border-muted-foreground/50"}`}>
      <div className="flex items-stretch">
        <button type="button" role="radio" aria-checked={selected} onClick={onSelect} className="flex min-h-[44px] min-w-0 flex-1 items-center justify-between gap-2 rounded-l-[inherit] p-3 text-left sm:gap-3 sm:p-4 md:p-5">
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-bold sm:text-base md:text-lg">{pkg.name}</span>
              {pkg.recommended && <span className="rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary sm:px-2 sm:text-[10px]">Recommended</span>}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Price pkg={pkg} />
            <Radio on={selected} />
          </span>
        </button>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`What is included in ${pkg.name}`}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[44px] shrink-0 items-center gap-1 rounded-r-[inherit] pl-2 pr-3 text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline sm:pr-4 sm:text-sm"
        >
          <span className="hidden min-[400px]:inline">{open ? "Hide" : "Included"}</span>
          <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      <div id={panelId} hidden={!open} className="px-3 pb-4 pt-1 sm:px-4 md:px-5">
        <PackageDetails pkg={pkg} />
      </div>
    </div>
  );
}

/**
 * A selectable add-on, the same compact box as before. The (i) in the corner opens a small speech bubble above the card:
 * on hover or keyboard focus with a mouse, on tap with a finger. The card itself never changes size.
 * `side` is which edge of the card the bubble lines up with, so it never runs off the screen in a two-column grid.
 */
export function AddonChoice({ addon, selected, onToggle, side = "right" }: { addon: Addon; selected: boolean; onToggle: () => void; side?: "left" | "right" }) {
  const [tap, setTap] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const textId = useId();
  const show = tap || hover || focus;

  // A tap opens it; a tap anywhere else, or Escape, closes it.
  useEffect(() => {
    if (!tap) return;
    const off = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !wrap.current?.contains(e.target as Node)) setTap(false);
    };
    document.addEventListener("pointerdown", off);
    document.addEventListener("keydown", off);
    return () => {
      document.removeEventListener("pointerdown", off);
      document.removeEventListener("keydown", off);
    };
  }, [tap]);

  return (
    <div ref={wrap} className={`relative rounded-lg border-2 bg-card transition-colors sm:rounded-xl ${show ? "z-20" : "z-0"} ${selected ? "border-primary" : "border-border hover:border-muted-foreground/50"}`}>
      <button type="button" aria-pressed={selected} onClick={onToggle} className="block min-h-[44px] w-full rounded-[inherit] p-3 pb-9 text-left sm:p-4 sm:pb-10">
        <span className="flex items-start justify-between">
          <span className="text-xs font-semibold leading-tight sm:text-sm">{addon.name}</span>
          <span aria-hidden="true" className={`ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border-2 transition-colors sm:h-5 sm:w-5 ${selected ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
            {selected && <Check className="h-2.5 w-2.5 text-primary-foreground sm:h-3 sm:w-3" />}
          </span>
        </span>
        <span className="mt-1 block text-xs font-medium text-primary">£{addon.price}</span>
      </button>
      <button
        type="button"
        aria-label={`About ${addon.name}`}
        aria-describedby={textId}
        aria-expanded={show}
        onClick={() => setTap((v) => !v)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
      >
        <Info aria-hidden="true" className="h-[18px] w-[18px]" />
      </button>
      <div
        id={textId}
        role="tooltip"
        className={`pointer-events-none absolute bottom-[calc(100%+12px)] ${side === "left" ? "left-0" : "right-0"} w-[min(280px,calc(100vw-40px))] rounded-xl bg-foreground p-3 text-left text-sm font-normal leading-snug text-background shadow-xl transition-all duration-150 ${show ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"}`}
      >
        {addon.explain}
      </div>
      <span aria-hidden="true" className={`pointer-events-none absolute bottom-[calc(100%+6px)] right-[14px] h-3 w-3 rotate-45 rounded-[2px] bg-foreground transition-opacity duration-150 ${show ? "opacity-100" : "opacity-0"}`} />
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
        <button type="button" role="radio" aria-checked={on} onClick={() => onChange("hosting-care")} className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-t-[inherit] p-3 text-left sm:p-4 md:p-5">
          <span className="min-w-0">
            <span className="block text-sm font-bold sm:text-base md:text-lg">{hosting.name}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">Month to month. Cancel with 30 days' notice.</span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="whitespace-nowrap text-base font-bold text-primary sm:text-lg md:text-xl">£{hosting.price}<span className="text-xs font-medium text-muted-foreground">/month</span></span>
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
      <button type="button" role="radio" aria-checked={off} onClick={() => onChange("none")} className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg border-2 bg-card p-3 text-left transition-colors sm:rounded-xl sm:p-4 md:p-5 ${off ? "border-primary" : "border-border hover:border-muted-foreground/50"}`}>
        <span className="min-w-0">
          <span className="block text-sm font-bold sm:text-base md:text-lg">No monthly plan for now</span>
          <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">You can add one later.</span>
        </span>
        <Radio on={off} />
      </button>
    </div>
  );
}
