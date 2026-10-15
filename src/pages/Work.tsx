import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { CtaBand } from "@/components/oss/CtaBand";
import { projects, type WorkProject } from "@/data/work";
import { shots } from "@/assets/redesign";
import { useScrollProgress } from "@/hooks/useScrollProgress";

type Filter = "all";

const featured = ["true-to-detail", "brightlearn-tutoring"];
const inFilter = (_p: WorkProject, _f: Filter) => true;

export default function Work() {
  const [filter, setFilter] = useState<Filter>("all");
  const feat = useScrollProgress<HTMLElement>();
  const count = (f: Filter) => projects.filter((p) => inFilter(p, f)).length;
  const tabs: { id: Filter; label: string }[] = [{ id: "all", label: `All (${count("all")})` }];
  const rows = projects.filter((p) => !featured.includes(p.slug) && inFilter(p, filter));
  const showFeatured = filter === "all" || filter === "client";

  return (
    <Layout pageClass="pg pg-work">
      <Seo
        path="/work"
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Our Work", path: "/work" },
        ])}
      />

      <header className="wh" data-tone="light">
        <h1 className="oss-disp">Work</h1>
        <p className="intro">Websites we have built for businesses across the UK.</p>
        <div className="filters" role="group" aria-label="Filter projects">
          {tabs.map((t) => (
            <button key={t.id} type="button" className={filter === t.id ? "on" : ""} aria-pressed={filter === t.id} onClick={() => setFilter(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {showFeatured && (
        <section ref={feat} className="feat" data-tone="light" aria-label="Featured projects">
          <div className="a">
            <h2>
              <Link to="/work/true-to-detail">True To Detail</Link>
            </h2>
            <div className="d1 oss-screen oss-shadow">
              <img src={shots.ttdHero} width={2000} height={1041} alt="True To Detail website, home page" decoding="async" />
            </div>
            <div className="d2 oss-screen oss-shadow">
              <img src={shots.ttdPacks} width={1600} height={1000} loading="lazy" alt="True To Detail packages page" decoding="async" />
            </div>
            <div className="oss-phone ph">
              <div className="oss-screen">
                <img src={shots.ttdMHero} width={780} height={1440} loading="lazy" alt="True To Detail website on a phone" decoding="async" />
              </div>
            </div>
            <div className="txt">
              <span className="oss-tag">Client work</span>
              <p>Mobile car valeting, Hemel Hempstead and Hertfordshire</p>
              <Link className="oss-lnk" to="/work/true-to-detail">View case study &#8594;</Link>
            </div>
          </div>
          <div className="b">
            <h2>
              <Link to="/work/brightlearn-tutoring">BrightLearn Tutoring</Link>
            </h2>
            <div className="d3 oss-screen oss-shadow">
              <img src={shots.blHero} width={2000} height={1041} loading="lazy" alt="BrightLearn Tutoring website, home page" decoding="async" />
            </div>
            <div className="oss-phone ph">
              <div className="oss-screen">
                <img src={shots.blM1} width={780} height={1688} loading="lazy" alt="BrightLearn Tutoring programmes on a phone" decoding="async" />
              </div>
            </div>
            <div className="txt">
              <span className="oss-tag">Client work</span>
              <p>Online maths tuition, KS2 to GCSE</p>
              <Link className="oss-lnk" to="/work/brightlearn-tutoring">View case study &#8594;</Link>
            </div>
          </div>
        </section>
      )}

      <section className="idx" data-tone="light" aria-labelledby="more-title">
        <div className="hd">
          <h2 id="more-title" className="oss-disp">{showFeatured && filter === "all" ? "More work" : "Work"}</h2>
          <p>More of the sites we have built. We show captures only, with no external links.</p>
        </div>
        <ul>
          {rows.map((p) => (
            <li key={p.slug}>
              <Link className="irow" to={`/work/${p.slug}`}>
                <span className="nm">{p.name}</span>
                <span className="sc">
                  {p.line[0]}
                  <br />
                  {p.line[1]}
                  {p.status === "Preview build" ? ", in build" : ""}
                </span>
                {p.label ? <span className="oss-tag st">{p.label}</span> : <span className="st" />}
                <span className="float" aria-hidden="true">
                  <img src={p.img.t} width={800} height={500} loading="lazy" alt="" decoding="async" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        
      </section>

      <CtaBand />
    </Layout>
  );
}
