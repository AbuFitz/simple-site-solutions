import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { projects } from "@/data/work";
import { shots } from "@/assets/redesign";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { CtaBand } from "@/components/oss/CtaBand";

const indexProjects = projects.filter((p) => p.slug !== "true-to-detail" && p.slug !== "brightlearn-tutoring");

const steps = [
  { title: "Choose a package", text: "Pick what fits your business and budget." },
  { title: "Tell us about the business", text: "A short form. We guide you on anything missing." },
  { title: "We research and build", text: "Planned for your kind of business, built around your details." },
  { title: "You review", text: "We share the site and refine it with you." },
  { title: "Go live", text: "Fast, mobile-first and ready for local search." },
];

const packages = [
  { name: "The Starter", note: "Get online properly. Up to 3 pages.", days: "5 to 7 days", price: "£199" },
  { name: "The Sorted", note: "Look established, win trust. Up to 6 pages.", days: "7 to 10 days", price: "£399", tag: "Our suggestion" },
  { name: "The Works", note: "Compete seriously. Up to 10 pages.", days: "10 to 14 days", price: "£649" },
];

function Arrow() {
  return <span aria-hidden="true">&#8599;</span>;
}

export default function Index() {
  const plateA = useScrollProgress<HTMLElement>();
  const plateB = useScrollProgress<HTMLElement>();

  return (
    <Layout pageClass="pg pg-home">
      <Seo path="/" />

      {/* Hero: the work is the composition */}
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="oss-disp">
          <span className="line">We build</span>
          <span className="line">websites</span>
          <span className="oss-it line">people remember.</span>
        </h1>
        <div className="sub">
          <p>Fixed-price websites for businesses across the UK, designed around how your customers actually look for you.</p>
          <div className="row">
            <Link className="oss-btn" to="/start">
              <span>Start a project</span>
              <Arrow />
            </Link>
            <Link className="oss-lnk" to="/work">
              See the work
            </Link>
          </div>
        </div>
        <div className="stage">
          <div className="plane oss-screen">
            <img src={shots.ttdHero} width={2000} height={1041} alt="True To Detail website, home page" {...{ fetchpriority: "high" }} decoding="async" />
          </div>
          <div className="fade" aria-hidden="true" />
          <div className="bl oss-screen oss-shadow">
            <img src={shots.blHero} width={2000} height={1041} alt="BrightLearn Tutoring website, home page" decoding="async" />
          </div>
          <div className="oss-phone ph">
            <div className="oss-screen">
              <img src={shots.ttdMHero} width={780} height={1440} alt="True To Detail website on a phone" decoding="async" />
            </div>
          </div>
          <div className="oss-phone ph2" aria-hidden="true">
            <div className="oss-screen">
              <img src={shots.blMHero} width={780} height={1440} alt="" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* Selected work: two project plates. The seam between them is cut on the diagonal from the True To Detail site. */}
      <section ref={plateA} className="pa" data-tone="light" aria-labelledby="ttd-title">
        <h2 id="ttd-title">True To Detail</h2>
        <div className="stage">
          <div className="d1 oss-screen oss-shadow">
            <img src={shots.ttdHero} width={2000} height={1041} loading="lazy" alt="True To Detail website, home page" decoding="async" />
          </div>
          <div className="d2 oss-screen oss-shadow">
            <img src={shots.ttdPacks} width={1600} height={1000} loading="lazy" alt="True To Detail packages page" decoding="async" />
          </div>
          <div className="oss-phone ph">
            <div className="oss-screen">
              <img src={shots.ttdMHero} width={780} height={1440} loading="lazy" alt="True To Detail website on a phone" decoding="async" />
            </div>
          </div>
        </div>
        <div className="txt">
          <span className="oss-tag">Client work</span>
          <p>Mobile car valeting in Hemel Hempstead and Hertfordshire. A bold site with clear packages, area pages and a route into booking.</p>
          <Link className="oss-btn oss-btn--ink" to="/work/true-to-detail">
            <span>View case study</span>
            <span aria-hidden="true">&#8594;</span>
          </Link>
        </div>
      </section>

      <section ref={plateB} className="pb" data-tone="light" aria-labelledby="bl-title">
        <h2 id="bl-title">BrightLearn Tutoring</h2>
        <div className="stage">
          <div className="d1 oss-screen oss-shadow">
            <img src={shots.blHero} width={2000} height={1041} loading="lazy" alt="BrightLearn Tutoring website, home page" decoding="async" />
          </div>
          <div className="d2 oss-screen oss-shadow">
            <img src={shots.blPrice} width={1600} height={1000} loading="lazy" alt="BrightLearn Tutoring pricing page" decoding="async" />
          </div>
          <div className="oss-phone ph">
            <div className="oss-screen">
              <img src={shots.blM1} width={780} height={1688} loading="lazy" alt="BrightLearn Tutoring programmes on a phone" decoding="async" />
            </div>
          </div>
        </div>
        <div className="txt">
          <span className="oss-tag">Client work</span>
          <p>Online maths tuition, KS2 to GCSE. A calm site for parents: what is taught, how lessons work and what it costs.</p>
          <Link className="oss-btn oss-btn--navy" to="/work/brightlearn-tutoring">
            <span>View case study</span>
            <span aria-hidden="true">&#8594;</span>
          </Link>
        </div>
      </section>

      {/* Point of view */}
      <section className="pov" aria-labelledby="pov-title">
        <h2 id="pov-title" className="oss-disp">
          A website gets judged in seconds, <span className="a">on a phone,</span> by someone with a question.
        </h2>
        <p>So prices are written down before we start, every page is checked on a real phone, and local search is set up from the first page rather than added at the end.</p>
        <div className="oss-phone ph" aria-hidden="true">
          <div className="oss-screen">
            <img src={shots.ttdM2} width={780} height={1688} loading="lazy" alt="" decoding="async" />
          </div>
        </div>
        <div className="oss-phone p2" aria-hidden="true">
          <div className="oss-screen">
            <img src={shots.blMHero} width={780} height={1440} loading="lazy" alt="" decoding="async" />
          </div>
        </div>
      </section>

      {/* More work */}
      <section className="idx" data-tone="light" aria-labelledby="more-title">
        <div className="hd">
          <h2 id="more-title" className="oss-disp">More work</h2>
          <Link className="oss-lnk" to="/work">
            All work ({projects.length}) &#8594;
          </Link>
        </div>
        <ul>
          {indexProjects.map((p) => (
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

      {/* Process */}
      <section className="proc" data-tone="light" aria-labelledby="proc-title">
        <h2 id="proc-title" className="oss-disp">From first form to live site in days, not months.</h2>
        <ol>
          {steps.map((s, i) => (
            <li key={s.title} className={`step s${i + 1}`}>
              <b>{s.title}</b>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Pricing */}
      <section className="price" aria-labelledby="price-title">
        <div className="l">
          <h2 id="price-title" className="oss-disp">Fixed prices, written down.</h2>
          <p>Three packages, one price each. What each includes and what costs extra is on the packages page.</p>
          <Link className="oss-lnk" to="/packages">
            Compare packages &#8594;
          </Link>
        </div>
        <ul className="rows">
          {packages.map((pk) => (
            <li key={pk.name}>
              <div className="nm">
                {pk.name}
                {pk.tag && <span className="oss-tag">{pk.tag}</span>}
                <small>{pk.note}</small>
              </div>
              <div className="mt">{pk.days}</div>
              <div className="pr">{pk.price}</div>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </Layout>
  );
}
