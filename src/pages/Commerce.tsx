import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { Scramble } from "@/components/oss/Scramble";

const START = "/start?package=enterprise&type=Online%20shop";

const operatingLoop = [
  ["01", "List", "Add products, variants, stock and delivery rules from the dashboard."],
  ["02", "Sell", "Customers browse a store designed for the brand and pay through a proper checkout."],
  ["03", "Fulfil", "Orders arrive in one queue. Update the status and keep the customer informed."],
  ["04", "Learn", "See sales, products and customers without stitching reports together."],
] as const;

const comparisons = [
  {
    name: "A DIY builder",
    lead: "You assemble it",
    points: ["Start from a shared theme", "Choose and connect the moving parts", "Maintain the setup yourself"],
    ours: false,
  },
  {
    name: "A traditional agency",
    lead: "They hand it over",
    points: ["A custom project and a larger scope", "Platform and maintenance priced separately", "Changes return to the agency"],
    ours: false,
  },
  {
    name: "OneSimpleCommerce",
    lead: "We build it, then run the platform",
    points: ["A storefront shaped around the business", "Dashboard, payments and operations together", "Hosting, security and updates included"],
    ours: true,
  },
] as const;

function CommerceCanvas() {
  return (
    <div className="oc-canvas" role="img" aria-label="Illustration of a customer storefront and merchant order dashboard">
      <div className="oc-store" aria-hidden="true">
        <div className="oc-store__nav"><b>north/end</b><span>Shop&nbsp;&nbsp; Journal&nbsp;&nbsp; Bag (2)</span></div>
        <div className="oc-store__hero">
          <p>Small-batch essentials</p>
          <b>Objects for slower days.</b>
          <i>Shop the collection →</i>
        </div>
        <div className="oc-products"><i /><i /><i /></div>
      </div>
      <div className="oc-orders" aria-hidden="true">
        <p><span>Live orders</span><b>£1,284</b></p>
        <ol>
          <li><i>AS</i><span><b>#1048 · A. Shah</b><small>2 items · £86.00</small></span><em>Paid</em></li>
          <li><i>JM</i><span><b>#1047 · J. Miles</b><small>1 item · £42.00</small></span><em>Pack</em></li>
          <li><i>RK</i><span><b>#1046 · R. Khan</b><small>3 items · £118.00</small></span><em>Sent</em></li>
        </ol>
      </div>
      <div className="oc-pulse" aria-hidden="true"><i /><span>Order paid</span><b>+ £86.00</b></div>
    </div>
  );
}

export default function Commerce() {
  return (
    <Layout pageClass="pg oc">
      <Seo
        path="/solutions/commerce"
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "OneSimpleCommerce", path: "/solutions/commerce" },
        ])}
      />

      <section className="oc-hero" data-tone="dark" aria-labelledby="oc-title">
        <div className="oc-hero__copy">
          <p className="oc-kicker"><span>OneSimple</span>Commerce</p>
          <h1 id="oc-title"><Scramble text="A store built around" /> <em><Scramble text="how you sell." delay={240} /></em></h1>
          <p className="oc-lede">A bespoke online store, a calm dashboard, payments and delivery set up together—then hosting, security and updates looked after.</p>
          <div className="oc-actions">
            <Link to={START} className="oc-button">Plan my store <span aria-hidden="true">↗</span></Link>
            <a href="#inside">See what is inside</a>
          </div>
          <p className="oc-price-line"><b>£479</b> one-time build <span /> <b>£39</b> a month</p>
        </div>
        <CommerceCanvas />
      </section>

      <section className="oc-proof" data-tone="light" aria-label="What the service includes">
        <p>One platform, four jobs</p>
        <ul>
          <li><b>Storefront</b><span>Designed for the brand</span></li>
          <li><b>Dashboard</b><span>Orders, stock and customers</span></li>
          <li><b>Payments</b><span>Set up around Stripe</span></li>
          <li><b>Operations</b><span>Hosting, security and updates</span></li>
        </ul>
      </section>

      <section id="inside" className="oc-two" data-tone="light" aria-labelledby="oc-inside-title">
        <header>
          <p className="oc-label">The product</p>
          <h2 id="oc-inside-title">Good for the customer. <em>Quiet for the merchant.</em></h2>
        </header>
        <div className="oc-two__grid">
          <article className="oc-side oc-side--shop">
            <p className="oc-label">What customers see</p>
            <h3>A storefront with its own point of view.</h3>
            <p>Products, collections, basket and checkout follow the business instead of forcing it into a familiar template.</p>
            <div className="oc-catalogue" aria-hidden="true">
              <div><i /><b>Everyday tote</b><span>£42</span></div>
              <div><i /><b>Desk vessel</b><span>£36</span></div>
              <div><i /><b>Wool throw</b><span>£84</span></div>
            </div>
          </article>
          <article className="oc-side oc-side--desk">
            <p className="oc-label">What merchants use</p>
            <h3>One place to run the day.</h3>
            <p>Orders, products, stock, customers, discounts and payouts stay in one operating view, on phone or desktop.</p>
            <div className="oc-metrics" aria-hidden="true">
              <p><small>Today</small><b>£1,284</b><span>18 orders</span></p>
              <ol>{[42, 68, 51, 82, 64, 91, 73, 100].map((h, i) => <li key={i} style={{ "--h": `${h}%` } as React.CSSProperties} />)}</ol>
            </div>
          </article>
        </div>
      </section>

      <section className="oc-loop" data-tone="dark" aria-labelledby="oc-loop-title">
        <header>
          <p className="oc-label">The operating loop</p>
          <h2 id="oc-loop-title">From product to parcel, <em>without the platform sprawl.</em></h2>
        </header>
        <ol>
          {operatingLoop.map(([n, title, text]) => (
            <li key={n}><span>{n}</span><b>{title}</b><p>{text}</p></li>
          ))}
        </ol>
      </section>

      <section className="oc-fit" data-tone="light" aria-labelledby="oc-fit-title">
        <div>
          <p className="oc-label">Custom by default</p>
          <h2 id="oc-fit-title">If it is how the business works, <em>it belongs in the store.</em></h2>
          <p className="oc-fit__lede">The platform covers the dependable commerce work. The build can add the parts that make the business different.</p>
        </div>
        <ul>
          <li><span>01</span><b>Sell a fitted service by postcode</b><p>Check coverage, choose supply or fitting, and keep the purchase in one flow.</p></li>
          <li><span>02</span><b>Personalise before checkout</b><p>Collect the options a maker needs without turning the product page into a form maze.</p></li>
          <li><span>03</span><b>Run timed offers and drops</b><p>Schedule what appears and when, while stock and orders stay in the same system.</p></li>
        </ul>
      </section>

      <section className="oc-compare" data-tone="light" aria-labelledby="oc-compare-title">
        <header>
          <p className="oc-label">Where it fits</p>
          <h2 id="oc-compare-title">Not another builder. <em>Not a hand-off.</em></h2>
          <p>OneSimpleCommerce is for an independent business that wants something distinctive without becoming its own ecommerce department.</p>
        </header>
        <div className="oc-compare__grid">
          {comparisons.map((item) => (
            <article key={item.name} className={item.ours ? "is-ours" : undefined}>
              <p>{item.name}</p><h3>{item.lead}</h3>
              <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="oc-price" data-tone="dark" aria-labelledby="oc-price-title">
        <div>
          <p className="oc-label">Straightforward pricing</p>
          <h2 id="oc-price-title">One build. <em>One monthly price.</em></h2>
          <p>The written scope confirms the storefront, data, integrations and custom work before the build starts.</p>
        </div>
        <div className="oc-price__card">
          <p><span>Store build</span><b>£479</b><small>one time</small></p>
          <p><span>Platform</span><b>£39</b><small>per month</small></p>
          <ul>
            <li>Storefront and merchant dashboard</li>
            <li>Payments setup and delivery configuration</li>
            <li>Hosting, security and platform updates</li>
            <li>A real person when something needs attention</li>
          </ul>
          <Link to={START} className="oc-button">Plan my store <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="oc-final" data-tone="light">
        <p className="oc-kicker"><span>OneSimple</span>Commerce</p>
        <h2>Bring the business. <em>We will build the shop around it.</em></h2>
        <Link to={START} className="oc-button oc-button--dark">Start with the store brief <span aria-hidden="true">↗</span></Link>
      </section>
    </Layout>
  );
}
