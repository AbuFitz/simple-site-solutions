import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import type { PreviewModel, ResolvedPalette } from "@/lib/preview/types";
import { embedUrl, lookupPlace, normalisePostcode, type Place } from "@/lib/preview/geo";

/**
 * Shared building blocks for the trade templates. Colours come from the model's palette so every template
 * works in all of its palettes. The templates are written to look like finished small-business websites:
 * the preview page itself lists what is still sample (photos, wording, details), so nothing inside the
 * mock-up is decorated with "placeholder" labels, and nothing here states a fact about the customer
 * (no reviews, accreditations, prices, opening hours or statistics).
 */

export interface TProps {
  model: PreviewModel;
  /** Phone composition (the design is laid out at a fixed width, see DeviceFrame). */
  compact: boolean;
}

/** Understated stand-in text for details we don't have yet. The preview page explains what is still to add. */
export function Soft({ p, children, onDark = false }: { p: ResolvedPalette; children: ReactNode; onDark?: boolean }) {
  return <span style={{ color: onDark ? `${p.bg}d9` : p.muted, fontStyle: "italic" }}>{children}</span>;
}

export interface Look {
  head: string;
  body: string;
  headWeight?: number;
  headTracking?: string;
  headCase?: "uppercase" | "none";
  /** Corner radii in px. */
  btn?: number;
  card?: number;
}

export function tokens(model: PreviewModel, compact: boolean, look: Look) {
  const p = model.palette;
  const c = <A, B>(a: A, b: B) => (compact ? a : b);
  const head: CSSProperties = {
    fontFamily: look.head,
    fontWeight: look.headWeight ?? 700,
    letterSpacing: look.headTracking ?? "-0.02em",
    textTransform: look.headCase ?? "none",
  };
  return {
    p,
    c,
    head,
    pad: compact ? "px-5" : "px-14",
    y: compact ? "py-10" : "py-[4.5rem]",
    rBtn: look.btn ?? 8,
    rCard: look.card ?? 10,
    root: { background: p.bg, color: p.ink, fontFamily: look.body } as CSSProperties,
  };
}

export type Tokens = ReturnType<typeof tokens>;

export function Btn({ model, children, kind = "solid", radius = 8, style }: { model: PreviewModel; children: ReactNode; kind?: "solid" | "ghost" | "ink" | "light"; radius?: number; style?: CSSProperties }) {
  const p = model.palette;
  const base: CSSProperties =
    kind === "solid" ? { background: p.accent, color: p.accentInk } : kind === "ink" ? { background: p.ink, color: p.bg } : kind === "light" ? { background: p.bg, color: p.ink } : { boxShadow: `inset 0 0 0 1.5px currentColor` };
  return (
    <a href={model.cta.href} onClick={(e) => e.preventDefault()} tabIndex={-1} className="inline-flex items-center gap-2 whitespace-nowrap px-6 py-3 text-[0.95rem] font-semibold" style={{ borderRadius: radius, ...base, ...style }}>
      {children}
    </a>
  );
}

export function Logo({ model, size = 40, radius = 8, font }: { model: PreviewModel; size?: number; radius?: number; font?: string }) {
  const p = model.palette;
  return (
    <span className="flex shrink-0 items-center justify-center font-bold" style={{ width: size, height: size, borderRadius: radius, background: p.accent, color: p.accentInk, fontFamily: font, fontSize: size * 0.4 }} aria-hidden="true">
      {model.monogram}
    </span>
  );
}

/** Bar across the top of trade sites: phone first, because that is how most local customers get in touch. */
export function TopBar({ model, compact, pad, dark = false }: { model: PreviewModel; compact: boolean; pad: string; dark?: boolean }) {
  const p = model.palette;
  return (
    <div className={`flex items-center justify-between gap-3 py-2 text-[0.8rem] font-semibold ${pad}`} style={dark ? { background: p.ink, color: p.bg } : { background: p.accent, color: p.accentInk }}>
      <span className="flex items-center gap-2">
        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
        {model.contact.phone ?? "Call us today"}
      </span>
      {!compact && <span>{model.contact.town ? `Serving ${model.contact.town} and the surrounding area` : "Serving your local area"}</span>}
    </div>
  );
}

export function Header({
  model,
  compact,
  pad,
  head,
  name = true,
  radius = 8,
  logoFont,
  tone = "light",
  action = true,
  upper = false,
}: {
  model: PreviewModel;
  compact: boolean;
  pad: string;
  head: CSSProperties;
  name?: boolean;
  radius?: number;
  logoFont?: string;
  tone?: "light" | "dark" | "transparent";
  action?: boolean;
  upper?: boolean;
}) {
  const p = model.palette;
  const bg = tone === "dark" ? p.ink : tone === "transparent" ? "transparent" : p.bg;
  const fg = tone === "dark" ? p.bg : p.ink;
  const sub = tone === "dark" ? `${p.bg}b3` : p.muted;
  return (
    <header className={`flex items-center justify-between gap-4 py-4 ${pad}`} style={{ background: bg, color: fg, borderBottom: tone === "light" ? `1px solid ${p.ink}14` : undefined }}>
      <div className="flex min-w-0 items-center gap-3">
        <Logo model={model} radius={radius} font={logoFont} />
        {name && (
          <span className="truncate text-[1.15rem]" style={{ ...head, color: fg }}>
            {model.name}
          </span>
        )}
      </div>
      {!compact && (
        <nav className={`flex items-center gap-7 text-[0.92rem] font-medium ${upper ? "uppercase tracking-wider" : ""}`} style={{ color: sub }} aria-label="Preview navigation">
          {model.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </nav>
      )}
      {!compact && action ? (
        <Btn model={model} radius={radius}>
          {model.cta.label}
        </Btn>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center" aria-hidden="true">
          <span className="block h-0.5 w-5" style={{ background: fg, boxShadow: `0 6px 0 ${fg}, 0 -6px 0 ${fg}` }} />
        </span>
      )}
    </header>
  );
}

/** Service cards: an index, a title and a line of explanation, with a coloured rule on top. */
export function ServiceCards({ model, compact, head, radius = 10, cols = 3, count = 3, from = 0 }: { model: PreviewModel; compact: boolean; head: CSSProperties; radius?: number; cols?: number; count?: number; from?: number }) {
  const p = model.palette;
  return (
    <ul className={`grid gap-5 ${compact ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
      {model.services.slice(from, from + count).map((s, i) => (
        <li key={s.title + i} className="p-6" style={{ borderRadius: radius, background: p.surface, boxShadow: `inset 0 3px 0 ${p.accent}, inset 0 0 0 1px ${p.ink}12` }}>
          <span className="text-[0.85rem] font-bold tabular-nums" style={{ color: p.accentText }}>
            {String(from + i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-[1.2rem] leading-snug" style={head}>
            {s.title}
          </h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ color: p.muted }}>
            {s.blurb}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Towns covered, written out as a plain list. */
export function AreasList({ model, head, fallback }: { model: PreviewModel; head: CSSProperties; fallback?: string }) {
  const towns = [model.contact.town, ...model.areas].filter(Boolean) as string[];
  const p = model.palette;
  if (!towns.length) return <p className="text-[1rem]" style={{ color: p.muted }}>{fallback ?? "Your town and the surrounding area"}</p>;
  return (
    <p className="text-[1.15rem] leading-relaxed" style={head}>
      {towns.join("  ·  ")}
      {towns.length === 1 ? " and the surrounding area" : ""}
    </p>
  );
}

/** Plain two-column list of the remaining services, separated by thin rules. */
export function ServiceRows({ model, compact, head, from = 0, cols = 2 }: { model: PreviewModel; compact: boolean; head: CSSProperties; from?: number; cols?: number }) {
  const p = model.palette;
  const list = model.services.slice(from);
  if (!list.length) return null;
  return (
    <ul className={`grid gap-x-10 ${compact || cols === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
      {list.map((s, i) => (
        <li key={s.title + i} className="py-4" style={{ borderTop: `1px solid ${p.ink}22` }}>
          <h3 className="text-[1.05rem]" style={head}>
            {s.title}
          </h3>
          <p className="mt-1 text-[0.93rem] leading-relaxed" style={{ color: p.muted }}>
            {s.blurb}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function Steps({ model, compact, head, style = "cols" }: { model: PreviewModel; compact: boolean; head: CSSProperties; style?: "cols" | "rows" }) {
  const p = model.palette;
  return (
    <ol className={`grid gap-8 ${compact || style === "rows" ? "grid-cols-1" : "grid-cols-3"}`}>
      {model.steps.map((s, i) => (
        <li key={s.title} className={style === "rows" || compact ? "flex items-start gap-5" : ""}>
          <span className={`block shrink-0 leading-none ${style === "rows" || compact ? "w-10 text-[1.9rem]" : "mb-3 text-[2.2rem]"}`} style={{ ...head, color: p.accentText }}>
            {i + 1}
          </span>
          <div>
            <h3 className="text-[1.1rem]" style={head}>
              {s.title}
            </h3>
            <p className="mt-1 text-[0.95rem] leading-relaxed" style={{ color: p.muted }}>
              {s.blurb}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Real map of the customer's area ---------- */

export function usePlace(town: string, postcode: string): Place | null | undefined {
  const [place, setPlace] = useState<Place | null | undefined>(undefined);
  useEffect(() => {
    if (!normalisePostcode(postcode) && town.trim().length < 3) {
      setPlace(null);
      return;
    }
    setPlace(undefined);
    let live = true;
    const id = setTimeout(() => {
      lookupPlace({ postcode, town }).then((l) => live && setPlace(l));
    }, 600);
    return () => {
      live = false;
      clearTimeout(id);
    };
  }, [town, postcode]);
  return place;
}

/**
 * A real OpenStreetMap view (never a drawn map). A valid postcode with "pin" on puts a marker on the map; a town
 * or a postcode without a pin shows the area. Without a location, or if the lookup fails, it says so plainly
 * instead of showing a made-up map. The map is a still view (no scroll capture inside the page frame).
 */
export function AreaMap({ model, className = "", style }: { model: PreviewModel; className?: string; style?: CSSProperties }) {
  const p = model.palette;
  const town = model.contact.town ?? "";
  const postcode = model.contact.postcode ?? "";
  const pin = model.contact.pin;
  const place = usePlace(town, postcode);
  const where = pin && postcode ? postcode : town || postcode;
  // The map only takes the mouse or touch once it has been tapped, so scrolling the page never gets stuck on it.
  const [active, setActive] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: p.surface, boxShadow: `inset 0 0 0 1px ${p.ink}1f`, ...style }} onMouseLeave={() => setActive(false)}>
      {place ? (
        <>
          <iframe title={`Map of ${where}`} src={embedUrl(place, { pin })} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" tabIndex={-1} className={`absolute inset-0 h-full w-full border-0 ${active ? "" : "pointer-events-none"}`} />
          {!active && (
            <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setActive(true)} className="absolute inset-0 z-10 cursor-pointer">
              <span className="absolute left-2 top-2 rounded px-2.5 py-1 text-[0.72rem] font-semibold shadow" style={{ background: p.bg, color: p.ink }}>
                Tap to explore the map
              </span>
            </button>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center" style={{ color: p.muted }}>
          <MapPin className="h-6 w-6" aria-hidden="true" />
          <span className="text-[0.9rem]">{where && place === undefined ? `Loading the map of ${where}…` : where ? "The map couldn't be loaded." : "Add your town and your area map appears here."}</span>
        </div>
      )}
    </div>
  );
}

/** Enquiry form drawn as the page would show it (not interactive in the preview). */
export function EnquiryForm({ model, title, fields, button, radius = 10, head }: { model: PreviewModel; title: string; fields: { label: string; wide?: boolean; tall?: boolean }[]; button?: string; radius?: number; head: CSSProperties }) {
  const p = model.palette;
  return (
    <div className="p-6" style={{ background: p.surface, borderRadius: radius, boxShadow: `inset 0 0 0 1px ${p.ink}1a` }}>
      <p className="text-[1.15rem]" style={head}>
        {title}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.label} className={f.wide ? "col-span-2" : ""}>
            <div className="mb-1 text-[0.75rem] font-semibold" style={{ color: p.muted }}>
              {f.label}
            </div>
            <div className={f.tall ? "h-20" : "h-10"} style={{ background: p.bg, borderRadius: Math.max(4, radius - 4), boxShadow: `inset 0 0 0 1px ${p.ink}2b` }} />
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Btn model={model} radius={Math.max(4, radius - 2)}>
          {button ?? model.cta.label}
        </Btn>
      </div>
    </div>
  );
}

export function ContactList({ model, onDark = false, size = "base" }: { model: PreviewModel; onDark?: boolean; size?: "base" | "lg" }) {
  const p = model.palette;
  return (
    <ul className={`space-y-3 ${size === "lg" ? "text-[1.15rem]" : "text-[0.98rem]"}`}>
      <li className="flex items-center gap-3">
        <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
        {model.contact.phone ?? <Soft p={p} onDark={onDark}>Your phone number</Soft>}
      </li>
      <li className="flex items-center gap-3">
        <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
        {model.contact.email ?? <Soft p={p} onDark={onDark}>Your email address</Soft>}
      </li>
      <li className="flex items-center gap-3">
        <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
        {model.contact.postcode || model.contact.town ? [model.contact.town, model.contact.postcode].filter(Boolean).join(", ") : <Soft p={p} onDark={onDark}>Your town or area</Soft>}
      </li>
    </ul>
  );
}

/** Footer with columns, as on a real site. */
export function FooterCols({ model, compact, head, dark = true }: { model: PreviewModel; compact: boolean; head: CSSProperties; dark?: boolean }) {
  const p = model.palette;
  const bg = dark ? p.ink : p.surface;
  const fg = dark ? p.bg : p.ink;
  return (
    <footer className={`px-5 py-10 ${compact ? "" : "sm:px-14"}`} style={{ background: bg, color: fg }}>
      <div className={`grid gap-8 ${compact ? "grid-cols-1" : "grid-cols-12"}`}>
        <div className={compact ? "" : "col-span-5"}>
          <div className="flex items-center gap-3">
            <Logo model={model} size={34} />
            <span className="text-[1.05rem]" style={{ ...head, color: fg }}>
              {model.name}
            </span>
          </div>
          <p className="mt-3 max-w-xs text-[0.88rem] opacity-70">{model.category.trade.charAt(0).toUpperCase() + model.category.trade.slice(1)}{model.contact.town ? ` in ${model.contact.town}` : ""}.</p>
        </div>
        <ul className={`space-y-2 text-[0.9rem] opacity-80 ${compact ? "" : "col-span-3"}`}>
          {model.nav.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <div className={`text-[0.9rem] ${compact ? "" : "col-span-4"}`}>
          <ContactList model={model} onDark={dark} />
        </div>
      </div>
      <p className="mt-8 border-t pt-5 text-[0.78rem] opacity-80" style={{ borderColor: `${fg}33` }}>
        © {new Date().getFullYear()} {model.name}. Sample website preview.
      </p>
    </footer>
  );
}

export const ctaHeading = (m: PreviewModel) => (m.cta.kind === "book" ? "Ready to book?" : m.cta.kind === "visit" ? "Come and see us" : m.cta.kind === "call" ? "Give us a call" : "Tell us about the job");
