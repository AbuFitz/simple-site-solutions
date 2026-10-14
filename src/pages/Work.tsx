import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { projects } from "@/data/work";

export default function Work() {
  return (
    <Layout>
      <Seo path="/work"
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Our Work", path: "/work" },
        ])}
      />
      <section className="relative pt-24 pb-10 sm:pt-32 sm:pb-14">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10">
          <h1 className="text-headline max-w-3xl">
            Sites we've <span className="text-primary">built</span>
          </h1>
          <p className="text-body-lg mt-4 max-w-2xl">
            Real projects, with what we built for each. Some are for other businesses and some are our own or sister projects; each one says which stage it is at. We don't publish results we can't back up.
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="content-width">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <li key={p.slug} className="bordered-section flex flex-col bg-card">
                <Link to={`/work/${p.slug}`} className="group block focus-visible:outline-offset-[-2px]">
                  <img
                    src={p.img.t}
                    width={800}
                    height={500}
                    loading="lazy"
                    decoding="async"
                    alt={`${p.name} website, top of the home page`}
                    className="aspect-[8/5] w-full object-cover object-top"
                  />
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground">
                      {p.sector} · {p.status}
                    </p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight group-hover:text-primary">{p.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                    <span className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-primary">View project details</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
}
