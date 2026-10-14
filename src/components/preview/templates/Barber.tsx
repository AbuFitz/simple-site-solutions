import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import { AreaMap, Btn, ContactList, FooterCols, Photo, ctaHeading, tokens, type TProps } from "./kit";

/** Barbers & salons: dark and editorial. Centred serif identity, full-bleed photography, a clean services menu and a find-us block. */
export default function Barber({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'Playfair Display', Georgia, serif", body: "Inter, system-ui, sans-serif", headWeight: 700, headTracking: "-0.01em", btn: 2, card: 2 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.9rem] leading-tight", "text-[2.8rem] leading-tight");
  const rule = <span className="mx-auto mt-5 block h-px w-16" style={{ background: p.accent }} aria-hidden="true" />;

  return (
    <div style={t.root}>
      <header className={`flex items-center justify-between py-6 ${pad}`}>
        {!compact ? (
          <nav className="flex w-1/3 gap-7 text-[0.78rem] font-semibold uppercase tracking-[0.2em]" style={{ color: p.muted }} aria-label="Preview navigation">
            {model.nav.slice(0, 2).map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
        ) : (
          <span className="w-8" />
        )}
        <span className={`text-center ${c("text-[1.3rem]", "text-[1.7rem]")}`} style={head}>
          {model.name}
        </span>
        {!compact ? (
          <nav className="flex w-1/3 justify-end gap-7 text-[0.78rem] font-semibold uppercase tracking-[0.2em]" style={{ color: p.muted }}>
            {model.nav.slice(2).map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>
        ) : (
          <span className="block h-0.5 w-6" style={{ background: p.ink, boxShadow: `0 6px 0 ${p.ink}, 0 -6px 0 ${p.ink}` }} aria-hidden="true" />
        )}
      </header>

      <section className="relative" style={{ minHeight: c(520, 640) }}>
        <Photo model={model} i={0} className="absolute inset-0" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${p.bg} 0%, ${p.bg}99 30%, ${p.bg}55 100%)` }} />
        <div className={`relative flex flex-col items-center justify-end text-center ${pad} ${c("pb-12 pt-40", "pb-20 pt-64")}`} style={{ minHeight: c(520, 640) }}>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.3em]" style={{ color: p.accent }}>
            {model.category.label}
            {model.town ? ` · ${model.town}` : ""}
          </p>
          <h2 className={`mt-5 ${c("text-[2.3rem] leading-[1.08]", "text-[4.2rem] leading-[1.04]")}`} style={{ ...head, maxWidth: "46rem" }}>
            {model.headline}
          </h2>
          <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed" style={{ color: p.muted }}>
            {model.subhead}
          </p>
          <div className="mt-8">
            <Btn model={model} radius={2}>{model.cta.label}</Btn>
          </div>
        </div>
      </section>

      <section className={`${pad} ${y} text-center`}>
        <h2 className={h2} style={head}>
          Services
        </h2>
        {rule}
        <ul className={`mx-auto mt-10 grid max-w-4xl gap-x-16 gap-y-8 text-left ${c("grid-cols-1", "grid-cols-2")}`}>
          {model.services.map((s, i) => (
            <li key={s.title + i} className="pb-6" style={{ borderBottom: `1px solid ${p.ink}26` }}>
              <h3 className="text-[1.35rem]" style={head}>
                {s.title}
              </h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed" style={{ color: p.muted }}>
                {s.blurb}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Btn model={model} kind="ghost" radius={2}>
            {model.cta.label}
          </Btn>
        </div>
      </section>

      <section className={`grid ${c("grid-cols-2", "grid-cols-4")}`}>
        {[1, 2, 3, 0].map((i, k) => (
          <Photo key={k} model={model} i={i} size="md" className={c("aspect-square", "aspect-[4/5]")} />
        ))}
      </section>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 gap-14")}`} style={{ background: p.surface }}>
        <div className={c("mb-8", "col-span-5")}>
          <h2 className={h2} style={head}>
            {model.aboutHeading}
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed" style={{ color: p.muted }}>
            {model.aboutBody}
          </p>
        </div>
        <ol className={c("grid gap-5", "col-span-6 col-start-7 grid gap-6")}>
          {model.steps.map((s, i) => (
            <li key={s.title} className="flex gap-5 pb-5" style={{ borderBottom: `1px solid ${p.ink}22` }}>
              <span className="w-8 text-[1.4rem]" style={{ ...head, color: p.accent }}>
                {i + 1}
              </span>
              <div>
                <h3 className="text-[1.15rem]" style={head}>
                  {s.title}
                </h3>
                <p className="mt-1 text-[0.95rem]" style={{ color: p.muted }}>
                  {s.blurb}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="contact" className={`${pad} ${y}`}>
        <div className={`grid gap-10 ${c("grid-cols-1", "grid-cols-12")}`}>
          <div className={c("", "col-span-5")}>
            <h2 className={h2} style={head}>
              {ctaHeading(model)}
            </h2>
            <p className="mt-4 text-[1rem]" style={{ color: p.muted }}>
              Find us on the map and get in touch to book your visit.
            </p>
            <div className="mt-6">
              <ContactList model={model} />
            </div>
            <div className="mt-8">
              <Btn model={model} radius={2}>{model.cta.label}</Btn>
            </div>
          </div>
          <AreaMap model={model} className={c("aspect-[4/3]", "col-span-7 aspect-[16/10]")} style={{ borderRadius: 2 }} />
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} dark={false} />
    </div>
  );
}
