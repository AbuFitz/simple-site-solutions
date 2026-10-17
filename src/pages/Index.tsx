import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { CtaBand } from "@/components/oss/CtaBand";
import { WorkRack } from "@/components/oss/WorkRack";
import { pricedPackages } from "@/data/packages";
import { CountUp } from "@/components/oss/CountUp";
import { DaysCounter } from "@/components/oss/DaysCounter";
import { TypeRotate } from "@/components/oss/TypeRotate";
import { Scramble } from "@/components/oss/Scramble";

const services = [
  { n: "01", t: "Business websites", d: "A clear site for a trade, practice or local service: what you do, where, and how to get in touch." },
  { n: "02", t: "Redesigns", d: "Already online but it looks tired or confuses people? We rebuild it around what customers ask." },
  { n: "03", t: "Online shops", d: "Product pages, a basket that remembers, and a checkout handoff for sellers who take orders." },
  { n: "04", t: "Quotes & bookings", d: "Forms and routes that turn a visit into an enquiry." },
  { n: "05", t: "Found locally", d: "A page for each area you cover, set up so people nearby can find you." },
];
/** The lowest fixed price, read from the price list so it can never go stale. */
const fromPrice = Math.min(...pricedPackages.map((p) => Number(p.price)));

const team = [
  { slug: "farhan-m", name: "Farhan M", role: "Client Director", text: "Client relationships, briefs, communication and project coordination." },
  { slug: "matthew-r", name: "Matthew R", role: "Design Director", text: "Website design, interaction, visual systems and digital experience." },
  { slug: "abukar-s", name: "Abukar S", role: "Creative Director", text: "Creative direction, website strategy, design and overall experience." },
];
const packages = [
  { name: "Launch", note: "Up to 3 pages, 5 to 7 working days", price: "£189" },
  { name: "Growth", note: "Up to 10 pages, 10 to 14 working days", price: "£489" },
  { name: "Enterprise", note: "Shops, portals and bespoke projects", price: "Quotation" },
];

export default function Index() {
  return (
    <Layout pageClass="pg hm">
      <Seo path="/" />

      <section className="hm-hero" data-tone="dark" aria-labelledby="hero-title" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`); e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`); }}>
        <div className="hm-blobs" aria-hidden="true"><i className="hm-blob b1" /><i className="hm-blob b2" /></div>
        <h1 id="hero-title">
          <span><Scramble text="Websites" /></span>
          <span><Scramble text="that make" delay={250} /></span>
          <span className="g"><TypeRotate words={["sense.", "an impact.", "a mark."]} /></span>
        </h1>
        <p className="hm-hero__line">Fixed-price websites for businesses across the UK. Fixed prices from £189.</p>
              </section>

      <section className="hm-story" data-tone="dark" aria-labelledby="story-title">
        <small><Scramble text="What we do" /></small>
        <p id="story-title"><Scramble text="Built for how customers" /> <em><Scramble text="find, check and contact" delay={350} /></em> <Scramble text="a local business." delay={700} /></p>
        <ul className="hm-facts">
          <li><b>UK</b><span>wide, with local pages</span></li>
          <li><b><CountUp to={fromPrice} prefix="£" /></b><span>where fixed prices start</span></li>
        </ul>
        
      </section>

      <WorkRack />

      <DaysCounter />

      <section className="hm-svc" data-tone="light" aria-labelledby="svc-title">
        <h2 id="svc-title" className="hm-lab"><Scramble text="What we make" /></h2>
        <ul>
          {services.map((s) => (
            <li key={s.n} data-scramble-host>
              <small>{s.n}</small>
              <b><Scramble text={s.t} hover /></b>
              <span>{s.d}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="hm-how" data-tone="light" aria-labelledby="how-title">
        <h2 id="how-title"><Scramble text="Notes in," /> <em><Scramble text="site out." delay={200} /></em></h2>
        <ol>
          <li><i aria-hidden="true">1</i><b>Brief</b><span>Pick a package and fill in one short form: your business, services and contact details.</span></li>
          <li><i aria-hidden="true">2</i><b>Build</b><span>We design and build your site, ready for phones, search and enquiries.</span></li>
          <li><i aria-hidden="true">3</i><b>Launch</b><span>You check it and ask for changes. When you are happy, it goes live.</span></li>
        </ol>
      </section>

      <section className="hm-team" data-tone="dark" aria-labelledby="team-title">
        <h2 id="team-title" className="sr-only">The team</h2>
        <blockquote><Scramble text="“We want it to" /> <em><Scramble text="look right, feel right" delay={300} /></em> <Scramble text="and actually work for the business.”" delay={600} /></blockquote>
        <ul>
          {team.map((m) => (
            <li key={m.name} data-scramble-host>
              <Link to={`/about/${m.slug}`}>
                <small>{m.role}</small>
                <b><Scramble text={m.name} hover /></b>
                <span>{m.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="hm-price" data-tone="light" aria-labelledby="price-title">
        <h2 id="price-title"><Scramble text="Fixed" /> <em><Scramble text="prices." delay={200} /></em></h2>
        <ul>
          {packages.map((p) => (
            <li key={p.name}>
              <b>{p.name}</b>
              <span>{p.note}</span>
              <i>{p.price}</i>
            </li>
          ))}
        </ul>
        <Link to="/packages" className="hm-link">Compare everything included &#8594;</Link>
      </section>

      <CtaBand />
    </Layout>
  );
}
