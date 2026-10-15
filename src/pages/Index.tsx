import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { CtaBand } from "@/components/oss/CtaBand";
import { Scramble } from "@/components/oss/Scramble";

const services = [
  { n: "01", t: "Business websites", d: "A clear site for a trade, practice or local service: what you do, where, and how to get in touch." },
  { n: "02", t: "Redesigns", d: "Already online but it looks tired or confuses people? We rebuild it around what customers ask." },
  { n: "03", t: "Online shops", d: "Product pages, a basket that remembers, and a checkout handoff for sellers who take orders." },
  { n: "04", t: "Quotes & bookings", d: "Forms and routes that turn a visit into an enquiry." },
  { n: "05", t: "Found locally", d: "A page for each area you cover, set up so people nearby can find you." },
];
const team = [
  { name: "Farhan M", role: "Client Director", text: "Client relationships, briefs, communication and project coordination." },
  { name: "Abukar S", role: "Creative Director", text: "Creative direction, website strategy, design and overall experience." },
  { name: "Matt R", role: "Design Director", text: "Website design, interaction, visual systems and digital experience." },
];
const packages = [
  { name: "The Starter", note: "3 pages, 5 to 7 days", price: "£199" },
  { name: "The Sorted", note: "6 pages, 7 to 10 days", price: "£399" },
  { name: "The Works", note: "10 pages, 10 to 14 days", price: "£649" },
];

export default function Index() {
  return (
    <Layout pageClass="pg hm">
      <Seo path="/" />

      <section className="hm-hero" data-tone="dark" aria-labelledby="hero-title">
        <h1 id="hero-title">
          <span><Scramble text="Websites" /></span>
          <span><Scramble text="that make" delay={250} /></span>
          <span className="g"><Scramble text="sense." delay={500} /></span>
        </h1>
        <p className="hm-hero__line">Fixed-price websites for businesses across the UK. Fixed prices from £199.</p>
        <div className="hm-marq" aria-hidden="true"><div><span>Fixed prices</span><span>Looks right</span><span>Feels right</span><span>Works</span><span>UK-wide</span><span>Fixed prices</span><span>Looks right</span><span>Feels right</span><span>Works</span><span>UK-wide</span></div></div>
        <Link to="/start" className="hm-hero__go">Start a project <span aria-hidden="true">&#8599;</span></Link>
        <span className="hm-hero__scroll" aria-hidden="true">Scroll &#8595;</span>
      </section>

      <section className="hm-story" data-tone="dark" aria-labelledby="story-title">
        <small><Scramble text="Our story" /></small>
        <p id="story-title">Small businesses deserve a website that <em>looks right, feels right</em> and actually works.</p>
        <ul className="hm-facts">
          <li><b>3</b><span>people behind every site</span></li>
          <li><b>UK</b><span>wide, with local pages</span></li>
          <li><b>£199</b><span>where fixed prices start</span></li>
        </ul>
        <Link to="/work" className="hm-link">If you want to see our work, it's here &#8594;</Link>
      </section>

      <section className="hm-days" data-tone="dark" aria-label="How long it takes">
        <b aria-hidden="true">5</b>
        <p>to <em>14</em> days, estimated from when we have your content. Fixed price, written down first.</p>
        <b aria-hidden="true">14</b>
      </section>

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

      <section className="hm-team" data-tone="dark" aria-labelledby="team-title">
        <h2 id="team-title" className="sr-only">The team</h2>
        <blockquote>&ldquo;We want it to look right, feel right and <em>actually work</em> for the business.&rdquo;</blockquote>
        <p className="hm-by">The OneSimpleSite team</p>
        <ul>
          {team.map((m) => (
            <li key={m.name} data-scramble-host>
              <small>{m.role}</small>
              <b><Scramble text={m.name} hover /></b>
              <span>{m.text}</span>
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
