import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CtaBand } from "@/components/oss/CtaBand";
import { Scramble } from "@/components/oss/Scramble";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { addons, hosting, packages } from "@/data/packages";
import { DELIVERY_NOTE } from "@/data/site";

const comparison: { label: string; values: [string, string, string] }[] = [
  { label: "Pages", values: ["Up to 3", "Up to 6", "Up to 10"] },
  { label: "Copywriting", values: ["Included", "Included", "Included"] },
  { label: "Contact form + WhatsApp, Google Maps", values: ["Included", "Included", "Included"] },
  { label: "SEO", values: ["Basic", "Full on-page", "SEO-led structure"] },
  { label: "Booking system", values: ["—", "Included", "Advanced"] },
  { label: "Reviews & trust signals", values: ["—", "Included", "Included"] },
  { label: "Free domain (1st year)", values: ["—", "Included", "Included"] },
  { label: "Business email setup", values: ["—", "Included", "Included"] },
  { label: "Location pages for local SEO", values: ["—", "—", "Included"] },
  { label: "Blog setup + 1 post", values: ["—", "—", "Included"] },
  { label: "Google Analytics setup", values: ["—", "—", "Included"] },
  { label: "Full legal pages", values: ["—", "—", "Included"] },
  { label: "Revision rounds", values: ["1", "2", "3"] },
  { label: "Estimated delivery", values: ["5–7 days", "7–10 days", "10–14 days"] },
  { label: "Payment", values: ["Upfront", "50% upfront", "50% upfront"] },
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
        <p className="pk-kicker">Pricing</p>
        <h1>
          <span><Scramble text="Fixed" /></span>
          <span><Scramble text="prices." delay={200} /></span>
        </h1>
        <p className="pk-lede">One price per package, written down. Extras and monthly care are separate, below.</p>
      </section>

      <section className="pk-list" data-tone="light" aria-label="Packages">
        {packages.map((pkg) => (
          <article key={pkg.id} className="pk-row" data-rec={pkg.recommended ? "true" : "false"} itemScope itemType="https://schema.org/Product">
            <div className="pk-row__top">
              <div>
                <h2 itemProp="name">{pkg.name}</h2>
                <p itemProp="description">{pkg.tagline}. {pkg.pages === 3 ? "Up to 3 pages" : `Up to ${pkg.pages} pages`}, {pkg.delivery}.{pkg.recommended ? " Our suggestion." : ""}</p>
              </div>
              <div className="pk-row__price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <span itemProp="price">£{pkg.price}</span>
                <meta itemProp="priceCurrency" content="GBP" />
              </div>
            </div>
            <details>
              <summary>What is included</summary>
              <ul>
                {pkg.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="pk-meta">Delivery {pkg.delivery}. Payment: {pkg.payment}. Ideal for {pkg.ideal.toLowerCase()}.</p>
            </details>
            <Link to={`/start?package=${pkg.id}`} className="pk-go" aria-label={`Get started with ${pkg.name} package for £${pkg.price}`}>
              Get started <span aria-hidden="true">&#8594;</span>
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
                <span role="columnheader" key={p.id}>{p.name}<small>£{p.price}</small></span>
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
                <span>{a.name}</span>
                <i>£{a.price}</i>
              </li>
            ))}
          </ul>
        </details>
        <details>
          <summary>Monthly care, £{hosting.price}</summary>
          <ul className="pk-extras">
            {hosting.features.map((f) => (
              <li key={f}>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="pk-meta">Optional. Either side can end it with 30 days' notice (see our terms).</p>
        </details>
      </section>

      <CtaBand />
    </Layout>
  );
}
