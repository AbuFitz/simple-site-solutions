import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo, breadcrumb } from "@/components/seo/Seo";
import { CaseStudy } from "@/components/oss/CaseStudy";
import { getProject, projects } from "@/data/work";
import NotFound from "./NotFound";

export default function WorkDetail() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;

  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(i + 1) % projects.length];

  return (
    <Layout pageClass="pg pg-case">
      <Seo
        path={`/work/${project.slug}`}
        jsonLd={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Our Work", path: "/work" },
          { name: project.name, path: `/work/${project.slug}` },
        ])}
      />
      <CaseStudy key={project.slug} project={project} next={next} />
    </Layout>
  );
}
