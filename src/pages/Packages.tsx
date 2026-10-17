import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CtaBand } from "@/components/oss/CtaBand";
import { Scramble } from "@/components/oss/Scramble";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { addons, hosting, packages, scopeNotes, sharedFeatures, type PackageTier } from "@/data/packages";
import { DELIVERY_NOTE } from "@/data/site";

/** The breakdown shown on each card: what is specific to the package, then revisions and timing. */
const breakdown = (p: PackageTier): { title: string; text?: string }[] => [
  ...p.features,
  ...(p.revisions ? [{ title: p.revisions }] : []),
  ...(p.delivery ? [{ title: `Estimated delivery: ${p.delivery}` }] : []),
];

function Card({ pkg }: { pkg: PackageTier }) {
  const fixed = pkg.price !== null;
  return (
    <article className="pkx-card" data-rec={pkg.recommended ? "true" : "false"} itemScope itemType="https://schema.org/Product">
      <header>
        <h2 itemProp="name">{pkg.name}</h2>
        {pkg.recommended && <span className="pkx-rec">Our recommendation</span>}
      </header>

      <div className="pkx-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
        {fixed ? (
          <>
            <span className="pkx-now" itemProp="price">£{pkg.price}</span>
            <meta itemProp="priceCurrency" content="GBP" />
            {pkg.was && <s className="pkx-was"><span className="sr-only">Previously </span>£{pkg.was}</s>}
            {pkg.saving && <em className="pkx-save">{pkg.saving}</em>}
          </>
        ) : (
          <span className="pkx-quote">{pkg.priceLabel}</span>
        )}
      </div>
      <p className="pkx-pay">{pkg.paymentText}</p>

      <p className="pkx-sum" itemProp="description">{pkg.summary}</p>

      <ul className="pkx-points">
        {breakdown(pkg).map((f) => (
          <li key={f.title}>
            <Check aria-hidden="true" />
            <span><b>{f.title}</b>{f.text && <small>{f.text}</small>}</span>
          </li>
        ))}
      </ul>
      {pkg.note && <p className="pkx-nb">{pkg.note}</p>}
      {fixed && <p className="pkx-nb">Plus everything in &ldquo;Included with both packages&rdquo;, below.</p>}

      <Link to={`/start?package=${pkg.id}`} className="pkx-go" aria-label={fixed ? `Get started with ${pkg.name} for £${pkg.price}` : `Talk to us about an ${pkg.name} project`}>
        {fixed ? `Start with ${pkg.name}` : "Talk to us"} <span aria-hidden="true">&#8594;</span>
      </Link>
    </article>
  );
}

export default function Packages() {
  const fixedPackages = packages.filter((p) => p.price !== null);
  const bespoke = packages.filter((p) => p.price === null);
  return (
    <Layout pageClass="pg pg-inner pk">
      <Seo path="/packages"
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Packages", path: "/packages" },
        ])}
      />

      <section className="pk-hero" data-tone="dark">
        <h1>
          <span><Scramble text="A website that" /></span>
          <span><Scramble text="fits your business." delay={200} /></span>
        </h1>
        <p className="pk-lede">Pick a fixed-price package and know what you get, what it costs and when it will be ready. Need something bigger? Ask for a quote.</p>
      </section>

      <section className="pkx" data-tone="light" aria-label="Packages">
        <div className="pkx-grid">
          {fixedPackages.map((p) => <Card key={p.id} pkg={p} />)}
        </div>
        {bespoke.map((p) => (
          <article key={p.id} className="pkx-band">
            <div>
              <h2>{p.name}</h2>
              <p>{p.summary}</p>
              <ul>
                {p.features.map((f) => <li key={f.title}>{f.title}</li>)}
              </ul>
            </div>
            <div className="pkx-band__go">
              <span className="pkx-quote">{p.priceLabel}</span>
              <Link to={`/start?package=${p.id}`} className="pkx-go" aria-label={`Talk to us about an ${p.name} project`}>Talk to us <span aria-hidden="true">&#8594;</span></Link>
            </div>
          </article>
        ))}
        <p className="pkx-note">{DELIVERY_NOTE}</p>
      </section>

      <section className="pkx-shared" data-tone="light" aria-labelledby="shared-title">
        <h2 id="shared-title">Included with both packages</h2>
        <ul>
          {sharedFeatures.map((f) => (
            <li key={f.title}><b>{f.title}</b><span>{f.text}</span></li>
          ))}
        </ul>
      </section>

      <section className="pkx-extra" data-tone="dark" aria-labelledby="extras-title">
        <div>
          <h2 id="extras-title">Optional extras</h2>
          <p>Add any of these to Launch or Growth.</p>
          <ul>
            {addons.map((a) => (
              <li key={a.id}>
                <span><b>{a.name}</b><small>{a.explain}</small></span>
                <i>£{a.price}</i>
              </li>
            ))}
          </ul>
        </div>
        <div className="pkx-care">
          <h2>Hosting &amp; Care</h2>
          <p className="pkx-care__price"><b>£{hosting.price}</b> a month</p>
          <p>{hosting.intro} Month to month, cancel with 30 days&apos; notice.</p>
          <ul>
            {hosting.features.map((f) => (
              <li key={f}><Check aria-hidden="true" />{f}</li>
            ))}
          </ul>
          <p className="pkx-fine">{hosting.terms[0]} {hosting.terms[2]}</p>
        </div>
      </section>

      <section className="pkx-scope" data-tone="dark" aria-labelledby="scope-title">
        <h2 id="scope-title">How the scope works</h2>
        <ul>
          {scopeNotes.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </section>

      <CtaBand />
    </Layout>
  );
}
