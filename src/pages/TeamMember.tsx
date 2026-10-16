import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { CtaBand } from "@/components/oss/CtaBand";
import { Scramble } from "@/components/oss/Scramble";
import { getMember, team } from "@/data/team";
import NotFound from "./NotFound";

export default function TeamMember() {
  const { slug = "" } = useParams();
  const m = getMember(slug);
  if (!m) return <NotFound />;
  const others = team.filter((t) => t.slug !== m.slug);

  return (
    <Layout pageClass="pg pg-inner tm">
      <Seo
        path={`/about/${m.slug}`}
        title={`${m.name}, ${m.role} | OneSimpleSite`}
        description={`${m.name} is ${m.role} at OneSimpleSite. ${m.does}`}
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: m.name, path: `/about/${m.slug}` },
        ])}
      />
      <section className="tm-hero" data-tone="dark">
        <Link to="/about" className="tm-back">&#8592; The team</Link>
        <h1>
          <Scramble text={m.name} />
        </h1>
        <p className="tm-role">{m.role}</p>
      </section>
      <section className="tm-body" data-tone="light">
        <div className="tm-story">
          {m.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="tm-facts">
          {m.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="tm-next" data-tone="dark" aria-label="Rest of the team">
        {others.map((o) => (
          <Link key={o.slug} to={`/about/${o.slug}`}>
            <small>{o.role}</small>
            <b>{o.name} &#8594;</b>
          </Link>
        ))}
      </section>
      <CtaBand />
    </Layout>
  );
}
