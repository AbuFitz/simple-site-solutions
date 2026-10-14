import "@fontsource-variable/nunito";
import { Check } from "lucide-react";
import { AreaMap, AreasList, Btn, Chip, ContactList, EnquiryForm, FooterCols, Header, Kicker, ctaHeading, swipe, tokens, type TProps } from "./kit";

/** Cleaners: soft, round and friendly. Bubble hero, a "choose your clean" picker, a room-by-room checklist and pill-shaped services. */
export default function Cleaning({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Nunito Variable', Inter, sans-serif", body: "'Nunito Variable', Inter, system-ui, sans-serif", headWeight: 800, headTracking: "-0.02em", btn: 999, card: 28 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.9rem] leading-tight", "text-[2.7rem] leading-[1.05]");
  const bubble = (size: number, x: string, yy: string, a: string) => <span className="absolute rounded-full" style={{ width: size, height: size, left: x, top: yy, background: `${p.accent}${a}` }} aria-hidden="true" />;

  return (
    <div style={t.root}>
      <Header model={model} compact={compact} pad={pad} head={head} radius={999} />

      <section className={`relative overflow-hidden ${pad} ${c("pb-14 pt-8", "pb-24 pt-14")}`} style={{ background: `linear-gradient(180deg, ${p.surface}, ${p.bg})` }}>
        {bubble(compact ? 140 : 300, compact ? "70%" : "78%", "-4%", "1f")}
        {bubble(compact ? 60 : 120, compact ? "-6%" : "56%", compact ? "70%" : "62%", "26")}
        {bubble(compact ? 36 : 64, "88%", "78%", "33")}
        <div className={`relative ${c("", "grid grid-cols-12 items-center gap-12")}`}>
          <div className={c("", "col-span-7")}>
            <Chip bg={`${p.accent}1f`} fg={p.accentText} size="sm">
              {model.category.label}
              {model.town ? ` · ${model.town}` : ""}
            </Chip>
            <h2 className={`mt-5 ${c("text-[2.5rem] leading-[1.03]", "text-[4.4rem] leading-[1]")}`} style={head}>
              <span style={swipe(`${p.accent}40`)}>{model.headline}</span>
            </h2>
            <p className={`mt-5 max-w-xl leading-relaxed ${c("text-[1.02rem]", "text-[1.2rem]")}`} style={{ color: p.muted }}>{model.subhead}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn model={model} radius={999}>{model.cta.label}</Btn>
              {model.secondaryCta && <Btn model={model} kind="ghost" radius={999}>{model.secondaryCta.label}</Btn>}
            </div>
          </div>
          <div className={`p-7 ${c("mt-9", "col-span-5")}`} style={{ background: p.bg, borderRadius: 32, boxShadow: `0 28px 60px -30px ${p.accent}88, inset 0 0 0 1px ${p.ink}10` }}>
            <p className="text-[1.3rem]" style={head}>A typical visit includes</p>
            <ul className="mt-4 space-y-3 text-[1rem]">
              {["Kitchen surfaces and appliances", "Bathrooms and toilets", "Floors vacuumed and mopped", "Dusting and wiping down", "Bins emptied"].map((l) => (
                <li key={l} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: p.accent, color: p.accentInk }}><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>
                  {l}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.85rem]" style={{ color: p.muted }}>We agree the checklist with you first.</p>
          </div>
        </div>
      </section>

      <section className={`${pad} ${y}`}>
        <div className="text-center">
          <Kicker color={p.accentText}>Choose your clean</Kicker>
          <h2 className={`mt-3 ${h2}`} style={head}>Whatever needs freshening up</h2>
        </div>
        <ul className={`mt-10 grid gap-5 ${c("grid-cols-1", "grid-cols-3")}`}>
          {model.services.slice(0, 3).map((s, i) => (
            <li key={s.title} className="p-7 text-center" style={{ background: i === 1 ? p.accent : p.surface, color: i === 1 ? p.accentInk : p.ink, borderRadius: 28, boxShadow: i === 1 ? undefined : `inset 0 0 0 1.5px ${p.ink}14` }}>
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-[1.2rem] font-extrabold" style={{ background: i === 1 ? `${p.accentInk}22` : `${p.accent}22`, color: i === 1 ? p.accentInk : p.accentText }}>{i + 1}</span>
              <h3 className="mt-4 text-[1.3rem]" style={{ ...head, color: i === 1 ? p.accentInk : p.ink }}>{s.title}</h3>
              <p className="mt-2 text-[0.97rem] leading-relaxed" style={{ color: i === 1 ? p.accentInk : p.muted }}>{s.blurb}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {model.services.slice(3).map((s) => (
            <Chip key={s.title} bg={p.surface} fg={p.ink} ring={`${p.ink}1f`}>{s.title}</Chip>
          ))}
        </div>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface, borderRadius: compact ? "32px 32px 0 0" : "56px 56px 0 0" }}>
        <h2 className={`text-center ${h2}`} style={head}>How it works</h2>
        <ol className={`mt-10 grid gap-8 ${c("grid-cols-1", "grid-cols-3")}`}>
          {model.steps.map((s, i) => (
            <li key={s.title} className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[1.7rem] font-extrabold" style={{ background: p.accent, color: p.accentInk }}>{i + 1}</span>
              <h3 className="mt-4 text-[1.2rem]" style={head}>{s.title}</h3>
              <p className="mx-auto mt-1 max-w-xs text-[0.97rem]" style={{ color: p.muted }}>{s.blurb}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" className={`${pad} ${y} ${c("", "grid grid-cols-12 gap-10")}`} style={{ background: p.surface }}>
        <div className={c("mb-8", "col-span-5")}>
          <h2 className={h2} style={head}>{ctaHeading(model)}</h2>
          <p className="mb-5 mt-3 text-[1.02rem] leading-relaxed" style={{ color: p.muted }}>{model.aboutBody}</p>
          <ContactList model={model} />
          <div className="mt-5"><Kicker color={p.accentText}>Areas we cover</Kicker><div className="mt-2"><AreasList model={model} head={head} /></div></div>
          <AreaMap model={model} className="mt-6 aspect-[16/10]" style={{ borderRadius: 24 }} />
        </div>
        <div className={c("", "col-span-7")}>
          <EnquiryForm model={model} head={head} radius={24} title="Ask for a quote" fields={[{ label: "Your name" }, { label: "Phone" }, { label: "Postcode", wide: true }, { label: "Tell us about your home or office", wide: true, tall: true }]} button="Request a quote" />
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
