import "@fontsource-variable/dm-sans";
import { Search, ShoppingBasket } from "lucide-react";
import { AreaMap, AreasList, Btn, ContactList, FooterCols, Logo, ctaHeading, tokens, type TProps } from "./kit";

/** Local shops: retail feel. Search and basket in the header, a banner, departments, and a visit-us block led by the map. */
export default function Shop({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'DM Sans Variable', Inter, sans-serif", body: "'DM Sans Variable', Inter, system-ui, sans-serif", headWeight: 700, headTracking: "-0.03em", btn: 6, card: 8 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.6rem] leading-tight", "text-[2.2rem] leading-tight");
  const tints = [p.surface, `${p.accent}22`, p.surface, `${p.accent}22`, p.surface, `${p.accent}22`];

  return (
    <div style={t.root}>
      <div className={`py-2 text-center text-[0.8rem] font-semibold ${pad}`} style={{ background: p.ink, color: p.bg }}>
        {model.contact.town ? `Your local shop in ${model.contact.town}` : "Your local shop"}
      </div>
      <header className={`flex items-center gap-5 py-4 ${pad}`} style={{ borderBottom: `1px solid ${p.ink}14` }}>
        <div className="flex items-center gap-3">
          <Logo model={model} radius={6} />
          {!compact && (
            <span className="text-[1.15rem]" style={head}>
              {model.name}
            </span>
          )}
        </div>
        {!compact && (
          <div className="ml-4 flex h-11 flex-1 items-center gap-3 px-4 text-[0.9rem]" style={{ background: p.surface, borderRadius: 6, boxShadow: `inset 0 0 0 1px ${p.ink}1f`, color: p.muted }}>
            <Search className="h-4 w-4" aria-hidden="true" />
            Search the shop
          </div>
        )}
        <div className="ml-auto flex items-center gap-5">
          {!compact && (
            <nav className="flex gap-5 text-[0.9rem] font-medium" style={{ color: p.muted }} aria-label="Preview navigation">
              {model.nav.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </nav>
          )}
          <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
        </div>
      </header>

      <section className={`${pad} ${c("py-12", "py-24")}`} style={{ background: p.accent, color: p.accentInk }}>
        <div style={{ maxWidth: "40rem" }}>
          <h2 className={c("text-[2.3rem] leading-[1.05]", "text-[4rem] leading-[1.02]")} style={{ ...head, color: "inherit" }}>
            {model.headline}
          </h2>
          <p className={`mt-5 leading-relaxed ${c("text-[1.02rem]", "text-[1.2rem]")}`} style={{ opacity: 0.92 }}>
            {model.subhead}
          </p>
          <div className="mt-8">
            <Btn model={model} kind="ink" radius={6}>
              {model.cta.label}
            </Btn>
          </div>
        </div>
      </section>

      <section className={`${pad} ${y}`}>
        <h2 className={h2} style={head}>
          Shop by department
        </h2>
        <ul className={`mt-8 grid gap-4 ${c("grid-cols-2", "grid-cols-3")}`}>
          {model.services.slice(0, 6).map((s, i) => (
            <li key={s.title + i} className={`flex flex-col justify-between p-5 ${c("min-h-[130px]", "min-h-[170px]")}`} style={{ background: tints[i], borderRadius: 8, boxShadow: `inset 0 0 0 1px ${p.ink}12` }}>
              <h3 className={c("text-[1.05rem]", "text-[1.35rem]")} style={head}>
                {s.title}
              </h3>
              <p className="mt-2 text-[0.88rem]" style={{ color: p.muted }}>
                {s.blurb}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${pad} ${y}`} style={{ background: p.surface }}>
        <div className={c("", "grid grid-cols-12 gap-12")}>
          <div className={c("mb-8", "col-span-5")}>
            <h2 className={h2} style={head}>
              {model.aboutHeading}
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed" style={{ color: p.muted }}>
              {model.aboutBody}
            </p>
            <ol className="mt-6 grid gap-3">
              {model.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4 text-[0.98rem]">
                  <span className="w-6 font-bold" style={{ color: p.accentText }}>
                    {i + 1}
                  </span>
                  <span>
                    <b>{s.title}.</b> <span style={{ color: p.muted }}>{s.blurb}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className={c("", "col-span-7")}>
            <h3 className="mb-3 text-[1.2rem]" style={head}>
              Visit us
            </h3>
            <AreaMap model={model} className={c("aspect-[4/3]", "aspect-[16/10]")} style={{ borderRadius: 8 }} />
          </div>
        </div>
      </section>

      <section id="contact" className={`${pad} ${y}`}>
        <div className={`grid items-start gap-8 ${c("grid-cols-1", "grid-cols-12")}`}>
          <div className={c("", "col-span-6")}>
            <h2 className={h2} style={head}>
              {ctaHeading(model)}
            </h2>
            <p className="mt-3 text-[1rem]" style={{ color: p.muted }}>
              Find the shop, check what we stock and get in touch.
            </p>
            <div className="mt-5">
              <AreasList model={model} head={head} fallback="" />
            </div>
          </div>
          <div className={c("", "col-span-5 col-start-8")}>
            <ContactList model={model} />
          </div>
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
