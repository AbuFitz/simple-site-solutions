import "@fontsource-variable/space-grotesk";
import { AreaMap, AreasList, Btn, ContactList, EnquiryForm, FooterCols, Header, ServiceRows, Steps, ctaHeading, tokens, type TProps } from "./kit";

/** Electricians: dark and high-contrast. A big typographic hero with the number front and centre, a plain services list, and a quote form beside a real map. */
export default function Electrical({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Space Grotesk Variable', Inter, sans-serif", body: "Inter, system-ui, sans-serif", headWeight: 700, headTracking: "-0.04em", btn: 6, card: 8 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.8rem] leading-tight", "text-[2.7rem] leading-[1.05]");

  return (
    <div style={t.root}>
      <Header model={model} compact={compact} pad={pad} head={head} radius={6} />

      <section className={`${pad} ${c("pb-10 pt-8", "pb-20 pt-16")} ${c("", "grid grid-cols-12 gap-12")}`} style={{ background: `linear-gradient(180deg, ${p.bg}, ${p.surface})` }}>
        <div className={c("", "col-span-8")}>
          <p className="mb-5 text-[0.8rem] font-bold uppercase tracking-[0.2em]" style={{ color: p.accent }}>
            {model.category.label}
            {model.town ? ` · ${model.town}` : ""}
          </p>
          <h2 className={c("text-[2.5rem] leading-[1]", "text-[5.2rem] leading-[0.94]")} style={head}>
            {model.headline}
          </h2>
          <p className={`mt-6 max-w-xl leading-relaxed ${c("text-[1rem]", "text-[1.2rem]")}`} style={{ color: p.muted }}>
            {model.subhead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn model={model} radius={6}>{model.cta.label}</Btn>
            {model.secondaryCta && <Btn model={model} kind="ghost" radius={6}>{model.secondaryCta.label}</Btn>}
          </div>
        </div>
        <ul className={`${c("mt-10", "col-span-4 self-end")}`} style={{ borderLeft: `3px solid ${p.accent}` }}>
          {model.services.slice(0, 4).map((s) => (
            <li key={s.title} className="py-3 pl-5 text-[1.05rem] font-semibold" style={{ borderBottom: `1px solid ${p.ink}1f` }}>
              {s.title}
            </li>
          ))}
        </ul>
      </section>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 gap-14")}`}>
        <div className={c("mb-8", "col-span-4")}>
          <h2 className={h2} style={head}>
            What we do
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed" style={{ color: p.muted }}>
            {model.aboutBody}
          </p>
        </div>
        <div className={c("", "col-span-8")}>
          <ServiceRows model={model} compact={compact} head={head} />
        </div>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface }}>
        <h2 className={h2} style={head}>
          How it works
        </h2>
        <div className="mt-8">
          <Steps model={model} compact={compact} head={head} />
        </div>
      </section>

      <section id="contact" className={`${pad} ${y}`}>
        <div className={`grid gap-10 ${c("grid-cols-1", "grid-cols-12")}`}>
          <div className={c("", "col-span-6")}>
            <h2 className={h2} style={head}>
              {ctaHeading(model)}
            </h2>
            <p className={`mt-5 ${c("text-[1.8rem]", "text-[2.6rem]")}`} style={{ ...head, color: p.accent }}>
              {model.contact.phone ?? "Get in touch"}
            </p>
            <div className="mt-6">
              <ContactList model={model} />
            </div>
            <p className="mt-8 text-[0.8rem] font-bold uppercase tracking-[0.16em]" style={{ color: p.accent }}>
              Areas covered
            </p>
            <div className="mt-2">
              <AreasList model={model} head={head} />
            </div>
          </div>
          <div className={c("", "col-span-6")}>
            <AreaMap model={model} className="aspect-[16/10]" style={{ borderRadius: 8 }} />
            <div className="mt-5">
              <EnquiryForm model={model} head={head} radius={8} title="Request a quote" fields={[{ label: "Name" }, { label: "Phone" }, { label: "What needs doing?", wide: true, tall: true }]} button="Send enquiry" />
            </div>
          </div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} dark={false} />
    </div>
  );
}
