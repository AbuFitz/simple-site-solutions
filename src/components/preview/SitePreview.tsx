import { CSSProperties } from "react";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import type { PreviewModel } from "@/lib/preview/types";
import { Art } from "./Art";

/**
 * Renders a generated PreviewModel as a complete one-page website.
 * It is laid out for a fixed design width (see DeviceFrame), so `compact` selects the phone composition
 * instead of relying on the visitor's viewport.
 */

const serif = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif';

function Placeholder({ children, p }: { children: string; p: PreviewModel["palette"] }) {
  return (
    <span className="rounded-md border border-dashed px-2 py-0.5 text-[0.8em] font-medium" style={{ borderColor: p.muted, color: p.muted }}>
      {children}
    </span>
  );
}

export function SitePreview({ model, compact }: { model: PreviewModel; compact: boolean }) {
  const { palette: p, layout, type } = model;
  const display: CSSProperties = type === "serif" ? { fontFamily: serif, letterSpacing: "-0.02em", fontWeight: 600 } : { letterSpacing: "-0.035em", fontWeight: 800 };
  const pad = compact ? "px-5" : "px-12";
  const sectionY = compact ? "py-10" : "py-16";
  const h1Size = compact ? "text-[2rem] leading-[1.05]" : layout === "bold" ? "text-[4rem] leading-[1]" : "text-[3.25rem] leading-[1.04]";
  const h2Size = compact ? "text-[1.6rem] leading-tight" : "text-[2.25rem] leading-tight";

  const Button = ({ href, children, ghost = false }: { href: string; children: string; ghost?: boolean }) => (
    <a
      href={href}
      onClick={(e) => e.preventDefault()}
      tabIndex={-1}
      className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.95rem] font-semibold"
      style={ghost ? { boxShadow: `inset 0 0 0 2px ${p.ink}`, color: p.ink } : { background: p.accent, color: p.accentInk }}
    >
      {children}
      {!ghost && <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
    </a>
  );

  const header = (
    <header className={`flex items-center justify-between gap-4 ${pad} ${compact ? "py-4" : "py-5"}`} style={{ borderBottom: `1px solid ${p.ink}1a` }}>
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[0.95rem] font-bold"
          style={{ background: p.accent, color: p.accentInk, fontFamily: type === "serif" ? serif : undefined }}
          aria-hidden="true"
        >
          {model.monogram}
        </span>
        <span className="truncate text-[1.05rem] font-bold" style={display}>
          {model.name}
        </span>
      </div>
      {!compact && (
        <nav className="flex items-center gap-7 text-[0.9rem] font-medium" aria-label="Preview navigation" style={{ color: p.muted }}>
          {model.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </nav>
      )}
      {!compact ? (
        <Button href={model.cta.href}>{model.cta.label}</Button>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ boxShadow: `inset 0 0 0 2px ${p.ink}` }} aria-hidden="true">
          <span className="block h-0.5 w-4" style={{ background: p.ink, boxShadow: `0 5px 0 ${p.ink}, 0 -5px 0 ${p.ink}` }} />
        </span>
      )}
    </header>
  );

  const heroText = (
    <div className={layout === "centered" && !compact ? "mx-auto max-w-3xl text-center" : ""}>
      <p className="mb-4 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em]" style={{ color: p.accentText }}>
        <span className="h-2 w-2 rotate-45" style={{ background: p.accent }} aria-hidden="true" />
        {model.category.label}
        {model.town ? ` · ${model.town}` : ""}
      </p>
      <h1 className={h1Size} style={display}>
        {model.headline}
      </h1>
      <p className={`mt-5 ${compact ? "text-[1rem]" : "text-[1.15rem]"} leading-relaxed ${layout === "centered" && !compact ? "mx-auto max-w-xl" : "max-w-lg"}`} style={{ color: p.muted }}>
        {model.subhead}
      </p>
      <div className={`mt-7 flex flex-wrap items-center gap-3 ${layout === "centered" && !compact ? "justify-center" : ""}`}>
        <Button href={model.cta.href}>{model.cta.label}</Button>
        {model.secondaryCta && (
          <Button href={model.secondaryCta.href} ghost>
            {model.secondaryCta.label}
          </Button>
        )}
      </div>
    </div>
  );

  const art = (cls: string, radius = "1.5rem") => (
    <div className={`relative overflow-hidden ${cls}`} style={{ borderRadius: radius, boxShadow: `inset 0 0 0 1px ${p.ink}1a` }}>
      <Art id={model.category.art} palette={p} className="absolute inset-0 h-full w-full" />
      <span className="absolute bottom-3 left-3 rounded-full px-3 py-1 text-[0.7rem] font-semibold" style={{ background: p.bg, color: p.muted }}>
        Your photo goes here
      </span>
    </div>
  );

  let hero: JSX.Element;
  if (compact) {
    hero = (
      <section className={`${pad} pb-8 pt-8`}>
        {heroText}
        {art("mt-8 aspect-[4/3]", layout === "editorial" ? "2.5rem 2.5rem 0.75rem 2.5rem" : "1.25rem")}
      </section>
    );
  } else if (layout === "split") {
    hero = (
      <section className={`grid grid-cols-12 items-center gap-10 ${pad} py-16`}>
        <div className="col-span-7">{heroText}</div>
        <div className="col-span-5">{art("aspect-[4/5]", "2rem")}</div>
      </section>
    );
  } else if (layout === "bold") {
    hero = (
      <section className="relative">
        <div className={`${pad} pb-12 pt-16`} style={{ background: p.accent, color: p.accentInk }}>
          <h1 className={h1Size} style={{ ...display, maxWidth: "52rem" }}>
            {model.headline}
          </h1>
          <p className="mt-5 max-w-xl text-[1.15rem] leading-relaxed opacity-90">{model.subhead}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={model.cta.href} onClick={(e) => e.preventDefault()} tabIndex={-1} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.95rem] font-semibold" style={{ background: p.accentInk, color: p.accent }}>
              {model.cta.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            {model.secondaryCta && (
              <span className="inline-flex items-center rounded-full px-6 py-3 text-[0.95rem] font-semibold" style={{ boxShadow: `inset 0 0 0 2px ${p.accentInk}` }}>
                {model.secondaryCta.label}
              </span>
            )}
          </div>
        </div>
        <div className={`${pad} -mt-2`}>{art("aspect-[16/6]", "0 0 2rem 2rem")}</div>
      </section>
    );
  } else if (layout === "editorial") {
    hero = (
      <section className={`grid grid-cols-12 gap-8 ${pad} py-16`}>
        <div className="col-span-8 col-start-1">{heroText}</div>
        <div className="col-span-4 self-end">{art("aspect-[3/4]", "999px 999px 1.5rem 1.5rem")}</div>
      </section>
    );
  } else {
    hero = (
      <section className={`${pad} pb-14 pt-16`}>
        {heroText}
        {art("mt-12 aspect-[16/6]", "2rem")}
      </section>
    );
  }

  const services = (
    <section id="services" className={`${pad} ${sectionY}`} style={{ background: p.surface }}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className={h2Size} style={display}>
          What we do
        </h2>
        {model.servicesAreExamples && <Placeholder p={p}>Example services, easy to change</Placeholder>}
      </div>
      <ul className={`mt-8 grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-3"}`}>
        {model.services.map((s, i) => (
          <li key={s.title + i} className="rounded-2xl p-5" style={{ background: p.bg, boxShadow: `inset 0 0 0 1px ${p.ink}14` }}>
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-[0.85rem] font-bold" style={{ background: i % 3 === 0 ? p.accent : `${p.accent}33`, color: i % 3 === 0 ? p.accentInk : p.ink }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[1.1rem] font-bold" style={display}>
              {s.title}
            </h3>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed" style={{ color: p.muted }}>
              {s.blurb}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );

  const steps = (
    <section id="how" className={`${pad} ${sectionY}`}>
      <h2 className={h2Size} style={display}>
        How it works
      </h2>
      <ol className={`mt-8 grid gap-6 ${compact ? "grid-cols-1" : "grid-cols-3"}`}>
        {model.steps.map((s, i) => (
          <li key={s.title} className={compact ? "flex gap-4" : ""}>
            <span className={`block font-bold ${compact ? "text-[2.2rem]" : "text-[3.5rem]"} leading-none`} style={{ ...display, color: p.accentText }}>
              {i + 1}
            </span>
            <div>
              <h3 className="mt-2 text-[1.1rem] font-bold" style={display}>
                {s.title}
              </h3>
              <p className="mt-1 text-[0.95rem]" style={{ color: p.muted }}>
                {s.blurb}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );

  const about = (
    <section id="about" className={`${pad} ${sectionY} grid gap-8 ${compact ? "grid-cols-1" : "grid-cols-12"}`} style={{ background: p.surface }}>
      <div className={compact ? "" : "col-span-5"}>
        <h2 className={h2Size} style={display}>
          {model.aboutHeading}
        </h2>
      </div>
      <div className={compact ? "" : "col-span-6 col-start-7"}>
        <p className="text-[1.05rem] leading-relaxed" style={{ color: p.muted }}>
          {model.aboutBody}
        </p>
        <div className="mt-4">
          <Placeholder p={p}>Your own story and photos go here</Placeholder>
        </div>
      </div>
    </section>
  );

  const gallery = (
    <section className={`${pad} ${sectionY}`}>
      <h2 className={h2Size} style={display}>
        Recent work
      </h2>
      <div className={`mt-8 grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`relative overflow-hidden ${i === 0 && !compact ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`} style={{ borderRadius: i % 2 ? "1.5rem 0.5rem 1.5rem 0.5rem" : "0.5rem 1.5rem 0.5rem 1.5rem" }}>
            <Art id={model.category.art} palette={p} className="absolute inset-0 h-full w-full scale-150" />
            <span className="absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold" style={{ background: p.bg, color: p.muted }}>
              Your work photo
            </span>
          </div>
        ))}
      </div>
    </section>
  );

  const contact = (
    <section id="contact" className={`${pad} ${sectionY}`} style={{ background: p.ink, color: p.bg }}>
      <div className={`grid gap-8 ${compact ? "grid-cols-1" : "grid-cols-12"}`}>
        <div className={compact ? "" : "col-span-7"}>
          <h2 className={h2Size} style={{ ...display, color: p.bg }}>
            {model.cta.kind === "book" ? "Ready to book?" : model.cta.kind === "visit" ? "Come and see us" : model.cta.kind === "call" ? "Give us a call" : "Tell us about the job"}
          </h2>
          <div className="mt-6">
            <a href={model.cta.href} onClick={(e) => e.preventDefault()} tabIndex={-1} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.95rem] font-semibold" style={{ background: p.accent, color: p.accentInk }}>
              {model.cta.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
        <ul className={`space-y-3 text-[0.98rem] ${compact ? "" : "col-span-4 col-start-9"}`}>
          <li className="flex items-center gap-3">
            <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
            {model.contact.phone ?? <Placeholder p={{ ...p, muted: p.bg }}>Your phone number</Placeholder>}
          </li>
          <li className="flex items-center gap-3">
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            {model.contact.email ?? <Placeholder p={{ ...p, muted: p.bg }}>Your email address</Placeholder>}
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {model.contact.town ? `Based in ${model.contact.town}` : <Placeholder p={{ ...p, muted: p.bg }}>Your town or area</Placeholder>}
          </li>
        </ul>
      </div>
      <p className="mt-10 text-[0.8rem] opacity-70">
        © {new Date().getFullYear()} {model.name}
      </p>
    </section>
  );

  return (
    <div style={{ background: p.bg, color: p.ink, fontFamily: "Inter, system-ui, sans-serif" }}>
      {header}
      {hero}
      {services}
      {steps}
      {about}
      {gallery}
      {contact}
    </div>
  );
}
