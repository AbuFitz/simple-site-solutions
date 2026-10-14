import "@fontsource-variable/lexend";
import { Check } from "lucide-react";
import { AreaMap, AreasList, Btn, ContactList, EnquiryForm, FooterCols, Header, Steps, ctaHeading, tokens, type TProps } from "./kit";

/** Tutors: warm and reassuring for parents. Readable type, a first-session card in the hero, subjects up front and how lessons work. */
export default function Tutoring({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Lexend Variable', Inter, sans-serif", body: "'Lexend Variable', Inter, system-ui, sans-serif", headWeight: 700, headTracking: "-0.02em", btn: 12, card: 16 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.7rem] leading-tight", "text-[2.4rem] leading-tight");

  return (
    <div style={t.root}>
      <Header model={model} compact={compact} pad={pad} head={head} radius={12} />

      <section className={`${pad} ${c("pb-10 pt-8", "pb-16 pt-14")} ${c("", "grid grid-cols-12 items-center gap-12")}`} style={{ background: p.surface }}>
        <div className={c("", "col-span-7")}>
          <p className="mb-3 text-[0.9rem] font-semibold" style={{ color: p.accentText }}>
            {model.category.label}
            {model.town ? ` · ${model.town}` : ""}
          </p>
          <h2 className={c("text-[2.1rem] leading-[1.1]", "text-[3.5rem] leading-[1.06]")} style={head}>
            {model.headline}
          </h2>
          <p className={`mt-5 max-w-lg leading-relaxed ${c("text-[1rem]", "text-[1.15rem]")}`} style={{ color: p.muted }}>
            {model.subhead}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Btn model={model} radius={12}>{model.cta.label}</Btn>
            {model.secondaryCta && <Btn model={model} kind="ghost" radius={12}>{model.secondaryCta.label}</Btn>}
          </div>
        </div>
        <div className={c("mt-8", "col-span-5")}>
          <EnquiryForm model={model} head={head} radius={20} title="Ask about a first session" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "Subject and year group", wide: true }]} button="Get in touch" />
        </div>
      </section>

      <section className={`${pad} ${y}`}>
        <h2 className={h2} style={head}>
          What we teach
        </h2>
        <ul className={`mt-8 grid gap-4 ${c("grid-cols-1", "grid-cols-2")}`}>
          {model.services.map((s, i) => (
            <li key={s.title + i} className="flex gap-4 p-5" style={{ background: p.surface, borderRadius: 16, boxShadow: `inset 0 0 0 1px ${p.ink}14` }}>
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: p.accent, color: p.accentInk }}>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[1.1rem]" style={head}>
                  {s.title}
                </h3>
                <p className="mt-1 text-[0.93rem] leading-relaxed" style={{ color: p.muted }}>
                  {s.blurb}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface }}>
        <h2 className={h2} style={head}>
          How lessons work
        </h2>
        <div className="mt-8">
          <Steps model={model} compact={compact} head={head} />
        </div>
      </section>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 items-start gap-12")}`}>
        <div className={c("mb-8", "col-span-6")}>
          <h2 className={h2} style={head}>
            {model.aboutHeading}
          </h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed" style={{ color: p.muted }}>
            {model.aboutBody}
          </p>
          <div className="mt-6">
            <Btn model={model} radius={12}>{model.cta.label}</Btn>
          </div>
        </div>
        <div className={c("", "col-span-6")}>
          <p className="mb-2 text-[0.9rem] font-semibold" style={{ color: p.accentText }}>
            Where lessons take place
          </p>
          <AreasList model={model} head={head} />
          <AreaMap model={model} className="mt-4 aspect-[16/10]" style={{ borderRadius: 16 }} />
        </div>
      </section>

      <section id="contact" className={`${pad} ${y}`} style={{ background: p.surface }}>
        <div className={`grid items-center gap-8 ${c("grid-cols-1", "grid-cols-12")}`}>
          <div className={c("", "col-span-7")}>
            <h2 className={h2} style={head}>
              {ctaHeading(model)}
            </h2>
          </div>
          <div className={c("", "col-span-5")}>
            <ContactList model={model} />
          </div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
