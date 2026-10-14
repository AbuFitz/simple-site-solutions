import { Helmet } from "react-helmet-async";
import { SITE } from "@/data/site";
import routeMeta from "@/data/meta.json";

const META = routeMeta as Record<string, { title: string; description: string; noindex?: boolean }>;

interface SeoProps {
  /** Optional: defaults to the entry for `path` in src/data/meta.json, which the build also uses to prerender each route's head. */
  title?: string;
  description?: string;
  /** Path beginning with "/". Used for the canonical and social URLs. */
  path: string;
  noindex?: boolean;
  /** Verified structured data only. Never add ratings or reviews without a real source. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function Seo({ title: titleProp, description: descProp, path, noindex: noindexProp, jsonLd }: SeoProps) {
  const m = META[path];
  const title = titleProp ?? m?.title ?? SITE.name;
  const description = descProp ?? m?.description ?? "";
  const noindex = noindexProp ?? m?.noindex;
  const url = `${SITE.url}${path === "/" ? "/" : path}`;
  const image = `${SITE.url}/og-image.png`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(b)}
        </script>
      ))}
    </Helmet>
  );
}

export const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE.url}${it.path}`,
  })),
});
