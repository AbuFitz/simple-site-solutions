import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { CtaBand } from "@/components/oss/CtaBand";
import { AreaMap } from "@/components/oss/AreaMap";
import { Scramble } from "@/components/oss/Scramble";
import { SITE } from "@/data/site";
import { packages } from "@/data/packages";
import locationData from "@/data/locations.json";
import { HUB_PATH, faqFor, locationJsonLd, locationPath, type LocData } from "@/lib/locationSeo.mjs";
import NotFound from "./NotFound";

const data = locationData as LocData;

export default function WebDesignLocation() {
  const { slug } = useParams();
  const loc = data.locations.find((l) => l.slug === slug);
  if (!loc) return <NotFound />;
  const faq = faqFor(loc, data);
  const near = loc.neighbours.map((s) => data.locations.find((l) => l.slug === s)).filter((l): l is NonNullable<typeof l> => Boolean(l));
  const idx = data.locations.findIndex((l) => l.slug === loc.slug);

  return (
    <Layout pageClass="pg pg-inner ar">
      <Seo path={locationPath(loc.slug)} title={loc.title} description={loc.metaDescription} jsonLd={locationJsonLd(loc, data, SITE.url)} />

      <section className="ar-hero" data-tone="dark">
        <nav aria-label="Breadcrumb" className="ar-crumb">
          <Link to={HUB_PATH}>All areas</Link>
        </nav>
        <p className="ar-kicker">{String(idx + 1).padStart(2, "0")} / {loc.county}</p>
        <h1>
          <span><Scramble text="Web design in" /></span>
          <span className="ar-city"><Scramble text={loc.name} delay={200} /></span>
        </h1>
        <p className="ar-lede">{data.ukLine} That includes {loc.name} and the area around it.</p>
      </section>

      <section className="ar-map" data-tone="dark">
        <AreaMap slug={loc.slug} name={loc.name} />
        <ul className="ar-chips" aria-label={`Places near ${loc.name}`}>
          {loc.areas.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      <section className="ar-intro" data-tone="light">
        {loc.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="ar-local">{loc.local}</p>
      </section>

      <section className="ar-sectors" data-tone="dark" aria-labelledby="sec-t">
        <h2 id="sec-t"><Scramble text={`Who we build for in ${loc.name}`} /></h2>
        <ul>
          {loc.sectors.map((s) => (
            <li key={s.name}>
              <b>{s.name}</b>
              <span>{s.line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ar-price" data-tone="light" aria-labelledby="pr-t">
        <h2 id="pr-t"><Scramble text="Fixed prices, anywhere in the UK." /></h2>
        <ul>
          {packages.map((p) => (
            <li key={p.id}>
              <b>{p.name}</b>
              <span>Up to {p.pages} pages</span>
              <i>£{p.price}</i>
            </li>
          ))}
        </ul>
        <Link to="/packages" className="ar-link">Everything included &#8594;</Link>
      </section>

      <section className="ar-more" data-tone="dark" aria-label="More detail">
        <details>
          <summary>How we set up local search</summary>
          <ul>
            {data.shared.localSeo.map((s) => (
              <li key={s.title}>
                <b>{s.title}</b>
                <span>{s.body}</span>
              </li>
            ))}
          </ul>
        </details>
        <details>
          <summary>How it works</summary>
          <ol>
            {data.shared.steps.map((s) => (
              <li key={s.title}>
                <b>{s.title}</b>
                <span>{s.body}</span>
              </li>
            ))}
          </ol>
        </details>
        <details>
          <summary>Questions from {loc.name} businesses</summary>
          <ul>
            {faq.map((f) => (
              <li key={f.q}>
                <b>{f.q}</b>
                <span>{f.a}</span>
              </li>
            ))}
          </ul>
        </details>
      </section>

      {near.length > 0 && (
        <section className="ar-near" data-tone="dark" aria-label="Nearby areas">
          <small>Nearby</small>
          <ul>
            {near.map((n) => (
              <li key={n.slug}>
                <Link to={locationPath(n.slug)}>{n.name} &#8594;</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBand />
    </Layout>
  );
}
