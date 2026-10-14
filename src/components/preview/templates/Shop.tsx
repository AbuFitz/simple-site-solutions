import "@fontsource-variable/dm-sans";
import { Search, ShoppingBasket } from "lucide-react";
import { AreaMap, Btn, ContactList, FooterCols, Logo, Photo, ctaHeading, tokens, type TProps } from "./kit";

/** Local shops: retail feel. Search and basket in the header, a banner, departments with photos, and a visit-us block. */
export default function Shop({ model, compact }: TProps) {
  const t = tokens(model, compact, { head: "'DM Sans Variable', Inter, sans-serif", body: "'DM Sans Variable', Inter, system-ui, sans-serif", headWeight: 700, headTracking: "-0.03em", btn: 6, card: 8 });
  const { p, c, head, pad, y } = t;
  const h2 = c("text-[1.6rem] leading-tight", "text-[2.2rem] leading-tight");

  return (
    <div style={t.root}>
      <div className={`py-2 text-center text-[0.8rem] font-semibold ${pad}`} style={{ background: p.ink, color: p.bg }}>
        {model.contact.town ? `Your local shop in ${model.contact.town}` : "Your local shop"}
      </div>
      <header className={`flex items-center gap-5 py-4 ${pad}`} style={{ borderBottom: `1px solid ${p.ink}14` }}>
        <div className="flex items-center gap-3">
          <Logo model={model} radius={6} />
          {!compact && <span className="text-[1.15rem]" style={head}>{model.name}</span>}
        </div>
        {!compact && (
          <div className="ml-4 flex h-11 flex-1 items-center gap-3 px-4 text-[0.9rem]" style={{ background: p.surface, borderRadius: 6, boxShadow: `inset 0 0 0 1px ${p.ink}1f`, color: p.muted }}>
            <Search className="h-4 w-4" aria-hidden="true" />
            Search the shop
          </div>
        )}
        <div className="ml-auto flex items-center gap-4">
          {!compact && <span className="text-[0.9rem] font-medium" style={{ color: p.muted }}>{model.nav.join("   ")}</span>}
          <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
        </div>
      </header>

      <section className="relative" style={{ minHeight: c(420, 500) }}>
        <Photo model={model} i={0} className="absolute inset-0" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(${c("0deg", "90deg")}, ${p.ink}b3, ${p.ink}1a)` }} />
        <div className={`relative flex items-center ${pad} ${c("min-h-[420px] py-8", "min-h-[500px] py-14")}`} style={{ color: "#fff" }}>
          <div style={{ maxWidth: "34rem" }}>
            <h2 className={c("text-[2.2rem] leading-[1.06]", "text-[3.4rem] leading-[1.03]")} style={{ ...head, color: "#fff" }}>
              {model.headline}
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed opacity-90">{model.subhead}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn model={model} radius={6}>{model.cta.label}</Btn>
            </div>
          </div>
        </div>
      </section>

      <section className={`${pad} ${y}`}>
        <h2 className={h2} style={head}>
          Shop by department
        </h2>
        <ul className={`mt-8 grid gap-5 ${c("grid-cols-2", "grid-cols-3")}`}>
          {model.services.slice(0, 6).map((s, i) => (
            <li key={s.title + i}>
              <Photo model={model} i={i + 1} size="md" className={c("aspect-square", "aspect-[4/3]")} style={{ borderRadius: 8 }} />
              <h3 className="mt-3 text-[1.05rem]" style={head}>
                {s.title}
              </h3>
              <p className="mt-0.5 text-[0.88rem]" style={{ color: p.muted }}>
                {s.blurb}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${pad} ${y} ${c("", "grid grid-cols-12 items-center gap-12")}`} style={{ background: p.surface }}>
        <div className={c("mb-8", "col-span-6")}>
          <h2 className={h2} style={head}>
            {model.aboutHeading}
          </h2>
          <p className="mt-4 max-w-lg text-[1.05rem] leading-relaxed" style={{ color: p.muted }}>
            {model.aboutBody}
          </p>
          <ol className="mt-6 grid gap-3">
            {model.steps.map((s, i) => (
              <li key={s.title} className="flex gap-4 text-[0.98rem]">
                <span className="w-6 font-bold" style={{ color: p.accentText }}>{i + 1}</span>
                <span>
                  <b>{s.title}.</b> <span style={{ color: p.muted }}>{s.blurb}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <Photo model={model} i={2} size="md" className={c("aspect-[4/3]", "col-span-6 aspect-[5/4]")} style={{ borderRadius: 8 }} />
      </section>

      <section id="contact" className={`${pad} ${y}`}>
        <div className={`grid gap-10 ${c("grid-cols-1", "grid-cols-12")}`}>
          <div className={c("", "col-span-5")}>
            <h2 className={h2} style={head}>
              {ctaHeading(model)}
            </h2>
            <p className="mt-3 text-[1rem]" style={{ color: p.muted }}>
              Find the shop, check what we stock and get in touch.
            </p>
            <div className="mt-6">
              <ContactList model={model} />
            </div>
          </div>
          <AreaMap model={model} className={c("aspect-[4/3]", "col-span-7 aspect-[16/10]")} style={{ borderRadius: 8 }} />
        </div>
      </section>
      <FooterCols model={model} compact={compact} head={head} />
    </div>
  );
}
