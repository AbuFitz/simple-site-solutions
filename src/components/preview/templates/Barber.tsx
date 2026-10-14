import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import { AreaMap, AreasList, Btn, Chip, ContactList, FooterCols, Kicker, Soft, ctaHeading, tokens, type TProps } from "./kit";

/** Barbers & salons: classic and editorial. A pole-stripe edge, a menu with dotted leaders, a booking card and a map-led "find us". */
export default function Barber({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Playfair Display', Georgia, serif", body: "Inter, system-ui, sans-serif", headWeight: 700, headTracking: "-0.015em", btn: 2, card: 2 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[2rem] leading-tight", "text-[3rem] leading-[1.05]");
  const pole = `repeating-linear-gradient(-30deg, ${p.accent} 0 16px, ${p.surface} 16px 32px, ${p.ink} 32px 48px, ${p.surface} 48px 64px)`;

  return (
    <div style={t.root}>
      <header className={`flex items-center justify-between py-5 ${pad}`} style={{ background: p.ink, color: p.bg }}>
        <span className={c("text-[1.25rem]", "text-[1.6rem]")} style={{ ...head, color: p.bg }}>{model.name}</span>
        {!compact ? (
          <div className="flex items-center gap-9">
            <nav className="flex gap-7 text-[0.78rem] font-semibold uppercase tracking-[0.2em]" style={{ color: `${p.bg}cc` }} aria-label="Preview navigation">
              {model.nav.map((n) => <span key={n}>{n}</span>)}
            </nav>
            <Btn model={model} radius={2}>{model.cta.label}</Btn>
          </div>
        ) : (
          <span className="block h-0.5 w-6" style={{ background: p.bg, boxShadow: `0 6px 0 ${p.bg}, 0 -6px 0 ${p.bg}` }} aria-hidden="true" />
        )}
      </header>

      <section className={`relative ${c("py-14", "py-24")}`} style={{ background: `radial-gradient(ellipse at 20% 0%, ${p.surface}, ${p.bg} 70%)` }}>
        <div className={`${pad} ${c("", "grid grid-cols-12 items-center gap-12")}`}>
          <div className={c("", "col-span-9")}>
            <Kicker color={p.accentText} className="tracking-[0.3em]">
              {model.category.label}
              {model.town ? ` · ${model.town}` : ""}
            </Kicker>
            <h2 className={`mt-5 ${c("text-[2.8rem] leading-[1.02]", "text-[6rem] leading-[0.98]")}`} style={head}>{model.headline}</h2>
            <p className="mt-6 max-w-lg text-[1.08rem] leading-relaxed" style={{ color: p.muted }}>{model.subhead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn model={model} radius={2}>{model.cta.label}</Btn>
              {model.secondaryCta && <Btn model={model} kind="ghost" radius={2}>{model.secondaryCta.label}</Btn>}
            </div>
          </div>
          <div className={c("mt-10 h-5", "col-span-3 h-[22rem]")} style={{ background: pole, boxShadow: `inset 0 0 0 2px ${p.ink}` }} aria-hidden="true" />
        </div>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface }}>
        <div className="text-center">
          <Kicker color={p.accentText} className="tracking-[0.3em]">The menu</Kicker>
          <h2 className={`mt-3 ${h2}`} style={head}>Services</h2>
        </div>
        <ul className={`mx-auto mt-12 grid max-w-5xl gap-x-16 gap-y-9 ${c("grid-cols-1", "grid-cols-2")}`}>
          {model.services.map((s) => (
            <li key={s.title}>
              <div className="flex items-baseline gap-3">
                <h3 className="shrink-0 text-[1.35rem]" style={head}>{s.title}</h3>
                <span className="min-w-6 flex-1 translate-y-[-4px]" style={{ borderBottom: `2px dotted ${p.ink}55` }} aria-hidden="true" />
                <span className="shrink-0 text-[0.9rem]"><Soft p={p}>Your price</Soft></span>
              </div>
              <p className="mt-1.5 text-[0.95rem]" style={{ color: p.muted }}>{s.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 items-center gap-14")}`}>
        <div className={c("mb-10", "col-span-6")}>
          <Kicker color={p.accentText} className="tracking-[0.3em]">{model.aboutHeading}</Kicker>
          <h2 className={`mt-3 ${h2}`} style={head}>Booking a chair</h2>
          <ol className="mt-8 space-y-6">
            {model.steps.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span className="w-10 shrink-0 text-[2rem] leading-none" style={{ ...head, color: p.accentText }}>{i + 1}</span>
                <div>
                  <h3 className="text-[1.2rem]" style={head}>{s.title}</h3>
                  <p className="mt-1 text-[0.97rem]" style={{ color: p.muted }}>{s.blurb}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className={`p-7 ${c("", "col-span-6")}`} style={{ background: p.surface, boxShadow: `inset 0 0 0 1px ${p.ink}33, 10px 10px 0 ${p.accent}` }}>
          <p className="text-[1.4rem]" style={head}>Book your visit</p>
          <p className="mt-4 text-[0.75rem] font-bold uppercase tracking-[0.18em]" style={{ color: p.muted }}>Choose a service</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {model.services.slice(0, 3).map((s, i) => <Chip key={s.title} size="sm" radius={2} bg={i === 0 ? p.accent : undefined} fg={i === 0 ? p.accentInk : p.ink} ring={i === 0 ? undefined : `${p.ink}40`}>{s.title}</Chip>)}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {["Day", "Time", "Your name", "Phone"].map((l) => (
              <div key={l}>
                <div className="mb-1 text-[0.72rem] font-semibold uppercase tracking-wider" style={{ color: p.muted }}>{l}</div>
                <div className="h-10" style={{ background: p.bg, boxShadow: `inset 0 0 0 1px ${p.ink}40` }} />
              </div>
            ))}
          </div>
          <div className="mt-5"><Btn model={model} radius={2}>{model.cta.label}</Btn></div>
        </div>
      </section>

      <section id="contact" style={{ background: p.ink, color: p.bg }}>
        <div className={c("", "grid grid-cols-12")}>
          <div className={`${pad} ${y} ${c("", "col-span-5")}`}>
            <h2 className={h2} style={{ ...head, color: p.bg }}>{ctaHeading(model)}</h2>
            <div className="mt-6"><ContactList model={model} onDark /></div>
            <div className="mt-6 [&_p]:!text-[1rem]"><AreasList model={model} head={head} onDark /></div>
          </div>
          <AreaMap model={model} className={c("aspect-[4/3]", "col-span-7 min-h-[26rem]")} style={{ borderRadius: 0 }} />
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
