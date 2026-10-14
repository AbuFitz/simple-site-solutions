import "@fontsource-variable/manrope";
import { ArrowRight } from "lucide-react";
import { AreaMap, AreasList, Btn, Chip, ContactList, FooterCols, Header, Kicker, TopBar, ctaHeading, patterns, tokens, type TProps } from "./kit";

/** Plumbers & heating: a "what's the problem?" triage hero, big service rows and a pipe-line process. Phone first. */
export default function Plumbing({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Manrope Variable', Inter, sans-serif", body: "Inter, system-ui, sans-serif", headWeight: 800, headTracking: "-0.035em", btn: 10, card: 16 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.8rem] leading-tight", "text-[2.6rem] leading-[1.05]");

  return (
    <div style={t.root}>
      <TopBar model={model} compact={compact} pad={pad} />
      <Header model={model} compact={compact} pad={pad} head={head} radius={10} />

      <section className={`relative overflow-hidden ${pad} ${c("pb-10 pt-9", "pb-20 pt-16")}`} style={{ background: `${patterns.rings(`${p.accent}22`)}, ${p.surface}` }}>
        <div className={c("", "grid grid-cols-12 items-center gap-12")}>
          <div className={c("", "col-span-7")}>
            <Kicker color={p.accentText}>
              {model.category.label}
              {model.town ? ` · ${model.town}` : ""}
            </Kicker>
            <h2 className={`mt-4 ${c("text-[2.4rem] leading-[1.04]", "text-[4.3rem] leading-[0.98]")}`} style={head}>
              {model.headline}
            </h2>
            <p className={`mt-5 max-w-xl leading-relaxed ${c("text-[1rem]", "text-[1.2rem]")}`} style={{ color: p.muted }}>
              {model.subhead}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn model={model} radius={10}>{model.cta.label}</Btn>
              {model.secondaryCta && (
                <Btn model={model} kind="ghost" radius={10}>
                  {model.secondaryCta.label}
                </Btn>
              )}
            </div>
          </div>
          <div className={`p-6 ${c("mt-9", "col-span-5")}`} style={{ background: p.bg, borderRadius: 20, boxShadow: `0 24px 50px -24px ${p.ink}55, inset 0 0 0 1px ${p.ink}14` }}>
            <p className="text-[1.25rem]" style={head}>
              What do you need help with?
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {model.services.slice(0, 5).map((s, i) => (
                <Chip key={s.title} fg={i === 0 ? p.accentInk : p.ink} bg={i === 0 ? p.accent : undefined} ring={i === 0 ? undefined : `${p.ink}33`} size="sm">
                  {s.title}
                </Chip>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {["Your name", "Phone"].map((l) => (
                <div key={l}>
                  <div className="mb-1 text-[0.75rem] font-semibold" style={{ color: p.muted }}>{l}</div>
                  <div className="h-10" style={{ background: p.surface, borderRadius: 8, boxShadow: `inset 0 0 0 1px ${p.ink}2b` }} />
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Btn model={model} radius={10}>Send request</Btn>
            </div>
          </div>
        </div>
      </section>

      <section className={`${pad} ${y}`}>
        <div className={c("", "grid grid-cols-12 gap-12")}>
          <div className={c("mb-6", "col-span-4")}>
            <Kicker color={p.accentText}>What we do</Kicker>
            <h2 className={`mt-3 ${h2}`} style={head}>Services, start to finish</h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed" style={{ color: p.muted }}>{model.aboutBody}</p>
          </div>
          <ul className={c("", "col-span-8")}>
            {model.services.map((s, i) => (
              <li key={s.title + i} className="flex items-center gap-5 py-5" style={{ borderTop: `1.5px solid ${p.ink}1f` }}>
                <span className="w-8 shrink-0 text-[0.9rem] font-bold tabular-nums" style={{ color: p.accentText }}>{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <h3 className={c("text-[1.15rem]", "text-[1.45rem]")} style={head}>{s.title}</h3>
                  <p className="mt-1 text-[0.95rem]" style={{ color: p.muted }}>{s.blurb}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0" style={{ color: p.accentText }} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${pad} ${c("py-10", "py-14")}`} style={{ background: p.ink, color: p.bg }}>
        <div className={`flex ${c("flex-col gap-5", "items-center justify-between gap-8")}`}>
          <div>
            <p className={c("text-[1.5rem]", "text-[2.3rem]")} style={{ ...head, color: p.bg }}>Something not right at home?</p>
            <p className={`mt-2 ${c("text-[1.6rem]", "text-[2.2rem]")}`} style={{ ...head, color: p.accent }}>{model.contact.phone ?? "Give us a call"}</p>
          </div>
          <Btn model={model} radius={10}>{model.cta.label}</Btn>
        </div>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface }}>
        <Kicker color={p.accentText}>How it works</Kicker>
        <h2 className={`mt-3 ${h2}`} style={head}>Three steps to sorted</h2>
        <ol className={`relative mt-10 grid gap-8 ${c("grid-cols-1", "grid-cols-3")}`}>
          {!compact && <span className="absolute left-0 right-0 top-[19px] h-[3px]" style={{ background: `repeating-linear-gradient(90deg, ${p.accent} 0 14px, transparent 14px 22px)` }} aria-hidden="true" />}
          {model.steps.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-[1rem] font-bold" style={{ background: p.accent, color: p.accentInk, boxShadow: `0 0 0 8px ${p.surface}` }}>{i + 1}</span>
              <h3 className="mt-4 text-[1.2rem]" style={head}>{s.title}</h3>
              <p className="mt-1 text-[0.95rem] leading-relaxed" style={{ color: p.muted }}>{s.blurb}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 items-center gap-12")}`}>
        <div className={c("mb-8", "col-span-5")}>
          <Kicker color={p.accentText}>Areas we cover</Kicker>
          <div className="mt-4"><AreasList model={model} head={head} /></div>
        </div>
        <AreaMap model={model} className={c("aspect-[4/3]", "col-span-7 aspect-[16/10]")} style={{ borderRadius: 16 }} />
      </section>

      <section id="contact" className={`${pad} ${y}`} style={{ background: p.accent, color: p.accentInk }}>
        <div className={`grid items-center gap-8 ${c("grid-cols-1", "grid-cols-12")}`}>
          <div className={c("", "col-span-7")}>
            <h2 className={c("text-[2rem] leading-tight", "text-[3rem] leading-none")} style={{ ...head, color: p.accentInk }}>{ctaHeading(model)}</h2>
            <p className="mt-3 text-[1.05rem]">Tell us what's happening and we'll arrange a visit.</p>
          </div>
          <div className={c("", "col-span-5")}><ContactList model={model} onDark /></div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
