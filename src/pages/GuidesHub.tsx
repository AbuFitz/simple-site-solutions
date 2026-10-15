import { Link } from "react-router-dom";
import { GuideArt } from "@/components/oss/GuideArt";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/seo/Seo";
import { DottedGrid } from "@/components/ui/DottedGrid";
import { SITE } from "@/data/site";
import guideData from "@/data/guides.json";
import { GUIDES_PATH, guidePath, guidesHubDescription, guidesHubJsonLd, guidesHubTitle, type GuideData } from "@/lib/guideSeo.mjs";

const data = guideData as GuideData;

export default function GuidesHub() {
  return (
    <Layout pageClass="pg pg-inner gd">
      <Seo path={GUIDES_PATH} title={guidesHubTitle} description={guidesHubDescription} jsonLd={guidesHubJsonLd(data, SITE.url)} />
      <section className="relative pb-8 pt-24 sm:pb-12 sm:pt-32">
        <DottedGrid className="opacity-30" spacing={32} />
        <div className="content-width relative z-10 max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link> / <span aria-current="page">Guides</span>
          </nav>
          <h1 className="text-headline">Website guides for <span className="text-primary">small businesses</span></h1>
          <p className="text-body-lg mt-4">Plain guides to choosing between a do-it-yourself website builder and a web designer, written for UK small businesses.</p>
        </div>
      </section>
      <section className="pb-16 sm:pb-24">
        <div className="content-width">
          <ul className="gd-grid">
            {data.guides.map((g) => (
              <li key={g.slug}>
                <Link to={guidePath(g.slug)} className="gd-card group">
                  <GuideArt slug={g.slug} />
                  <span className="gd-card__t">{g.h1}</span>
                  <span className="gd-card__d">{g.dek}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-xs text-muted-foreground">{data.disclaimer}</p>
        </div>
      </section>
    </Layout>
  );
}
