import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/600.css";
import { AreaMap, AreasList, Btn, ContactList, EnquiryForm, FooterCols, Header, Steps, TopBar, ctaHeading, tokens, type TProps } from "./kit";

/** Garages & mobile mechanics: condensed capitals, a hard black-and-colour hero with the quote form, price-list style services and a mobile/workshop split. */
export default function Mechanic({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Barlow Condensed', 'Arial Narrow', sans-serif", body: "Barlow, Inter, system-ui, sans-serif", headWeight: 800, headTracking: "0.01em", headCase: "uppercase", btn: 4, card: 4 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[2.2rem] leading-none", "text-[3.4rem] leading-none");

  return (
    <div style={t.root}>
      <TopBar model={model} compact={compact} pad={pad} dark />
      <Header model={model} compact={compact} pad={pad} head={head} radius={4} logoFont="'Barlow Condensed', sans-serif" upper />

      <section className={`relative overflow-hidden ${pad} ${c("py-10", "py-20")} ${c("", "grid grid-cols-12 items-center gap-10")}`} style={{ background: p.ink, color: p.bg }}>
        <span className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] sm:block" style={{ background: p.accent, clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)", opacity: 0.95 }} aria-hidden="true" />
        <div className={`relative ${c("", "col-span-7")}`}>
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
        <div className={`relative ${c("mt-8", "col-span-5")}`}>
          <EnquiryForm model={model} head={head} radius={4} title="Get a quote" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "Car make, model and reg", wide: true }, { label: "What's wrong?", wide: true, tall: true }]} button="Send" />
        </div>
      </section>

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
          { title: "We come to you", text: "Mobile visits at home or at work, so the car doesn't have to move." },
          { title: "Or bring it in", text: "Drop the car at the workshop and we'll get to work." },
        ].map((b, k) => (
          <div key={b.title} className={`${pad} ${c("py-10", "py-16")}`} style={{ background: k ? p.ink : p.accent, color: k ? p.bg : p.accentInk }}>
            <h3 className="text-[2.4rem] leading-none" style={{ ...head, color: "inherit" }}>
              {b.title}
            </h3>
            <p className="mt-3 max-w-sm text-[1.05rem]">{b.text}</p>
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
          <div className={c("", "col-span-5")}>
            <h2 className={h2} style={head}>
              {ctaHeading(model)}
            </h2>
            <p className="mt-4 max-w-md text-[1.05rem]" style={{ color: p.muted }}>
              {model.aboutBody}
            </p>
            <div className="mt-6">
              <ContactList model={model} />
            </div>
            <p className="mt-8 text-[0.9rem] font-bold uppercase tracking-widest" style={{ color: p.accentText }}>
              Areas covered
            </p>
            <div className="mt-1">
              <AreasList model={model} head={head} />
            </div>
          </div>
          <AreaMap model={model} className={c("aspect-[4/3]", "col-span-7 aspect-[16/11]")} style={{ borderRadius: 4 }} />
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
