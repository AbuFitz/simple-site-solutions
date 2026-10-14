import "@fontsource-variable/lexend";
import { AreaMap, AreasList, Btn, Chip, ContactList, EnquiryForm, FooterCols, Header, Kicker, ctaHeading, patterns, swipe, tokens, type TProps } from "./kit";

/** Tutors: an exercise-book feel. Ruled paper with a margin line, a highlighter headline, subject cards with tabs and slightly tilted lesson notes. */
export default function Tutoring({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Lexend Variable', Inter, sans-serif", body: "'Lexend Variable', Inter, system-ui, sans-serif", headWeight: 700, headTracking: "-0.03em", btn: 12, card: 14 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.8rem] leading-tight", "text-[2.5rem] leading-[1.1]");
  const ruled = `${patterns.lines(`${p.accent}26`, 36)}, ${p.surface}`;

  return (
    <div style={t.root}>
      <Header model={model} compact={compact} pad={pad} head={head} radius={12} />

      <section className={`relative ${pad} ${c("pb-10 pt-9", "pb-20 pt-16")}`} style={{ background: ruled }}>
        {!compact && <span className="absolute bottom-0 left-[4.5rem] top-0 w-[2px]" style={{ background: `${p.accent}66` }} aria-hidden="true" />}
        <div className={c("", "grid grid-cols-12 items-center gap-12")}>
          <div className={c("", "col-span-7 pl-6")}>
            <Chip bg={p.accent} fg={p.accentInk} size="sm" radius={8}>
              {model.category.label}
              {model.town ? ` · ${model.town}` : ""}
            </Chip>
            <h2 className={`mt-5 ${c("text-[2.3rem] leading-[1.1]", "text-[4rem] leading-[1.08]")}`} style={head}>
              <span style={swipe(`${p.accent}55`)}>{model.headline}</span>
            </h2>
            <p className={`mt-6 max-w-xl leading-relaxed ${c("text-[1rem]", "text-[1.15rem]")}`} style={{ color: p.muted }}>{model.subhead}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn model={model} radius={12}>{model.cta.label}</Btn>
              {model.secondaryCta && <Btn model={model} kind="ghost" radius={12}>{model.secondaryCta.label}</Btn>}
            </div>
          </div>
          <div className={c("mt-9", "col-span-5")} style={{ transform: compact ? undefined : "rotate(1.2deg)" }}>
            <EnquiryForm model={model} head={head} radius={14} title="Ask about a first session" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "Subject and year group", wide: true }]} button="Get in touch" />
          </div>
        </div>
      </section>

      <section className={`${pad} ${y}`}>
        <Kicker color={p.accentText}>Subjects and support</Kicker>
        <h2 className={`mt-3 ${h2}`} style={head}>What we teach</h2>
        <ul className={`mt-10 grid gap-5 ${c("grid-cols-1", "grid-cols-2")}`}>
          {model.services.map((s, i) => (
            <li key={s.title + i} className="relative overflow-hidden p-6 pl-9" style={{ background: p.surface, borderRadius: 14, boxShadow: `inset 0 0 0 1px ${p.ink}14` }}>
              <span className="absolute inset-y-0 left-0 w-3" style={{ background: i % 2 ? p.ink : p.accent }} aria-hidden="true" />
              <h3 className="text-[1.25rem]" style={head}>{s.title}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed" style={{ color: p.muted }}>{s.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${pad} ${y}`} style={{ background: ruled }}>
        <h2 className={h2} style={head}>How lessons work</h2>
        <ol className={`mt-10 grid gap-6 ${c("grid-cols-1", "grid-cols-3")}`}>
          {model.steps.map((s, i) => (
            <li key={s.title} className="p-6" style={{ background: p.bg, borderRadius: 6, transform: compact ? undefined : `rotate(${[-1.5, 1, -0.8][i % 3]}deg)`, boxShadow: `0 14px 28px -16px ${p.ink}55, inset 0 6px 0 ${p.accent}` }}>
              <span className="text-[2.6rem] font-bold leading-none" style={{ ...head, color: p.accentText }}>{i + 1}</span>
              <h3 className="mt-3 text-[1.2rem]" style={head}>{s.title}</h3>
              <p className="mt-1 text-[0.95rem] leading-relaxed" style={{ color: p.muted }}>{s.blurb}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 items-center gap-12")}`}>
        <div className={c("mb-8", "col-span-5")}>
          <Kicker color={p.accentText}>{model.aboutHeading}</Kicker>
          <h2 className={`mt-3 ${h2}`} style={head}>Where lessons take place</h2>
          <p className="mb-5 mt-4 text-[1.02rem] leading-relaxed" style={{ color: p.muted }}>{model.aboutBody}</p>
          <AreasList model={model} head={head} />
        </div>
        <AreaMap model={model} className={c("aspect-[4/3]", "col-span-7 aspect-[16/10]")} style={{ borderRadius: 14 }} />
      </section>

      <section id="contact" className={`${pad} ${y}`} style={{ background: p.accent, color: p.accentInk }}>
        <div className={`grid items-center gap-8 ${c("grid-cols-1", "grid-cols-12")}`}>
          <div className={c("", "col-span-7")}>
            <h2 className={c("text-[2rem] leading-tight", "text-[3rem] leading-none")} style={{ ...head, color: p.accentInk }}>{ctaHeading(model)}</h2>
            <p className="mt-3 text-[1.05rem]">Tell us the subject and year, and we'll take it from there.</p>
          </div>
          <div className={c("", "col-span-5")}><ContactList model={model} onDark /></div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
