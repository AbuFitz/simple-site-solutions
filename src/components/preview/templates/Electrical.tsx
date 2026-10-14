import "@fontsource-variable/space-grotesk";
import { AreaMap, AreasList, Btn, ContactList, EnquiryForm, FooterCols, Header, Kicker, ctaHeading, patterns, tokens, type TProps } from "./kit";

/** Electricians: a spec-sheet look. Blueprint grid hero with a big number, boxed service index with corner ticks, and a circuit-line process. */
export default function Electrical({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Space Grotesk Variable', Inter, sans-serif", body: "Inter, system-ui, sans-serif", headWeight: 700, headTracking: "-0.045em", btn: 4, card: 4 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.9rem] leading-tight", "text-[2.8rem] leading-[1.02]");
  const line = `${p.ink}${p.dark ? "33" : "26"}`;

  return (
    <div style={t.root}>
      <Header model={model} compact={compact} pad={pad} head={head} radius={4} upper />

      <section className={`relative ${pad} ${c("pb-10 pt-9", "pb-20 pt-16")}`} style={{ background: `${patterns.grid(`${p.ink}${p.dark ? "14" : "12"}`, 44)}, ${p.bg}` }}>
        <div className={c("", "grid grid-cols-12 gap-10")}>
          <div className={c("", "col-span-8")}>
            <Kicker color={p.accentText}>
              {model.category.label}
              {model.town ? ` / ${model.town}` : ""}
            </Kicker>
            <h2 className={`mt-5 ${c("text-[2.6rem] leading-[0.98]", "text-[5.4rem] leading-[0.92]")}`} style={head}>
              {model.headline}
            </h2>
            <p className={`mt-6 max-w-xl leading-relaxed ${c("text-[1rem]", "text-[1.2rem]")}`} style={{ color: p.muted }}>
              {model.subhead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn model={model} radius={4}>{model.cta.label}</Btn>
              {model.secondaryCta && <Btn model={model} kind="ghost" radius={4}>{model.secondaryCta.label}</Btn>}
            </div>
          </div>
          <div className={`self-end p-6 ${c("mt-9", "col-span-4")}`} style={{ background: p.accent, color: p.accentInk }}>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em]">Call or message</p>
            <p className={`mt-2 break-words ${c("text-[1.9rem]", "text-[2.3rem]")} leading-none`} style={{ ...head, color: p.accentInk }}>{model.contact.phone ?? "Your number"}</p>
            <p className="mt-3 text-[0.95rem]">{model.contact.town ? `Serving ${model.contact.town} and nearby.` : "Serving your local area."}</p>
          </div>
        </div>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface }}>
        <div className="flex items-end justify-between gap-6">
          <div>
            <Kicker color={p.accentText}>Service index</Kicker>
            <h2 className={`mt-3 ${h2}`} style={head}>What we do</h2>
          </div>
        </div>
        <ul className={`mt-8 grid gap-0 ${c("grid-cols-1", "grid-cols-3")}`} style={{ borderTop: `2px solid ${p.ink}`, borderLeft: `1px solid ${line}` }}>
          {model.services.map((s, i) => (
            <li key={s.title + i} className="relative p-6" style={{ borderRight: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
              <span className="absolute right-3 top-3 h-2 w-2" style={{ background: p.accent }} aria-hidden="true" />
              <span className="text-[2.6rem] font-bold leading-none tabular-nums" style={{ ...head, color: p.accentText }}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-[1.2rem]" style={head}>{s.title}</h3>
              <p className="mt-2 text-[0.93rem] leading-relaxed" style={{ color: p.muted }}>{s.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${pad} ${y}`}>
        <Kicker color={p.accentText}>How it works</Kicker>
        <h2 className={`mt-3 ${h2}`} style={head}>From first message to finished job</h2>
        <ol className={`relative mt-10 ${c("space-y-8 pl-8", "grid grid-cols-3 gap-8")}`}>
          <span className={`absolute ${c("bottom-2 left-[9px] top-2 w-[2px]", "left-0 right-0 top-[9px] h-[2px]")}`} style={{ background: p.accent }} aria-hidden="true" />
          {model.steps.map((s, i) => (
            <li key={s.title} className="relative">
              <span className={`absolute h-5 w-5 ${c("-left-8 top-0", "left-0 top-0")}`} style={{ background: p.bg, boxShadow: `inset 0 0 0 4px ${p.accent}`, borderRadius: 999 }} aria-hidden="true" />
              <p className={`text-[0.8rem] font-bold uppercase tracking-[0.16em] ${c("", "mt-8")}`} style={{ color: p.accentText }}>Step {i + 1}</p>
              <h3 className="mt-1 text-[1.25rem]" style={head}>{s.title}</h3>
              <p className="mt-1 text-[0.95rem] leading-relaxed" style={{ color: p.muted }}>{s.blurb}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" className={`${pad} ${y} ${c("", "grid grid-cols-12 gap-10")}`} style={{ background: p.surface }}>
        <div className={c("mb-8", "col-span-5")}>
          <h2 className={h2} style={head}>{ctaHeading(model)}</h2>
          <p className="mb-6 mt-4 text-[1rem] leading-relaxed" style={{ color: p.muted }}>{model.aboutBody}</p>
          <ContactList model={model} />
          <div className="mt-6"><Kicker color={p.accentText}>Areas covered</Kicker><div className="mt-2"><AreasList model={model} head={head} /></div></div>
        </div>
        <div className={`space-y-5 ${c("", "col-span-7")}`}>
          <EnquiryForm model={model} head={head} radius={4} title="Request a quote" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "What needs doing?", wide: true, tall: true }]} button="Send enquiry" />
          <AreaMap model={model} className="aspect-[16/8]" style={{ borderRadius: 4 }} />
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
