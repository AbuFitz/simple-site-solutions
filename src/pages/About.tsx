import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { CtaBand } from "@/components/oss/CtaBand";
import { Scramble } from "@/components/oss/Scramble";
import { Link } from "react-router-dom";

const principles = [
  { t: "Fixed prices", d: "Launch and Growth at a fixed price, and a tailored quotation for bigger projects. The price, page count and inclusions are written down before you start." },
  { t: "Designed around you", d: "Colours, typography and layout agreed with you, using your branding and images, and built around your details." },
  { t: "Plain English", d: "No jargon. We tell you what we need from you, and what happens next." },
  { t: "Nothing invented", d: "No made-up reviews, logos or results. If we can't show it, we don't say it." },
];
const team = [
  { slug: "farhan-m", name: "Farhan M", role: "Client Director", text: "Client relationships, briefs, communication and project coordination." },
  { slug: "matthew-r", name: "Matthew R", role: "Design Director", text: "Website design, interaction, visual systems and digital experience." },
  { slug: "abukar-s", name: "Abukar S", role: "Creative Director", text: "Creative direction, website strategy, design and overall experience." },
];

export default function About() {
  return (
    <Layout pageClass="pg pg-inner ab">
      <Seo path="/about" jsonLd={breadcrumb([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <section className="ab-hero" data-tone="dark">
        <h1>
          <span><Scramble text="Websites for" /></span>
          <span><Scramble text="UK businesses." delay={200} /></span>
        </h1>
        <p className="ab-lede">Trades, mechanics, cleaners, barbers, tutors, small shops and similar. A clear fixed price, a design built around your business, and a short process.</p>
      </section>

      <section className="ab-quote" data-tone="dark">
        <p className="ab-statement">Every site is planned around <em>your trade, your area</em> and the questions your customers ask before they call.</p>
      </section>

      <section className="ab-team" data-tone="light" aria-label="The team">
        <ul>
          {team.map((m) => (
            <li key={m.name}>
              <Link to={`/about/${m.slug}`}>
                <small>{m.role}</small>
                <b>{m.name}</b>
                <span>{m.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="ab-how" data-tone="dark" aria-labelledby="how-t">
        <h2 id="how-t"><Scramble text="How we work" /></h2>
        <ol>
          {principles.map((p, i) => (
            <li key={p.t}>
              <i aria-hidden="true">{String(i + 1).padStart(2, "0")}</i>
              <b>{p.t}</b>
              <span>{p.d}</span>
            </li>
          ))}
        </ol>
        <p className="ab-fit">
          It suits you if you want a clean, working site without managing a design project. For online shops, customer portals or a custom web app, ask us about Enterprise.
        </p>
      </section>
      <CtaBand />
    </Layout>
  );
}
