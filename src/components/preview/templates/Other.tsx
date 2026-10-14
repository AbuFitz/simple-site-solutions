import "@fontsource-variable/plus-jakarta-sans";
import { AreaMap, AreasList, Btn, Chip, ContactList, EnquiryForm, FooterCols, Header, Kicker, ctaHeading, patterns, swipe, tokens, type TProps } from "./kit";

/** Any other local business: a modern bento layout. Centred hero, a mixed-size services grid, an about band and a contact card beside the map. */
export default function Other({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Plus Jakarta Sans Variable', Inter, sans-serif", body: "'Plus Jakarta Sans Variable', Inter, system-ui, sans-serif", headWeight: 800, headTracking: "-0.04em", btn: 14, card: 24 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.9rem] leading-tight", "text-[2.7rem] leading-[1.05]");
  const n = model.services.length;
  const span = (i: number) => {
    if (compact) return "";
    if (i === 0 && n > 1) return "col-span-2 row-span-2";
    if (i === n - 1 && n === 4) return "col-span-2";
    if (i === n - 1 && n === 6) return "col-span-4";
    return "";
  };

  return (
    <div style={t.root}>
      <Header model={model} compact={compact} pad={pad} head={head} radius={14} />

      <section className={`${pad} text-center ${c("pb-12 pt-12", "pb-24 pt-24")}`} style={{ background: `${patterns.dots(`${p.ink}1c`, 26)}, ${p.bg}` }}>
        <Chip bg={p.surface} fg={p.ink} ring={`${p.ink}1f`} size="sm">
          {model.category.label}
          {model.town ? ` · ${model.town}` : ""}
        </Chip>
        <h2 className={`mx-auto mt-6 ${c("text-[2.7rem] leading-[1.02]", "text-[5.4rem] leading-[0.96]")}`} style={{ ...head, maxWidth: "58rem" }}>
          <span style={swipe(`${p.accent}55`)}>{model.headline}</span>
        </h2>
        <p className={`mx-auto mt-6 max-w-xl leading-relaxed ${c("text-[1.02rem]", "text-[1.2rem]")}`} style={{ color: p.muted }}>{model.subhead}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Btn model={model} radius={14}>{model.cta.label}</Btn>
          {model.secondaryCta && <Btn model={model} kind="ghost" radius={14}>{model.secondaryCta.label}</Btn>}
        </div>
      </section>

      <section className={`${pad} ${y}`}>
        <Kicker color={p.accentText}>What we do</Kicker>
        <h2 className={`mt-3 ${h2}`} style={head}>Our services</h2>
        <ul className={`mt-10 grid gap-4 ${c("grid-cols-1", "auto-rows-[10.5rem] grid-cols-4")}`}>
          {model.services.map((s, i) => {
            const feature = i === 0 && !compact && n > 1;
            return (
              <li key={s.title + i} className={`flex flex-col justify-between p-6 ${span(i)}`} style={{ background: feature ? p.accent : i === 3 ? p.ink : p.surface, color: feature ? p.accentInk : i === 3 ? p.bg : p.ink, borderRadius: 24, boxShadow: feature || i === 3 ? undefined : `inset 0 0 0 1px ${p.ink}14` }}>
                <span className="text-[0.85rem] font-bold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={feature ? "text-[2rem] leading-[1.05]" : "text-[1.3rem] leading-[1.1]"} style={{ ...head, color: feature ? p.accentInk : i === 3 ? p.bg : p.ink }}>{s.title}</h3>
                  <p className="mt-1.5 text-[0.93rem] leading-relaxed">{s.blurb}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface }}>
        <div className={c("", "grid grid-cols-12 gap-12")}>
          <div className={c("mb-8", "col-span-5")}>
            <Kicker color={p.accentText}>{model.aboutHeading}</Kicker>
            <h2 className={`mt-3 ${h2}`} style={head}>A little about us</h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed" style={{ color: p.muted }}>{model.aboutBody}</p>
          </div>
          <ol className={`grid gap-4 ${c("grid-cols-1", "col-span-7 grid-cols-3")}`}>
            {model.steps.map((s, i) => (
              <li key={s.title} className="p-6" style={{ background: p.bg, borderRadius: 20 }}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-[1rem] font-extrabold" style={{ background: p.accent, color: p.accentInk }}>{i + 1}</span>
                <h3 className="mt-4 text-[1.15rem]" style={head}>{s.title}</h3>
                <p className="mt-1 text-[0.93rem] leading-relaxed" style={{ color: p.muted }}>{s.blurb}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className={`${pad} ${y} ${c("", "grid grid-cols-12 gap-6")}`}>
        <div className={`p-8 ${c("mb-5", "col-span-5")}`} style={{ background: p.ink, color: p.bg, borderRadius: 28 }}>
          <h2 className={c("text-[1.9rem] leading-tight", "text-[2.4rem] leading-[1.05]")} style={{ ...head, color: p.bg }}>{ctaHeading(model)}</h2>
          <p className={`my-4 ${c("text-[1.5rem]", "text-[1.9rem]")}`} style={{ ...head, color: p.accent }}>{model.contact.phone ?? "Get in touch"}</p>
          <ContactList model={model} onDark />
          <div className="mt-5"><AreasList model={model} head={head} onDark /></div>
        </div>
        <div className={`space-y-4 ${c("", "col-span-7")}`}>
          <AreaMap model={model} className="aspect-[16/8]" style={{ borderRadius: 24 }} />
          <EnquiryForm model={model} head={head} radius={24} title="Send us a message" fields={[{ label: "Your name" }, { label: "Phone or email" }, { label: "How can we help?", wide: true, tall: true }]} button="Send message" />
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
