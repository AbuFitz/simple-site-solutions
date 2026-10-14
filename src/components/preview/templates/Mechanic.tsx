import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/600.css";
import { Check } from "lucide-react";
import { AreaMap, AreasList, Btn, ContactList, EnquiryForm, FooterCols, Header, Kicker, TopBar, ctaHeading, patterns, tokens, type TProps } from "./kit";

/** Garages and mechanics: workshop poster style. Hazard-stripe bands, an uppercase condensed headline, a "job sheet" checklist and service tickets. */
export default function Mechanic({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Barlow Condensed', 'Arial Narrow', sans-serif", body: "Barlow, Inter, system-ui, sans-serif", headWeight: 800, headTracking: "0.01em", headCase: "uppercase", btn: 2, card: 2 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[2.1rem] leading-none", "text-[3.4rem] leading-[0.95]");
  const hazard = patterns.stripes(p.accent, p.ink, 12);

  return (
    <div style={t.root}>
      <TopBar model={model} compact={compact} pad={pad} dark />
      <Header model={model} compact={compact} pad={pad} head={head} radius={2} upper />
      <div className="h-3" style={{ background: hazard }} aria-hidden="true" />

      <section className={`${pad} ${c("pb-10 pt-9", "pb-16 pt-14")} ${c("", "grid grid-cols-12 items-center gap-12")}`}>
        <div className={c("", "col-span-7")}>
          <Kicker color={p.accentText}>
            {model.category.label}
            {model.town ? ` · ${model.town}` : ""}
          </Kicker>
          <h2 className={`mt-3 ${c("text-[3rem] leading-[0.92]", "text-[6.2rem] leading-[0.88]")}`} style={head}>
            {model.headline}
          </h2>
          <p className={`mt-5 max-w-lg leading-relaxed ${c("text-[1.02rem]", "text-[1.2rem]")}`} style={{ color: p.muted }}>
            {model.subhead}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn model={model} radius={2}>{model.cta.label}</Btn>
            {model.secondaryCta && <Btn model={model} kind="ghost" radius={2}>{model.secondaryCta.label}</Btn>}
          </div>
        </div>
        <div className={`p-6 ${c("mt-9", "col-span-5")}`} style={{ background: p.surface, boxShadow: `inset 0 0 0 2px ${p.ink}, 8px 8px 0 ${p.accent}` }}>
          <p className="text-[1.5rem] leading-none" style={head}>Job sheet</p>
          <p className="mt-1 text-[0.85rem]" style={{ color: p.muted }}>Tell us the car and what it needs.</p>
          <ul className="mt-4">
            {model.services.slice(0, 4).map((s) => (
              <li key={s.title} className="flex items-center gap-3 py-2.5 text-[0.98rem] font-semibold" style={{ borderTop: `1.5px dashed ${p.ink}40` }}>
                <span className="flex h-5 w-5 shrink-0 items-center justify-center" style={{ background: p.accent, color: p.accentInk }}><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>
                {s.title}
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["Reg or car", "Phone"].map((l) => (
              <div key={l}>
                <div className="mb-1 text-[0.72rem] font-semibold uppercase tracking-wider" style={{ color: p.muted }}>{l}</div>
                <div className="h-10" style={{ background: p.bg, boxShadow: `inset 0 0 0 1.5px ${p.ink}55` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.ink, color: p.bg }}>
        <h2 className={h2} style={{ ...head, color: p.bg }}>What we do</h2>
        <ul className={`mt-8 grid gap-4 ${c("grid-cols-1", "grid-cols-2")}`}>
          {model.services.map((s, i) => (
            <li key={s.title + i} className="flex gap-5 p-5" style={{ background: `${p.bg}12`, boxShadow: `inset 4px 0 0 ${p.accent}` }}>
              <span className="text-[2.6rem] leading-none" style={{ ...head, color: p.accent }}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-[1.5rem] leading-none" style={{ ...head, color: p.bg }}>{s.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ color: `${p.bg}c8` }}>{s.blurb}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-3" style={{ background: hazard }} aria-hidden="true" />

      <section className={`${pad} ${y}`}>
        <h2 className={h2} style={head}>How it works</h2>
        <ol className={`mt-8 grid gap-5 ${c("grid-cols-1", "grid-cols-3")}`}>
          {model.steps.map((s, i) => (
            <li key={s.title} className="relative p-6" style={{ background: p.surface, boxShadow: `inset 0 0 0 2px ${p.ink}` }}>
              <span className="absolute -top-5 left-5 flex h-10 w-10 items-center justify-center text-[1.5rem]" style={{ ...head, background: p.accent, color: p.accentInk }}>{i + 1}</span>
              <h3 className="mt-3 text-[1.5rem] leading-none" style={head}>{s.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ color: p.muted }}>{s.blurb}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" className={`${pad} ${y} ${c("", "grid grid-cols-12 gap-10")}`} style={{ background: p.surface }}>
        <div className={c("mb-8", "col-span-5")}>
          <h2 className={h2} style={head}>{ctaHeading(model)}</h2>
          <p className={`my-4 ${c("text-[2rem]", "text-[2.8rem]")} leading-none`} style={{ ...head, color: p.accentText }}>{model.contact.phone ?? "Get in touch"}</p>
          <ContactList model={model} />
          <div className="mt-5"><AreasList model={model} head={head} /></div>
        </div>
        <div className={`space-y-5 ${c("", "col-span-7")}`}>
          <AreaMap model={model} className="aspect-[16/8]" style={{ borderRadius: 2 }} />
          <EnquiryForm model={model} head={head} radius={2} title="Request a quote" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "Car and what's wrong", wide: true, tall: true }]} button="Send" />
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
