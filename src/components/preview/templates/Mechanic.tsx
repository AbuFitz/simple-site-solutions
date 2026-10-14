import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/600.css";
import { AreaMap, Btn, ContactList, EnquiryForm, FooterCols, Header, Photo, Steps, TopBar, ctaHeading, tokens, type TProps } from "./kit";

/** Garages & mobile mechanics: condensed capitals, a hard black-and-colour hero, a visible price-list style service list and a mobile/workshop split. */
export default function Mechanic({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Barlow Condensed', 'Arial Narrow', sans-serif", body: "Barlow, Inter, system-ui, sans-serif", headWeight: 800, headTracking: "0.01em", headCase: "uppercase", btn: 4, card: 4 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[2.2rem] leading-none", "text-[3.4rem] leading-none");

  return (
    <div style={t.root}>
      <TopBar model={model} compact={compact} pad={pad} dark />
      <Header model={model} compact={compact} pad={pad} head={head} radius={4} logoFont="'Barlow Condensed', sans-serif" upper />

      <section className={c("", "grid grid-cols-12")} style={{ background: p.ink, color: p.bg }}>
        <div className={`${pad} ${c("py-10", "col-span-7 py-20")}`}>
          <h2 className={c("text-[3.1rem] leading-[0.92]", "text-[6rem] leading-[0.88]")} style={{ ...head, color: p.bg }}>
            {model.headline}
          </h2>
          <p className={`mt-6 max-w-lg leading-relaxed opacity-85 ${c("text-[1.02rem]", "text-[1.2rem]")}`}>{model.subhead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn model={model} radius={4}>{model.cta.label}</Btn>
            {model.secondaryCta && (
              <Btn model={model} kind="ghost" radius={4} style={{ color: p.bg }}>
                {model.secondaryCta.label}
              </Btn>
            )}
          </div>
        </div>
        <Photo model={model} i={0} className={c("aspect-[4/3]", "col-span-5")} style={{ clipPath: c("none", "polygon(12% 0, 100% 0, 100% 100%, 0 100%)") }} />
      </section>
      <div className={`flex ${c("flex-col gap-1", "items-center gap-10")} py-4 ${pad}`} style={{ background: p.accent, color: p.accentInk }}>
        {model.services.slice(0, 4).map((s) => (
          <span key={s.title} className="text-[1.1rem] uppercase tracking-wider" style={head}>
            {s.title}
          </span>
        ))}
      </div>

      <section className={`${pad} ${y}`}>
        <h2 className={h2} style={head}>
          What we do
        </h2>
        <ul className="mt-8">
          {model.services.map((s, i) => (
            <li key={s.title + i} className={`flex items-baseline gap-5 py-5 ${c("flex-wrap", "")}`} style={{ borderTop: `2px solid ${p.ink}` }}>
              <span className="w-10 text-[1.3rem]" style={{ ...head, color: p.accentText }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[1.7rem] leading-none" style={head}>
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[1rem]" style={{ color: p.muted }}>
                  {s.blurb}
                </p>
              </div>
              <span className="text-[0.85rem] font-semibold uppercase tracking-widest" style={{ color: p.muted }}>
                Quote on request
              </span>
            </li>
          ))}
          <li style={{ borderTop: `2px solid ${p.ink}` }} />
        </ul>
      </section>

      <section className={`grid ${c("grid-cols-1", "grid-cols-2")}`}>
        {[
          { title: "We come to you", text: "Mobile visits at home or at work, so the car doesn't have to move.", i: 1 },
          { title: "Or bring it in", text: "Drop the car at the workshop and we'll get to work.", i: 2 },
        ].map((b, k) => (
          <div key={b.title} className="relative" style={{ minHeight: c(250, 340) }}>
            <Photo model={model} i={b.i} size="md" className="absolute inset-0" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${k ? p.ink : p.accent}f0, ${k ? p.ink : p.accent}55 65%, transparent)` }} />
            <div className={`relative flex h-full flex-col justify-end ${pad} py-8`} style={{ color: k ? p.bg : p.accentInk, minHeight: c(250, 340) }}>
              <h3 className="text-[2.3rem] leading-none" style={{ ...head, color: "inherit" }}>
                {b.title}
              </h3>
              <p className="mt-2 max-w-sm text-[1rem]">{b.text}</p>
            </div>
          </div>
        ))}
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
            <p className="mt-4 max-w-md text-[1.05rem]" style={{ color: p.muted }}>
              {model.aboutBody}
            </p>
            <div className="mt-6">
              <ContactList model={model} />
            </div>
            <AreaMap model={model} className="mt-8 aspect-[16/9]" style={{ borderRadius: 4 }} />
          </div>
          <div className={c("", "col-span-5 col-start-8")}>
            <EnquiryForm model={model} head={head} radius={4} title="Get a quote" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "Car make, model and reg", wide: true }, { label: "What's wrong?", wide: true, tall: true }]} button="Send" />
          </div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
