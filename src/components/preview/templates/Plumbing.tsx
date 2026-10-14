import "@fontsource-variable/manrope";
import { AreaMap, Btn, ContactList, EnquiryForm, FooterCols, Header, Photo, ServiceRows, ServiceTiles, Steps, TopBar, ctaHeading, tokens, type TProps } from "./kit";

/** Plumbers & heating: a classic, trustworthy trade layout. Phone first, photo hero with an offer panel, clear services, area and enquiry form. */
export default function Plumbing({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Manrope Variable', Inter, sans-serif", body: "Inter, system-ui, sans-serif", headWeight: 800, headTracking: "-0.03em", btn: 8, card: 10 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.65rem] leading-tight", "text-[2.35rem] leading-tight");

  return (
    <div style={t.root}>
      <TopBar model={model} compact={compact} pad={pad} />
      <Header model={model} compact={compact} pad={pad} head={head} />

      <section className="relative" style={{ minHeight: c(520, 560) }}>
        <Photo model={model} i={0} className="absolute inset-0" />
        <div className="absolute inset-0" style={{ background: c(`linear-gradient(0deg, ${p.ink}cc, ${p.ink}33)`, `linear-gradient(90deg, ${p.ink}99, transparent 70%)`) }} />
        <div className={`relative ${pad} ${c("flex min-h-[520px] items-end py-6", "py-16")}`}>
          <div className="w-full p-7" style={{ background: p.bg, borderRadius: 12, maxWidth: c("100%", "31rem"), boxShadow: `0 24px 60px -24px ${p.ink}88` }}>
            <h2 className={c("text-[1.9rem] leading-[1.08]", "text-[2.6rem] leading-[1.05]")} style={head}>
              {model.headline}
            </h2>
            <p className="mt-4 text-[1rem] leading-relaxed" style={{ color: p.muted }}>
              {model.subhead}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Btn model={model}>{model.cta.label}</Btn>
              {model.secondaryCta && (
                <Btn model={model} kind="ghost">
                  {model.secondaryCta.label}
                </Btn>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={`${pad} ${y}`}>
        <h2 className={h2} style={head}>
          Plumbing and heating services
        </h2>
        <p className="mt-3 max-w-xl text-[1.02rem]" style={{ color: p.muted }}>
          From emergency repairs to planned installs, here is what we can help with.
        </p>
        <div className="mt-8">
          <ServiceTiles model={model} compact={compact} head={head} radius={10} start={1} count={3} />
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
        <Photo model={model} i={2} size="md" className={`${c("mb-8 aspect-[4/3]", "col-span-5 aspect-[4/5]")}`} style={{ borderRadius: 12 }} />
        <div className={c("", "col-span-7")}>
          <h2 className={h2} style={head}>
            {model.aboutHeading}
          </h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed" style={{ color: p.muted }}>
            {model.aboutBody}
          </p>
          <p className="mt-6 text-[0.8rem] font-bold uppercase tracking-[0.14em]" style={{ color: p.accentText }}>
            Areas covered
          </p>
          <p className="mt-1 text-[1.1rem]" style={head}>
            {model.town ? `${model.town} and the surrounding area` : "Your town and the surrounding area"}
          </p>
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
          <div className={c("", "col-span-5")}>
            <h2 className={h2} style={head}>
              {ctaHeading(model)}
            </h2>
            <div className="mt-6">
              <ContactList model={model} />
            </div>
            <AreaMap model={model} className="mt-8 aspect-[16/10]" style={{ borderRadius: 10 }} />
          </div>
          <div className={c("", "col-span-6 col-start-7")}>
            <EnquiryForm model={model} head={head} title="Request a visit" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "Address or postcode", wide: true }, { label: "What's the problem?", wide: true, tall: true }]} button="Send request" />
          </div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
