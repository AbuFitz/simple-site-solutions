import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CtaBand } from "@/components/oss/CtaBand";
import { Scramble } from "@/components/oss/Scramble";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { addons, hosting, packages, scopeNotes, sharedFeatures } from "@/data/packages";
import { DELIVERY_NOTE } from "@/data/site";

const comparison: { label: string; values: [string, string, string] }[] = [
  { label: "Main pages", values: ["Up to 3", "Up to 10", "Scoped"] },
  { label: "Design, mobile layouts, copywriting", values: ["Included", "Included", "Scoped"] },
  { label: "Enquiry form and contact links", values: ["Included", "Included", "Scoped"] },
  { label: "Essential SEO and speed optimisation", values: ["Included", "Included", "Scoped"] },
  { label: "Cookie controls", values: ["Included", "Included", "Scoped"] },
  { label: "Content planning and navigation", values: ["—", "Included", "Scoped"] },
  { label: "Advanced on-page SEO (one-off)", values: ["—", "Included", "Scoped"] },
  { label: "Business email setup", values: ["—", "Included", "Scoped"] },
  { label: "Basic analytics setup", values: ["—", "Included", "Scoped"] },
  { label: "Revision rounds", values: ["1", "3", "Agreed"] },
  { label: "Estimated delivery", values: ["5 to 7 working days", "10 to 14 working days", "Agreed"] },
  { label: "Payment", values: ["£189 before work begins", "£244.50 to begin, £244.50 before launch", "In the quotation"] },
];

export default function Packages() {
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

      <section className="pk-list" data-tone="light" aria-label="Packages">
        {packages.map((pkg) => (
          <article key={pkg.id} className="pk-row" data-rec={pkg.recommended ? "true" : "false"} itemScope itemType="https://schema.org/Product">
            <div className="pk-row__top">
              <div>
                <h2 itemProp="name">{pkg.name}</h2>
                <p itemProp="description">{pkg.summary}</p>
                {pkg.recommended && <span className="pk-rec">Our recommendation</span>}
              </div>
              <div className="pk-row__price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                {pkg.price ? (
                  <>
                    {pkg.was && <s className="pk-was"><span className="sr-only">Previously </span>£{pkg.was}</s>}
                    <span itemProp="price">£{pkg.price}</span>
                    <meta itemProp="priceCurrency" content="GBP" />
                    {pkg.saving && <em className="pk-save">{pkg.saving}</em>}
                  </>
                ) : (
                  <span className="pk-quote">{pkg.priceLabel}</span>
                )}
              </div>
            </div>
            <p className="pk-pay">{pkg.paymentText}.</p>
            <details>
              <summary>See what is included</summary>
              <p className="pk-meta">{pkg.tagline}</p>
              <ul>
                {pkg.features.map((f) => (
                  <li key={f.title}><b>{f.title}.</b> {f.text}</li>
                ))}
              </ul>
              {pkg.note && <p className="pk-meta">{pkg.note}</p>}
              {pkg.id !== "enterprise" && (
                <>
                  <p className="pk-meta"><b>Included with both fixed packages</b></p>
                  <ul>
                    {sharedFeatures.map((f) => (
                      <li key={f.title}><b>{f.title}.</b> {f.text}</li>
                    ))}
                  </ul>
                </>
              )}
              <p className="pk-meta">
                {[pkg.revisions, pkg.delivery && `Estimated delivery: ${pkg.delivery}`, `Payment: ${pkg.paymentText}`].filter(Boolean).join(". ")}.
              </p>
            </details>
            <Link
              to={`/start?package=${pkg.id}`}
              className="pk-go"
              aria-label={pkg.price ? `Get started with ${pkg.name} for £${pkg.price}` : `Talk to us about an ${pkg.name} project`}
            >
              {pkg.price ? `Start with ${pkg.name}` : "Talk to us"} <span aria-hidden="true">&#8594;</span>
            </Link>
          </article>
        ))}
        <p className="pk-note">{DELIVERY_NOTE}</p>
      </section>

      <section className="pk-more" data-tone="dark" aria-label="More detail">
        <details>
          <summary>Compare everything</summary>
          <div className="pk-table" role="table" aria-label="Package comparison">
            <div role="row" className="pk-table__h">
              <span role="columnheader" />
              {packages.map((p) => (
                <span role="columnheader" key={p.id}>{p.name}<small>{p.price ? `£${p.price}` : p.priceLabel}</small></span>
              ))}
            </div>
            {comparison.map((r) => (
              <div role="row" key={r.label}>
                <span role="rowheader">{r.label}</span>
                {r.values.map((v, i) => (
                  <span role="cell" key={i}>{v}</span>
                ))}
              </div>
            ))}
          </div>
        </details>
        <details>
          <summary>Optional extras</summary>
          <ul className="pk-extras">
            {addons.map((a) => (
              <li key={a.name}>
                <span>{a.name}<small className="pk-sub">{a.explain}</small></span>
                <i>£{a.price}</i>
              </li>
            ))}
          </ul>
        </details>
        <details>
          <summary>Hosting &amp; Care, £{hosting.price}/month</summary>
          <p className="pk-meta">{hosting.intro}</p>
          <ul className="pk-extras">
            {hosting.features.map((f) => (
              <li key={f}>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {hosting.terms.map((t) => (
            <p className="pk-meta" key={t}>{t}</p>
          ))}
        </details>
        <details>
          <summary>How the package scope works</summary>
          {scopeNotes.map((t) => (
            <p className="pk-meta" key={t}>{t}</p>
          ))}
        </details>
      </section>

      <CtaBand />
    </Layout>
  );
}
