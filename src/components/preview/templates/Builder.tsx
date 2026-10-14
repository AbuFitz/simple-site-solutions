import "@fontsource/dm-serif-display/400.css";
import "@fontsource-variable/dm-sans";
import { AreaMap, Btn, ContactList, EnquiryForm, FooterCols, Header, Photo, ServiceRows, Steps, ctaHeading, tokens, type TProps } from "./kit";

/** Builders & renovators: the work leads. Large serif headline, big project photography, plain service list and a straightforward quote request. */
export default function Builder({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'DM Serif Display', Georgia, serif", body: "'DM Sans Variable', Inter, system-ui, sans-serif", headWeight: 400, headTracking: "-0.01em", btn: 3, card: 3 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[2rem] leading-tight", "text-[3rem] leading-[1.05]");

  return (
    <div style={t.root}>
      <Header model={model} compact={compact} pad={pad} head={head} radius={3} />

      <section className={`${pad} ${c("pb-8 pt-8", "pb-16 pt-14")} ${c("", "grid grid-cols-12 gap-12")}`}>
        <div className={c("", "col-span-7")}>
          <p className="mb-5 text-[0.82rem] font-bold uppercase tracking-[0.18em]" style={{ color: p.accentText }}>
            {model.category.label}
            {model.town ? ` · ${model.town}` : ""}
          </p>
          <h2 className={c("text-[2.6rem] leading-[1.02]", "text-[5.2rem] leading-[0.98]")} style={head}>
            {model.headline}
          </h2>
          <p className={`mt-6 max-w-lg leading-relaxed ${c("text-[1.02rem]", "text-[1.2rem]")}`} style={{ color: p.muted }}>
            {model.subhead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn model={model} radius={3}>{model.cta.label}</Btn>
            {model.secondaryCta && <Btn model={model} kind="ghost" radius={3}>{model.secondaryCta.label}</Btn>}
          </div>
        </div>
        <Photo model={model} i={0} className={c("mt-8 aspect-[4/3]", "col-span-5 aspect-[3/4]")} style={{ borderRadius: 3 }} />
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface }}>
        <h2 className={h2} style={head}>
          Our work
        </h2>
        <div className={`mt-8 grid gap-4 ${c("grid-cols-1", "grid-cols-12")}`}>
          <figure className={c("", "col-span-7")}>
            <Photo model={model} i={1} className="aspect-[3/2]" style={{ borderRadius: 3 }} />
            <figcaption className="mt-2 text-[0.9rem]" style={{ color: p.muted }}>{model.services[0].title}</figcaption>
          </figure>
          <div className={c("grid grid-cols-2 gap-4", "col-span-5 grid grid-rows-2 gap-4")}>
            {[2, 3].map((i, k) => (
              <figure key={i}>
                <Photo model={model} i={i} size="md" className={c("aspect-square", "aspect-[3/2]")} style={{ borderRadius: 3 }} />
                <figcaption className="mt-2 text-[0.9rem]" style={{ color: p.muted }}>{model.services[k + 1]?.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 gap-14")}`}>
        <div className={c("mb-8", "col-span-4")}>
          <h2 className={h2} style={head}>
            What we build
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed" style={{ color: p.muted }}>
            {model.aboutBody}
          </p>
        </div>
        <div className={c("", "col-span-8")}>
          <ServiceRows model={model} compact={compact} head={{ ...head, fontFamily: "'DM Sans Variable', Inter, sans-serif", fontWeight: 700, letterSpacing: "-0.02em" }} cols={1} />
        </div>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.ink, color: p.bg }}>
        <h2 className={h2} style={{ ...head, color: p.bg }}>
          How a project runs
        </h2>
        <div className="mt-8" style={{ color: p.bg }}>
          <Steps model={{ ...model, palette: { ...p, muted: `${p.bg}b3`, accentText: p.accent } }} compact={compact} head={{ ...head, color: p.bg }} />
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
            <AreaMap model={model} className="mt-8 aspect-[16/10]" style={{ borderRadius: 3 }} />
          </div>
          <div className={c("", "col-span-6 col-start-7")}>
            <EnquiryForm model={model} head={{ ...head, fontFamily: "'DM Sans Variable', Inter, sans-serif", fontWeight: 700 }} radius={4} title="Request a quote" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "Site address or postcode", wide: true }, { label: "Tell us about the project", wide: true, tall: true }]} button="Send request" />
          </div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
