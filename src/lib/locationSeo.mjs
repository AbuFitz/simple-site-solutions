// Shared by the React location pages and by scripts/prerender.mjs, so the static HTML that crawlers
// read without JavaScript says exactly what the rendered page says. Pure functions over src/data/locations.json.

export const HUB_PATH = "/web-design";
export const locationPath = (slug) => `${HUB_PATH}/${slug}`;

const fill = (s, name) => s.replaceAll("{city}", name);

/** City-specific questions first, then the shared ones with the city name filled in. */
export const faqFor = (loc, data) => [...loc.faq, ...data.shared.faq.map((f) => ({ q: fill(f.q, loc.name), a: fill(f.a, loc.name) }))];

export const hubTitle = "Web Design Across the UK | Local Areas | OneSimpleSite";
export const hubDescription = "OneSimpleSite provides web design and development for businesses across the UK. Fixed-price websites from £199, with local pages for Hertfordshire, Bedfordshire, Buckinghamshire and London.";

const org = (siteUrl) => ({ "@type": "Organization", name: "OneSimpleSite", url: siteUrl });

export function locationJsonLd(loc, data, siteUrl) {
  const url = siteUrl + locationPath(loc.slug);
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Web design", item: siteUrl + HUB_PATH },
        { "@type": "ListItem", position: 3, name: loc.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Web design and development for ${loc.name} businesses`,
      serviceType: "Web design",
      url,
      description: loc.metaDescription,
      provider: org(siteUrl),
      areaServed: [{ "@type": "AdministrativeArea", name: `${loc.name}, ${loc.county}` }, { "@type": "Country", name: "United Kingdom" }],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqFor(loc, data).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
}

export function hubJsonLd(data, siteUrl) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Web design", item: siteUrl + HUB_PATH },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Web design across the UK",
      url: siteUrl + HUB_PATH,
      description: hubDescription,
      mainEntity: { "@type": "ItemList", itemListElement: data.locations.map((l, i) => ({ "@type": "ListItem", position: i + 1, url: siteUrl + locationPath(l.slug), name: `Web design ${l.name}` })) },
    },
  ];
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Plain, semantic HTML of the page's text for crawlers that don't run scripts. React replaces it on load. */
export function staticLocationHtml(loc, data) {
  const bySlug = Object.fromEntries(data.locations.map((l) => [l.slug, l]));
  return `<main data-static-seo>
<nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="${HUB_PATH}">Web design</a> / ${esc(loc.name)}</nav>
<h1>${esc(loc.h1)}</h1>
<p>${esc(data.ukLine)} ${esc(`That includes businesses in ${loc.name}, ${loc.county}, and the surrounding area.`)}</p>
${loc.intro.map((p) => `<p>${esc(p)}</p>`).join("\n")}
<h2>${esc(`Web design and the ${loc.name} area`)}</h2>
<p>${esc(loc.local)}</p>
<h2>${esc(`Who we build for in ${loc.name}`)}</h2>
<ul>${loc.sectors.map((s) => `<li><strong>${esc(s.name)}</strong>: ${esc(s.line)}</li>`).join("")}</ul>
<h2>${esc("What we set up for local search")}</h2>
<ul>${data.shared.localSeo.map((s) => `<li><strong>${esc(s.title)}</strong>: ${esc(s.body)}</li>`).join("")}</ul>
<h2>${esc(`Places near ${loc.name} we build for`)}</h2>
<p>${esc(loc.areas.join(", "))}</p>
<h2>${esc("How it works")}</h2>
<ol>${data.shared.steps.map((s) => `<li><strong>${esc(s.title)}</strong>: ${esc(s.body)}</li>`).join("")}</ol>
<h2>${esc(`Questions from ${loc.name} businesses`)}</h2>
${faqFor(loc, data).map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("\n")}
<h2>${esc("Web design nearby")}</h2>
<ul>${loc.neighbours.filter((s) => bySlug[s]).map((s) => `<li><a href="${locationPath(s)}">Web design ${esc(bySlug[s].name)}</a></li>`).join("")}</ul>
<p><a href="/packages">Website packages and prices</a> · <a href="/preview">Free website preview</a> · <a href="/start">Start your project</a></p>
</main>`;
}

export function staticHubHtml(data) {
  const counties = [...new Set(data.locations.map((l) => l.county))];
  return `<main data-static-seo>
<nav aria-label="Breadcrumb"><a href="/">Home</a> / Web design</nav>
<h1>Web design across the UK</h1>
<p>${esc(data.ukLine)} We work online, at fixed prices, with local businesses wherever they are. These pages cover the areas where we are building local search presence first.</p>
${counties.map((c) => `<h2>${esc(c)}</h2><ul>${data.locations.filter((l) => l.county === c).map((l) => `<li><a href="${locationPath(l.slug)}">Web design ${esc(l.name)}</a></li>`).join("")}</ul>`).join("\n")}
<p><a href="/packages">Website packages and prices</a> · <a href="/preview">Free website preview</a> · <a href="/start">Start your project</a></p>
</main>`;
}
