import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { getProject, projects } from "@/data/work";
import NotFound from "./NotFound";

export default function WorkDetail() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;

  const i = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <Layout>
      <Seo
        path={`/work/${project.slug}`}
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Our Work", path: "/work" },
          { name: project.name, path: `/work/${project.slug}` },
        ])}
      />
      <section className="relative pt-24 pb-8 sm:pt-32">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10">
          <Link to="/work" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All work
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            {project.sector} · {project.place} · {project.status}
          </p>
          <h1 className="text-headline mt-2">{project.name}</h1>
          <p className="text-body-lg mt-4 max-w-2xl">{project.summary}</p>
        </div>
      </section>

      <section className="pb-12">
        <div className="content-width grid items-start gap-6 lg:grid-cols-[1fr_260px]">
          <div className="bordered-section bg-card">
            <img
              src={project.img.t}
              width={800}
              height={500}
              decoding="async"
              alt={`${project.name} website on desktop`}
              className="aspect-[8/5] w-full object-cover object-top"
            />
          </div>
          <div className="mx-auto w-[220px] overflow-hidden rounded-[2rem] border-4 border-border bg-card lg:w-full">
            <img
              src={project.img.m}
              width={520}
              height={1125}
              loading="lazy"
              decoding="async"
              alt={`${project.name} website on a phone`}
              className="aspect-[520/1125] w-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="content-width grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-title">What we built</h2>
            <ul className="mt-4 space-y-3">
              {project.built.map((b) => (
                <li key={b} className="flex gap-3 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-title">Built with</h2>
            <p className="mt-4 text-muted-foreground">{project.stack.join(", ")}</p>
            <h2 className="text-title mt-8">Results</h2>
            <p className="mt-4 text-muted-foreground">
              We don't publish traffic, enquiry or revenue figures for this project, because we can't verify them for you.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="content-width">
          <div className="bordered-section flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-title">Want something like this?</h2>
              <p className="mt-1 text-muted-foreground">See what each package includes, or send us a short brief.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/packages" className="btn-outline btn-md min-h-[44px] justify-center">See packages</Link>
              <Link to="/start" className="btn-primary btn-md min-h-[44px] justify-center !text-background">Start a project</Link>
            </div>
          </div>
          <nav aria-label="More projects" className="mt-8 flex justify-between gap-4 text-sm">
            <Link to={`/work/${prev.slug}`} className="inline-flex min-h-[44px] items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {prev.name}
            </Link>
            <Link to={`/work/${next.slug}`} className="inline-flex min-h-[44px] items-center gap-2 text-muted-foreground hover:text-foreground">
              {next.name} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </section>
    </Layout>
  );
}
