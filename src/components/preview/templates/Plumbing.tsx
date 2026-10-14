import "@fontsource-variable/manrope";
import { AreaMap, AreasList, Btn, ContactList, EnquiryForm, FooterCols, Header, ServiceCards, ServiceRows, Steps, TopBar, ctaHeading, tokens, type TProps } from "./kit";

/** Plumbers & heating: the classic trusted-local-trade layout. Phone first, a request-a-visit form in the hero, clear services, areas on a real map. */
export default function Plumbing({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Manrope Variable', Inter, sans-serif", body: "Inter, system-ui, sans-serif", headWeight: 800, headTracking: "-0.03em", btn: 8, card: 12 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.65rem] leading-tight", "text-[2.35rem] leading-tight");

  return (
    <div style={t.root}>
      <TopBar model={model} compact={compact} pad={pad} />
      <Header model={model} compact={compact} pad={pad} head={head} />

      <section className={`${pad} ${c("pb-10 pt-8", "pb-16 pt-14")} ${c("", "grid grid-cols-12 items-center gap-12")}`} style={{ background: p.surface }}>
        <div className={c("", "col-span-7")}>
          <p className="mb-3 text-[0.85rem] font-bold uppercase tracking-[0.14em]" style={{ color: p.accentText }}>
            {model.category.label}
            {model.town ? ` · ${model.town}` : ""}
          </p>
          <h2 className={c("text-[2.2rem] leading-[1.05]", "text-[3.8rem] leading-[1.02]")} style={head}>
            {model.headline}
          </h2>
          <p className={`mt-5 max-w-xl leading-relaxed ${c("text-[1rem]", "text-[1.2rem]")}`} style={{ color: p.muted }}>
            {model.subhead}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Btn model={model}>{model.cta.label}</Btn>
            {model.secondaryCta && (
              <Btn model={model} kind="ghost">
                {model.secondaryCta.label}
              </Btn>
            )}
          </div>
        </div>
        <div className={c("mt-8", "col-span-5")}>
          <EnquiryForm model={model} head={head} radius={14} title="Request a visit" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "What's the problem?", wide: true, tall: true }]} button="Send request" />
        </div>
      </section>

      <div className={`flex ${c("flex-col gap-1.5 py-4", "items-center justify-between py-5")} ${pad}`} style={{ background: p.accent, color: p.accentInk }}>
        {model.services.slice(0, 4).map((s) => (
          <span key={s.title} className="text-[0.98rem] font-bold">
            {s.title}
          </span>
        ))}
      </div>

      <section className={`${pad} ${y}`}>
        <h2 className={h2} style={head}>
          Plumbing and heating services
        </h2>
        <p className="mt-3 max-w-xl text-[1.02rem]" style={{ color: p.muted }}>
          From emergency repairs to planned installs, here is what we can help with.
        </p>
        <div className="mt-8">
          <ServiceCards model={model} compact={compact} head={head} radius={12} count={3} />
        </div>
        <div className="mt-6">
          <ServiceRows model={model} compact={compact} head={head} from={3} />
        </div>
      </section>

      <section className={`${pad} ${c("py-9", "py-12")}`} style={{ background: p.ink, color: p.bg }}>
        <div className={`flex ${c("flex-col gap-5", "items-center justify-between gap-8")}`}>
          <div>
            <p className={c("text-[1.4rem]", "text-[2rem]")} style={{ ...head, color: p.bg }}>
              Something not right at home?
            </p>
            <p className="mt-1.5 text-[1rem] opacity-80">Tell us what's happening and we'll arrange a visit.</p>
          </div>
          <Btn model={model}>{model.cta.label}</Btn>
        </div>
      </section>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 items-center gap-12")}`}>
        <div className={c("mb-8", "col-span-5")}>
          <h2 className={h2} style={head}>
            Areas we cover
          </h2>
          <div className="mt-4">
            <AreasList model={model} head={head} />
          </div>
          <p className="mt-6 text-[1.02rem] leading-relaxed" style={{ color: p.muted }}>
            {model.aboutBody}
          </p>
        </div>
        <AreaMap model={model} className={c("aspect-[4/3]", "col-span-7 aspect-[4/3]")} style={{ borderRadius: 12 }} />
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
        <div className={`grid items-center gap-8 ${c("grid-cols-1", "grid-cols-12")}`}>
          <div className={c("", "col-span-7")}>
            <h2 className={h2} style={head}>
              {ctaHeading(model)}
            </h2>
            <p className={`mt-4 ${c("text-[1.8rem]", "text-[2.6rem]")}`} style={{ ...head, color: p.accentText }}>
              {model.contact.phone ?? "Get in touch"}
            </p>
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
