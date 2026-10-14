import "@fontsource-variable/plus-jakarta-sans";
import { AreaMap, Btn, ContactList, EnquiryForm, FooterCols, Header, Photo, ServiceRows, Steps, ctaHeading, tokens, type TProps } from "./kit";

/** Any other local business: a clean, general-purpose layout. Centred introduction, one wide photo, services, about and an enquiry form. */
export default function Other({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Plus Jakarta Sans Variable', Inter, sans-serif", body: "'Plus Jakarta Sans Variable', Inter, system-ui, sans-serif", headWeight: 800, headTracking: "-0.035em", btn: 8, card: 12 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.7rem] leading-tight", "text-[2.4rem] leading-tight");

  return (
    <div style={t.root}>
      <Header model={model} compact={compact} pad={pad} head={head} radius={10} />

      <section className={`${pad} ${c("pb-8 pt-10", "pb-14 pt-16")} text-center`}>
        <h2 className={`mx-auto ${c("text-[2.2rem] leading-[1.06]", "text-[4rem] leading-[1.02]")}`} style={{ ...head, maxWidth: "46rem" }}>
          {model.headline}
        </h2>
        <p className={`mx-auto mt-5 max-w-xl leading-relaxed ${c("text-[1rem]", "text-[1.2rem]")}`} style={{ color: p.muted }}>
          {model.subhead}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Btn model={model} radius={10}>{model.cta.label}</Btn>
          {model.secondaryCta && <Btn model={model} kind="ghost" radius={10}>{model.secondaryCta.label}</Btn>}
        </div>
      </section>
      <div className={pad}>
        <Photo model={model} i={0} className={c("aspect-[4/3]", "aspect-[21/9]")} style={{ borderRadius: 16 }} />
      </div>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 gap-14")}`}>
        <div className={c("mb-6", "col-span-4")}>
          <h2 className={h2} style={head}>
            What we do
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed" style={{ color: p.muted }}>
            Straightforward services, explained clearly.
          </p>
        </div>
        <div className={c("", "col-span-8")}>
          <ServiceRows model={model} compact={compact} head={head} cols={1} />
        </div>
      </section>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 items-center gap-12")}`} style={{ background: p.surface }}>
        <Photo model={model} i={1} size="md" className={c("mb-8 aspect-[4/3]", "col-span-5 aspect-[4/5]")} style={{ borderRadius: 16 }} />
        <div className={c("", "col-span-7")}>
          <h2 className={h2} style={head}>
            {model.aboutHeading}
          </h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed" style={{ color: p.muted }}>
            {model.aboutBody}
          </p>
          <div className="mt-8">
            <Steps model={model} compact={compact} head={head} style="rows" />
          </div>
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
            <AreaMap model={model} className="mt-8 aspect-[16/10]" style={{ borderRadius: 12 }} />
          </div>
          <div className={c("", "col-span-6 col-start-7")}>
            <EnquiryForm model={model} head={head} radius={14} title="Send us a message" fields={[{ label: "Your name" }, { label: "Phone or email" }, { label: "How can we help?", wide: true, tall: true }]} button="Send message" />
          </div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
