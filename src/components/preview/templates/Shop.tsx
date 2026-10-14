import "@fontsource-variable/dm-sans";
import { ArrowUpRight, Search } from "lucide-react";
import { AreaMap, AreasList, Btn, ContactList, FooterCols, Kicker, Soft, ctaHeading, patterns, tokens, type TProps } from "./kit";

/** Independent shops: a storefront. Announcement bar, search header, a colour-block hero and department tiles in big type, then a map-led "visit us". */
export default function Shop({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'DM Sans Variable', Inter, sans-serif", body: "'DM Sans Variable', Inter, system-ui, sans-serif", headWeight: 800, headTracking: "-0.04em", btn: 999, card: 20 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.9rem] leading-tight", "text-[2.7rem] leading-[1.05]");
  const tile = (i: number) => {
    const set = [
      { bg: p.accent, fg: p.accentInk, sub: p.accentInk },
      { bg: p.ink, fg: p.bg, sub: `${p.bg}cc` },
      { bg: `${p.accent}26`, fg: p.ink, sub: p.muted },
      { bg: p.surface, fg: p.ink, sub: p.muted },
    ];
    return set[i % 4];
  };

  return (
    <div style={t.root}>
      <div className={`py-2 text-center text-[0.8rem] font-semibold ${pad}`} style={{ background: p.ink, color: p.bg }}>
        {model.contact.town ? `Your local shop in ${model.contact.town}` : "Your local shop"}
      </div>
      <header className={`flex items-center justify-between gap-5 py-4 ${pad}`} style={{ borderBottom: `1px solid ${p.ink}1a` }}>
        <span className="truncate text-[1.4rem]" style={head}>{model.name}</span>
        {!compact && (
          <div className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2.5 text-[0.9rem]" style={{ background: p.surface, borderRadius: 999, color: p.muted, boxShadow: `inset 0 0 0 1px ${p.ink}1f`, maxWidth: "26rem" }}>
            <Search className="h-4 w-4" aria-hidden="true" /> Search the shop
          </div>
        )}
        {!compact ? (
          <nav className="flex items-center gap-7 text-[0.92rem] font-semibold" aria-label="Preview navigation">
            {model.nav.map((n) => <span key={n}>{n}</span>)}
          </nav>
        ) : (
          <span className="block h-0.5 w-6" style={{ background: p.ink, boxShadow: `0 6px 0 ${p.ink}, 0 -6px 0 ${p.ink}` }} aria-hidden="true" />
        )}
      </header>

      <section className={`${pad} ${c("py-6", "py-10")}`}>
        <div className={`grid gap-4 ${c("grid-cols-1", "grid-cols-12")}`}>
          <div className={`relative overflow-hidden p-8 ${c("", "col-span-8 flex min-h-[27rem] flex-col justify-end p-12")}`} style={{ background: `${patterns.dots(`${p.accentInk}33`, 20)}, ${p.accent}`, color: p.accentInk, borderRadius: 28 }}>
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.16em]">{model.category.label}{model.town ? ` · ${model.town}` : ""}</p>
            <h2 className={`mt-4 ${c("text-[2.4rem] leading-[1]", "text-[4.6rem] leading-[0.95]")}`} style={{ ...head, color: p.accentInk }}>{model.headline}</h2>
            <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed">{model.subhead}</p>
            <div className="mt-6"><Btn model={model} kind="ink" radius={999}>{model.cta.label}</Btn></div>
          </div>
          <div className={`grid gap-4 ${c("grid-cols-2", "col-span-4 grid-rows-2")}`}>
            {model.services.slice(0, 2).map((s, i) => {
              const k = tile(i + 1);
              return (
                <div key={s.title} className="flex flex-col justify-between p-6" style={{ background: k.bg, color: k.fg, borderRadius: 28, minHeight: compact ? 150 : undefined }}>
                  <ArrowUpRight className="h-6 w-6 self-end" aria-hidden="true" />
                  <p className="text-[1.5rem] leading-[1.05]" style={{ ...head, color: k.fg }}>{s.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${pad} ${y}`}>
        <div className="flex items-end justify-between gap-6">
          <div>
            <Kicker color={p.accentText}>Shop by department</Kicker>
            <h2 className={`mt-3 ${h2}`} style={head}>Find what you came for</h2>
          </div>
        </div>
        <ul className={`mt-8 grid gap-4 ${c("grid-cols-1", "grid-cols-3")}`}>
          {model.services.map((s, i) => {
            const k = tile(i + 2);
            return (
              <li key={s.title + i} className="flex min-h-[11rem] flex-col justify-between p-6" style={{ background: k.bg, color: k.fg, borderRadius: 24, boxShadow: k.bg === p.surface ? `inset 0 0 0 1px ${p.ink}1a` : undefined }}>
                <div className="flex items-start justify-between">
                  <span className="text-[0.85rem] font-bold tabular-nums" style={{ color: k.sub }}>{String(i + 1).padStart(2, "0")}</span>
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[1.5rem] leading-[1.05]" style={{ ...head, color: k.fg }}>{s.title}</h3>
                  <p className="mt-1.5 text-[0.93rem]" style={{ color: k.sub }}>{s.blurb}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface }}>
        <div className={c("", "grid grid-cols-12 gap-12")}>
          <div className={c("mb-8", "col-span-4")}>
            <Kicker color={p.accentText}>{model.aboutHeading}</Kicker>
            <h2 className={`mt-3 ${h2}`} style={head}>How shopping with us works</h2>
          </div>
          <ol className={`grid gap-4 ${c("grid-cols-1", "col-span-8 grid-cols-3")}`}>
            {model.steps.map((s, i) => (
              <li key={s.title} className="p-6" style={{ background: p.bg, borderRadius: 20 }}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-[1rem] font-bold" style={{ background: p.ink, color: p.bg }}>{i + 1}</span>
                <h3 className="mt-4 text-[1.2rem]" style={head}>{s.title}</h3>
                <p className="mt-1 text-[0.93rem] leading-relaxed" style={{ color: p.muted }}>{s.blurb}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className={`${pad} ${y} ${c("", "grid grid-cols-12 gap-10")}`}>
        <div className={c("mb-8", "col-span-5")}>
          <h2 className={h2} style={head}>{ctaHeading(model)}</h2>
          <p className="mb-5 mt-3 text-[1.02rem]" style={{ color: p.muted }}>{model.aboutBody}</p>
          <ContactList model={model} />
          <p className="mt-5 text-[0.95rem]"><Soft p={p}>Your opening times</Soft></p>
          <div className="mt-5"><AreasList model={model} head={head} /></div>
        </div>
        <AreaMap model={model} className={c("aspect-[4/3]", "col-span-7 min-h-[24rem]")} style={{ borderRadius: 24 }} />
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
