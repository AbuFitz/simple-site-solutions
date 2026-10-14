import "@fontsource/dm-serif-display/400.css";
import "@fontsource-variable/dm-sans";
import { Plus } from "lucide-react";
import { AreaMap, AreasList, Btn, Chip, ContactList, FooterCols, Kicker, ctaHeading, patterns, tokens, type TProps } from "./kit";

/** Builders & renovation: architectural and calm. A big serif over drawing-paper lines, a ruled index of work, a project-stage rail and a scoped enquiry. */
export default function Builder({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'DM Serif Display', Georgia, serif", body: "'DM Sans Variable', Inter, system-ui, sans-serif", headWeight: 400, headTracking: "-0.01em", btn: 0, card: 0 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[2.1rem] leading-[1.08]", "text-[3.2rem] leading-[1.04]");
  const rule = `${p.ink}${p.dark ? "40" : "2e"}`;

  return (
    <div style={t.root}>
      <header className={`flex items-center justify-between py-5 ${pad}`} style={{ borderBottom: `1px solid ${rule}` }}>
        <span className={c("text-[1.35rem]", "text-[1.7rem]")} style={head}>{model.name}</span>
        {!compact ? (
          <div className="flex items-center gap-9">
            <nav className="flex gap-8 text-[0.88rem] font-medium" style={{ color: p.muted }} aria-label="Preview navigation">
              {model.nav.map((n) => <span key={n}>{n}</span>)}
            </nav>
            <Btn model={model} radius={0}>{model.cta.label}</Btn>
          </div>
        ) : (
          <span className="block h-0.5 w-6" style={{ background: p.ink, boxShadow: `0 6px 0 ${p.ink}, 0 -6px 0 ${p.ink}` }} aria-hidden="true" />
        )}
      </header>

      <section className={`relative ${pad} ${c("pb-12 pt-10", "pb-24 pt-20")}`} style={{ background: `${patterns.grid(`${p.ink}${p.dark ? "12" : "0d"}`, 56)}, ${p.bg}` }}>
        <Kicker color={p.accentText}>
          {model.category.label}
          {model.town ? ` · ${model.town}` : ""}
        </Kicker>
        <h2 className={`mt-5 ${c("text-[2.9rem] leading-[1.02]", "text-[6.3rem] leading-[0.95]")}`} style={{ ...head, maxWidth: compact ? undefined : "58rem" }}>{model.headline}</h2>
        <div className={`mt-9 ${c("", "grid grid-cols-12 gap-12")}`}>
          <p className={`leading-relaxed ${c("text-[1.02rem]", "col-span-5 text-[1.2rem]")}`} style={{ color: p.muted }}>{model.subhead}</p>
          <div className={`flex flex-wrap items-start gap-3 ${c("mt-7", "col-span-7 justify-end")}`}>
            <Btn model={model} radius={0}>{model.cta.label}</Btn>
            {model.secondaryCta && <Btn model={model} kind="ghost" radius={0}>{model.secondaryCta.label}</Btn>}
          </div>
        </div>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface }}>
        <div className={c("", "grid grid-cols-12 gap-12")}>
          <div className={c("mb-8", "col-span-4")}>
            <Kicker color={p.accentText}>Our work</Kicker>
            <h2 className={`mt-3 ${h2}`} style={head}>What we build</h2>
            <p className="mt-4 text-[1rem] leading-relaxed" style={{ color: p.muted }}>{model.aboutBody}</p>
          </div>
          <ul className={c("", "col-span-8")} style={{ borderBottom: `1px solid ${rule}` }}>
            {model.services.map((s, i) => (
              <li key={s.title + i} className="grid items-baseline gap-x-6 py-5" style={{ borderTop: `1px solid ${rule}`, gridTemplateColumns: compact ? "1fr auto" : "3rem 1fr 1.2fr auto" }}>
                {!compact && <span className="text-[0.85rem] font-bold tabular-nums" style={{ color: p.accentText }}>{String(i + 1).padStart(2, "0")}</span>}
                <h3 className={c("text-[1.4rem]", "text-[1.85rem] leading-none")} style={head}>{s.title}</h3>
                <p className={`text-[0.95rem] ${c("order-3 col-span-2 mt-1", "")}`} style={{ color: p.muted }}>{s.blurb}</p>
                <Plus className="h-5 w-5" style={{ color: p.accentText }} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${pad} ${y}`}>
        <Kicker color={p.accentText}>{model.aboutHeading}</Kicker>
        <h2 className={`mt-3 ${h2}`} style={head}>How a project runs</h2>
        <ol className={`mt-12 grid ${c("gap-0", "grid-cols-3 gap-0")}`}>
          {model.steps.map((s, i) => (
            <li key={s.title} className={`relative ${c("pb-10 pl-10", "pr-10 pt-8")}`}>
              <span className={`absolute ${c("bottom-0 left-[7px] top-2 w-px", "left-0 right-0 top-[7px] h-px")}`} style={{ background: p.ink }} aria-hidden="true" />
              <span className={`absolute h-[15px] w-[15px] ${c("left-0 top-1", "left-0 top-0")}`} style={{ background: p.accent }} aria-hidden="true" />
              <p className="text-[3.4rem] leading-none" style={{ ...head, color: p.accentText }}>{i + 1}</p>
              <h3 className="mt-3 text-[1.35rem]" style={head}>{s.title}</h3>
              <p className="mt-1 text-[0.97rem] leading-relaxed" style={{ color: p.muted }}>{s.blurb}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" className={`${pad} ${y}`} style={{ background: p.ink, color: p.bg }}>
        <div className={c("", "grid grid-cols-12 gap-12")}>
          <div className={c("mb-8", "col-span-6")}>
            <h2 className={h2} style={{ ...head, color: p.bg }}>{ctaHeading(model)}</h2>
            <p className="mb-6 mt-3 max-w-md text-[1.02rem] leading-relaxed" style={{ color: `${p.bg}cc` }}>Tell us about the project and we'll arrange a visit to talk it through.</p>
            <ContactList model={model} onDark />
            <div className="mt-6"><AreasList model={model} head={head} onDark /></div>
          </div>
          <div className={`p-7 ${c("", "col-span-6")}`} style={{ background: p.bg, color: p.ink }}>
            <p className="text-[1.5rem]" style={head}>Project enquiry</p>
            <p className="mt-4 text-[0.72rem] font-bold uppercase tracking-[0.16em]" style={{ color: p.muted }}>Type of project</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {model.services.slice(0, 4).map((s, i) => <Chip key={s.title} size="sm" radius={0} bg={i === 0 ? p.ink : undefined} fg={i === 0 ? p.bg : p.ink} ring={i === 0 ? undefined : `${p.ink}40`}>{s.title}</Chip>)}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[["Your name", false], ["Phone", false], ["Site address or postcode", true], ["Tell us about the project", true]].map(([l, w], i) => (
                <div key={String(l)} className={w ? "col-span-2" : ""}>
                  <div className="mb-1 text-[0.72rem] font-semibold" style={{ color: p.muted }}>{l}</div>
                  <div className={i === 3 ? "h-20" : "h-10"} style={{ background: p.surface, boxShadow: `inset 0 0 0 1px ${p.ink}40` }} />
                </div>
              ))}
            </div>
            <div className="mt-5"><Btn model={model} radius={0}>Send enquiry</Btn></div>
          </div>
        </div>
      </section>
      <AreaMap model={model} className={c("aspect-[4/3]", "h-[22rem]")} style={{ borderRadius: 0 }} />
      <FooterCols model={model} compact={compact} head={head} dark={false} />
    </div>
  );
}
