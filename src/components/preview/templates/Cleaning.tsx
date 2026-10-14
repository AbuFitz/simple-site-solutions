import "@fontsource-variable/nunito";
import { Check } from "lucide-react";
import { AreaMap, AreasList, Btn, ContactList, EnquiryForm, FooterCols, Header, ServiceCards, Steps, ctaHeading, tokens, type TProps } from "./kit";

const INCLUDED = ["Kitchen surfaces and appliances", "Bathrooms and toilets", "Floors vacuumed and mopped", "Dusting and wiping down", "Bins emptied", "Beds made on request"];

/** Cleaners: light and friendly, soft corners, a clear checklist of what a clean covers right in the hero. */
export default function Cleaning({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Nunito Variable', Inter, sans-serif", body: "'Nunito Variable', Inter, system-ui, sans-serif", headWeight: 800, headTracking: "-0.02em", btn: 999, card: 22 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.75rem] leading-tight", "text-[2.5rem] leading-tight");

  return (
    <div style={t.root}>
      <Header model={model} compact={compact} pad={pad} head={head} radius={14} />

      <section className={`${pad} ${c("pb-10 pt-8", "pb-16 pt-12")} ${c("", "grid grid-cols-12 items-center gap-12")}`} style={{ background: p.surface }}>
        <div className={c("", "col-span-6")}>
          <p className="mb-3 text-[0.95rem] font-bold" style={{ color: p.accentText }}>
            {model.category.label}
            {model.town ? ` in ${model.town}` : ""}
          </p>
          <h2 className={c("text-[2.2rem] leading-[1.06]", "text-[3.6rem] leading-[1.03]")} style={head}>
            {model.headline}
          </h2>
          <p className={`mt-5 max-w-lg leading-relaxed ${c("text-[1.02rem]", "text-[1.2rem]")}`} style={{ color: p.muted }}>
            {model.subhead}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Btn model={model} radius={999}>{model.cta.label}</Btn>
            {model.secondaryCta && <Btn model={model} kind="ghost" radius={999}>{model.secondaryCta.label}</Btn>}
          </div>
        </div>
        <div className={`p-7 ${c("mt-8", "col-span-6")}`} style={{ background: p.bg, borderRadius: 32, boxShadow: `0 24px 60px -30px ${p.ink}55, inset 0 0 0 1px ${p.ink}12` }}>
          <h3 className="text-[1.3rem]" style={head}>
            What a clean includes
          </h3>
          <ul className="mt-4 grid gap-3">
            {INCLUDED.map((x) => (
              <li key={x} className="flex items-center gap-3 text-[1rem] font-semibold">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: p.accent, color: p.accentInk }}>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {x}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.85rem]" style={{ color: p.muted }}>
            We agree the checklist with you before the first visit.
          </p>
        </div>
      </section>

      <section className={`${pad} ${y}`}>
        <h2 className={h2} style={head}>
          Our cleaning services
        </h2>
        <p className="mt-3 max-w-xl text-[1.05rem]" style={{ color: p.muted }}>
          Pick the clean that fits, or ask us for something tailored.
        </p>
        <div className="mt-8">
          <ServiceCards model={model} compact={compact} head={head} radius={22} count={6} />
        </div>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface }}>
        <h2 className={h2} style={head}>
          How it works
        </h2>
        <div className="mt-8">
          <Steps model={model} compact={compact} head={head} />
        </div>
        <p className="mt-8 max-w-2xl text-[1.05rem] leading-relaxed" style={{ color: p.muted }}>
          {model.aboutBody}
        </p>
      </section>

      <section id="contact" className={`${pad} ${y}`}>
        <div className={`grid gap-10 ${c("grid-cols-1", "grid-cols-12")}`}>
          <div className={c("", "col-span-5")}>
            <h2 className={h2} style={head}>
              {ctaHeading(model)}
            </h2>
            <div className="mt-6">
              <ContactList model={model} />
            </div>
            <p className="mt-8 text-[0.95rem] font-bold" style={{ color: p.accentText }}>
              Areas we cover
            </p>
            <div className="mt-1">
              <AreasList model={model} head={head} />
            </div>
            <AreaMap model={model} className="mt-6 aspect-[16/10]" style={{ borderRadius: 22 }} />
          </div>
          <div className={c("", "col-span-6 col-start-7")}>
            <EnquiryForm model={model} head={head} radius={22} title="Request a quote" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "Postcode", wide: true }, { label: "Tell us about your home or office", wide: true, tall: true }]} button="Request a quote" />
          </div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
