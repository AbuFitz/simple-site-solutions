import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Scene3D } from "@/components/three/Scene3D";
import { Finale } from "@/components/sections/Finale";
import { getProject, projects } from "@/data/work";
import NotFound from "./NotFound";

export default function CaseStudy() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;
  const i = projects.indexOf(project);
  const next = projects[(i + 1) % projects.length];

  const facts: [string, string][] = [
    ["Sector", project.sector],
    ["Type", project.kind],
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

      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="content-width">
          <Link to="/work" className="mono inline-flex items-center gap-2 text-[11px] tracking-[0.14em] text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> ALL WORK
          </Link>
          <p className="eyebrow mt-8 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {project.kind}
          </p>
          <h1 className="text-display mt-4 max-w-5xl">{project.name}</h1>
          <p className="text-body-lg mt-5 max-w-xl">{project.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg gap-2">
                Visit {project.domain}
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            <Link to="/start" className="btn-outline btn-lg gap-2">
              Start your project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <Scene3D
          scene="device"
          sceneProps={{ slug: project.slug }}
          eager
          label={`Desktop and phone captures of ${project.name}, scrolling through the site`}
          className="mt-6 h-[min(56svh,420px)] w-full sm:h-[min(66vh,620px)]"
          poster={
            <div className="flex h-full items-center justify-center px-6">
              <img src={project.img.t} alt="" className="w-full max-w-3xl rounded-xl border border-border shadow-2xl" />
            </div>
          }
        />
      </section>

      <section className="chapter chapter-paper chapter-sheet" aria-labelledby="built-title">
        <div className="content-width section">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="built-title" className="text-headline">
                What we <span className="text-signal">built</span>
              </h2>
              <ul className="mt-8 space-y-4">
                {project.built.map((b) => (
                  <li key={b} className="flex items-start gap-3 border-b border-border pb-4 text-lg">
                    <span className="check-icon">
                      <Check className="h-3 w-3" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <aside className="lg:col-span-5">
              <dl className="slab divide-y divide-border">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 p-5">
                    <dt className="eyebrow">{k}</dt>
                    <dd className="text-right text-sm font-medium">{v}</dd>
                  </div>
                ))}
                <div className="p-5">
                  <dt className="eyebrow mb-3">Built with</dt>
                  <dd className="flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span key={s} className="badge-muted">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
              {project.status === "Private app" && (
                <p className="mt-4 text-sm text-muted-foreground">
                  This app is private, so the images are an illustration of its real flow rather than a capture.
                </p>
              )}
              {project.status === "Preview build" && (
                <p className="mt-4 text-sm text-muted-foreground">Captured from the production build. It is not yet live at a public address.</p>
              )}
            </aside>
          </div>

          <Link
            to={`/work/${next.slug}`}
            className="slab group mt-16 flex items-center justify-between gap-6 p-6 transition-transform hover:-translate-y-1 sm:p-8"
          >
            <div>
              <p className="eyebrow mb-2">Next project</p>
              <p className="font-display text-2xl font-bold sm:text-4xl" style={{ letterSpacing: "-0.04em" }}>
                {next.name}
              </p>
            </div>
            <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <Finale />
    </Layout>
  );
}
