import "@fontsource/dm-serif-display/400.css";
import "@fontsource-variable/dm-sans";
import { AreaMap, AreasList, Btn, ContactList, EnquiryForm, FooterCols, Header, Steps, ctaHeading, tokens, type TProps } from "./kit";

/** Builders & renovators: plain-spoken and project-led. A large serif headline, what they build set out as big typographic rows, a clear process, a quote form and the map. */
export default function Builder({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'DM Serif Display', Georgia, serif", body: "'DM Sans Variable', Inter, system-ui, sans-serif", headWeight: 400, headTracking: "-0.01em", btn: 3, card: 3 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[2rem] leading-tight", "text-[3rem] leading-[1.05]");
  const sans = { fontFamily: "'DM Sans Variable', Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.02em" } as const;

  return (
    <div style={t.root}>
      <Header model={model} compact={compact} pad={pad} head={head} radius={3} />

      <section className={`${pad} ${c("pb-10 pt-8", "pb-20 pt-16")}`}>
        <p className="mb-5 text-[0.82rem] font-bold uppercase tracking-[0.18em]" style={{ color: p.accentText }}>
          {model.category.label}
          {model.town ? ` · ${model.town}` : ""}
        </p>
        <h2 className={c("text-[2.8rem] leading-[1.02]", "text-[6.2rem] leading-[0.96]")} style={{ ...head, maxWidth: "62rem" }}>
          {model.headline}
        </h2>
        <div className={`mt-8 ${c("", "grid grid-cols-12 items-end gap-12")}`}>
          <p className={`max-w-xl leading-relaxed ${c("text-[1.02rem]", "col-span-6 text-[1.2rem]")}`} style={{ color: p.muted }}>
            {model.subhead}
          </p>
          <div className={`flex flex-wrap gap-3 ${c("mt-6", "col-span-6 justify-end")}`}>
            <Btn model={model} radius={3}>{model.cta.label}</Btn>
            {model.secondaryCta && <Btn model={model} kind="ghost" radius={3}>{model.secondaryCta.label}</Btn>}
          </div>
        </div>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.ink, color: p.bg }}>
        <h2 className={h2} style={{ ...head, color: p.bg }}>
          What we build
        </h2>
        <ul className="mt-8">
          {model.services.map((s, i) => (
            <li key={s.title + i} className={`flex gap-6 py-5 ${c("flex-col gap-1", "items-baseline")}`} style={{ borderTop: `1px solid ${p.bg}33` }}>
              <span className={c("text-[1.5rem]", "w-[46%] text-[2rem] leading-tight")} style={{ ...head, color: p.bg }}>
                {s.title}
              </span>
              <span className="text-[1rem] leading-relaxed opacity-75">{s.blurb}</span>
            </li>
          ))}
          <li style={{ borderTop: `1px solid ${p.bg}33` }} />
        </ul>
      </section>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 gap-14")}`}>
        <div className={c("mb-8", "col-span-4")}>
          <h2 className={h2} style={head}>
            How a project runs
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed" style={{ color: p.muted }}>
            {model.aboutBody}
          </p>
        </div>
        <div className={c("", "col-span-8")}>
          <Steps model={model} compact={compact} head={sans} style="rows" />
        </div>
      </section>

      <section id="contact" className={`${pad} ${y}`} style={{ background: p.surface }}>
        <div className={`grid gap-10 ${c("grid-cols-1", "grid-cols-12")}`}>
          <div className={c("", "col-span-5")}>
            <h2 className={h2} style={head}>
              {ctaHeading(model)}
            </h2>
            <div className="mt-6">
              <ContactList model={model} />
            </div>
            <p className="mt-8 text-[0.82rem] font-bold uppercase tracking-[0.16em]" style={{ color: p.accentText }}>
              Areas covered
            </p>
            <div className="mt-1">
              <AreasList model={model} head={sans} />
            </div>
            <AreaMap model={model} className="mt-6 aspect-[16/10]" style={{ borderRadius: 3 }} />
          </div>
          <div className={c("", "col-span-6 col-start-7")}>
            <EnquiryForm model={model} head={sans} radius={4} title="Request a quote" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "Site address or postcode", wide: true }, { label: "Tell us about the project", wide: true, tall: true }]} button="Send request" />
          </div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
