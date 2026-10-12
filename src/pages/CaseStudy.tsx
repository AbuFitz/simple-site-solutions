import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Pill } from "@/components/oss/Pill";
import { Shot } from "@/components/oss/Shot";
import { getProject, projects } from "@/data/work";
import NotFound from "./NotFound";

export default function CaseStudy() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;
  const i = projects.indexOf(project);
  const related = [projects[(i + 1) % projects.length], projects[(i + 2) % projects.length]];

  const facts: [string, string][] = [
    ["Sector", project.sector],
    ["Type of site", project.kind],
    ["Area", project.place],
    ["Status", project.status],
  ];

  return (
    <Layout>
      <Helmet>
        <title>{`${project.name} | ${project.sector} Website | OneSimpleSite`}</title>
        <meta name="description" content={project.summary} />
        <link rel="canonical" href={`https://onesimplesite.co.uk/work/${project.slug}`} />
      </Helmet>

      {/* Opening: title, labels and the site itself */}
      <section className="pb-12 pt-10 md:pb-20 md:pt-16">
        <div className="content-width">
          <Link to="/work" className="link-line text-sm">← All work</Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <h1 className="t-display lg:col-span-9" style={{ fontSize: "clamp(2.7rem, 7.4vw, 6.75rem)" }}>
              {project.name}
            </h1>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm lg:col-span-3 lg:self-end lg:grid-cols-1">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="t-label text-muted-foreground">{k}</dt>
                  <dd className="mt-1 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="content-width mt-10 md:mt-14">
          <Shot project={project} kind="t" contour="notch-br" ratio="16 / 9" radius={32} priority sizes="95vw" alt={`${project.name} homepage on desktop`} />
        </div>
      </section>

      {/* Quiet reading layout */}
      <section className="pb-20 md:pb-32">
        <div className="content-width grid gap-10 lg:grid-cols-12">
          <p className="t-label lg:col-span-3">The site</p>
          <div className="lg:col-span-6 lg:col-start-5">
            <p className="t-h3 !font-semibold" style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.4rem)", lineHeight: 1.15 }}>
              {project.summary}
            </p>
            <h2 className="t-h3 mt-14">What we built</h2>
            <ul className="mt-6 space-y-3">
              {project.built.map((b) => (
                <li key={b} className="flex items-start gap-3 border-b border-border pb-3">
                  <span className="check-icon"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-muted-foreground">
              Built with {project.stack.join(", ")}.
              {project.status === "Preview build" && " Captured from the production build; it is not yet live at a public address."}
            </p>
            {project.url && (
              <div className="mt-8">
                <Pill href={project.url} external>Visit {project.domain}</Pill>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* On screen: the full page at a readable size beside the phone */}
      <section className="theme-ink mx-3 rounded-[28px] md:mx-5 md:rounded-[48px]" aria-labelledby="screens-title">
        <div className="content-width py-16 md:py-28">
          <div className="grid gap-6 lg:grid-cols-12">
            <p className="t-label lg:col-span-3">On screen</p>
            <h2 id="screens-title" className="t-h2 lg:col-span-8">Desktop and phone, as built.</h2>
          </div>
          <div className="mt-14 grid items-start gap-10 lg:grid-cols-12">
            <figure className="lg:col-span-8">
              <div className="max-h-[78vh] overflow-y-auto rounded-[24px] border border-border" tabIndex={0} role="region" aria-label={`Scrollable full-page capture of ${project.name}`}>
                <img src={project.img.d} width={1024} height={project.img.dh} alt={`${project.name} full homepage, desktop capture`} loading="lazy" className="block w-full" />
              </div>
              <figcaption className="mt-3 text-sm text-muted-foreground">Full homepage on desktop. Scroll inside the frame.</figcaption>
            </figure>
            <figure className="mx-auto w-[62%] sm:w-[40%] lg:col-span-4 lg:w-auto lg:sticky lg:top-28">
              <Shot project={project} kind="m" contour="leaf" ratio="520 / 1126" radius={30} sizes="(min-width:1024px) 28vw, 70vw" />
              <figcaption className="mt-3 text-sm text-muted-foreground">The same site on a phone.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section">
        <div className="content-width">
          <div className="grid gap-6 lg:grid-cols-12">
            <h2 className="t-h2 lg:col-span-6">More work</h2>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-12">
            {related.map((p, n) => (
              <Link key={p.slug} to={`/work/${p.slug}`} className={`block md:col-span-6 ${n ? "md:mt-20" : ""}`}>
                <Shot project={p} kind="t" contour={n ? "notch-tl" : "notch-br"} ratio="16 / 10" radius={26} sizes="(min-width:768px) 45vw, 95vw" />
                <h3 className="t-h3 mt-4">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.kind} · {p.sector}</p>
              </Link>
            ))}
          </div>
          <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-10">
            <p className="t-h3 max-w-md">Want a site like this for your business?</p>
            <Pill to="/start">Start your project</Pill>
          </div>
        </div>
      </section>
    </Layout>
  );
}
