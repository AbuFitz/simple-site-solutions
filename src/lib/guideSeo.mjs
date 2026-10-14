// Shared by the React guide pages and scripts/prerender.mjs (same idea as locationSeo.mjs).
export const GUIDES_PATH = "/guides";
export const guidePath = (slug) => `${GUIDES_PATH}/${slug}`;
export const guidesHubTitle = "Website Guides for Small Businesses | OneSimpleSite";
export const guidesHubDescription = "Plain guides to choosing between website builders like GoDaddy, One.com, Wix, Squarespace and WordPress, and a web designer, written for UK small businesses.";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const org = (siteUrl) => ({ "@type": "Organization", name: "OneSimpleSite", url: siteUrl });

export function guideJsonLd(g, data, siteUrl) {
  const url = siteUrl + guidePath(g.slug);
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: siteUrl + GUIDES_PATH },
        { "@type": "ListItem", position: 3, name: g.short, item: url },
      ],
    },
    { "@context": "https://schema.org", "@type": "Article", headline: g.h1, description: g.metaDescription, url, mainEntityOfPage: url, datePublished: data.published, dateModified: data.published, author: org(siteUrl), publisher: org(siteUrl) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
}

export function guidesHubJsonLd(data, siteUrl) {
  return [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: "Guides", item: siteUrl + GUIDES_PATH }] },
    { "@context": "https://schema.org", "@type": "CollectionPage", name: "Website guides for small businesses", url: siteUrl + GUIDES_PATH, mainEntity: { "@type": "ItemList", itemListElement: data.guides.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: siteUrl + guidePath(g.slug), name: g.h1 })) } },
  ];
}

export function staticGuideHtml(g, data) {
  const by = Object.fromEntries(data.guides.map((x) => [x.slug, x]));
  return `<main data-static-seo>
<nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="${GUIDES_PATH}">Guides</a> / ${esc(g.short)}</nav>
<h1>${esc(g.h1)}</h1>
<p>${esc(g.dek)}</p>
${g.sections.map((s) => `<h2>${esc(s.h)}</h2>${s.p.map((p) => `<p>${esc(p)}</p>`).join("")}`).join("\n")}
<h2>Questions to ask before you decide</h2>
<ul>${g.checklist.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
<h2>Common questions</h2>
${g.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("\n")}
<p>${esc(data.disclaimer)}</p>
<ul>${g.related.filter((s) => by[s]).map((s) => `<li><a href="${guidePath(s)}">${esc(by[s].h1)}</a></li>`).join("")}</ul>
<p><a href="/packages">Website packages and prices</a> · <a href="/web-design">Web design across the UK</a> · <a href="/start">Start your project</a></p>
</main>`;
}

export function staticGuidesHubHtml(data) {
  return `<main data-static-seo>
<nav aria-label="Breadcrumb"><a href="/">Home</a> / Guides</nav>
<h1>Website guides for small businesses</h1>
<p>Plain guides to choosing between a do-it-yourself website builder and a web designer.</p>
<ul>${data.guides.map((g) => `<li><a href="${guidePath(g.slug)}">${esc(g.h1)}</a>: ${esc(g.dek)}</li>`).join("")}</ul>
<p>${esc(data.disclaimer)}</p>
</main>`;
}
