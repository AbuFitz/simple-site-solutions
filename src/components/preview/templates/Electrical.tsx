import "@fontsource-variable/space-grotesk";
import { AreaMap, Btn, ContactList, EnquiryForm, FooterCols, Header, Photo, ServiceRows, Steps, tokens, ctaHeading, type TProps } from "./kit";

/** Electricians: dark and high-contrast. Full-bleed photo hero, a short list of what the business does, and a straightforward quote form. */
export default function Electrical({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Space Grotesk Variable', Inter, sans-serif", body: "Inter, system-ui, sans-serif", headWeight: 700, headTracking: "-0.04em", btn: 6, card: 8 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.8rem] leading-tight", "text-[2.7rem] leading-[1.05]");

  return (
    <div style={t.root}>
      <section className="relative" style={{ minHeight: c(580, 680) }}>
        <Photo model={model} i={0} className="absolute inset-0" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${p.bg} 5%, ${p.bg}d9 40%, ${p.bg}26 100%), linear-gradient(0deg, ${p.bg}, transparent 30%)` }} />
        <div className="relative">
          <Header model={model} compact={compact} pad={pad} head={head} tone="transparent" radius={6} />
          <div className={`${pad} ${c("pb-12 pt-14", "pb-24 pt-20")}`}>
            <p className="mb-5 text-[0.8rem] font-bold uppercase tracking-[0.2em]" style={{ color: p.accent }}>
              {model.category.label}
              {model.town ? ` · ${model.town}` : ""}
            </p>
            <h2 className={c("text-[2.5rem] leading-[1]", "text-[4.8rem] leading-[0.96]")} style={{ ...head, maxWidth: c("100%", "46rem") }}>
              {model.headline}
            </h2>
            <p className={`mt-6 max-w-lg leading-relaxed ${c("text-[1rem]", "text-[1.2rem]")}`} style={{ color: p.muted }}>
              {model.subhead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn model={model} radius={6}>{model.cta.label}</Btn>
              {model.secondaryCta && <Btn model={model} kind="ghost" radius={6}>{model.secondaryCta.label}</Btn>}
            </div>
          </div>
        </div>
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

      <section className={`${pad} ${c("pb-10", "pb-20")}`}>
        <div className={`grid gap-4 ${c("grid-cols-2", "grid-cols-12")}`}>
          <Photo model={model} i={1} className={c("col-span-2 aspect-[16/10]", "col-span-7 aspect-[16/11]")} style={{ borderRadius: 6 }} />
          <div className={c("col-span-2 grid grid-cols-2 gap-4", "col-span-5 grid grid-rows-2 gap-4")}>
            <Photo model={model} i={2} size="md" className={c("aspect-square", "")} style={{ borderRadius: 6 }} />
            <Photo model={model} i={3} size="md" className={c("aspect-square", "")} style={{ borderRadius: 6 }} />
          </div>
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
            <AreaMap model={model} className="mt-8 aspect-[16/9]" style={{ borderRadius: 6 }} />
          </div>
          <div className={c("", "col-span-5 col-start-8")}>
            <EnquiryForm model={model} head={head} radius={8} title="Request a quote" fields={[{ label: "Name" }, { label: "Phone" }, { label: "Email", wide: true }, { label: "What needs doing?", wide: true, tall: true }]} button="Send enquiry" />
          </div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} dark={false} />
    </div>
  );
}
