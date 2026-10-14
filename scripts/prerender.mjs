// Post-build step: give every route its own static HTML head (title, description, canonical, Open Graph,
// Twitter, robots) so crawlers and link previews that don't run JavaScript see the right tags.
// Source of truth: src/data/meta.json, the same file the React <Seo> component reads.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { HUB_PATH, hubDescription, hubJsonLd, hubTitle, locationJsonLd, locationPath, staticHubHtml, staticLocationHtml } from "../src/lib/locationSeo.mjs";
import { fileURLToPath } from "node:url";

import { GUIDES_PATH, guideJsonLd, guidePath, guidesHubDescription, guidesHubJsonLd, guidesHubTitle, staticGuideHtml, staticGuidesHubHtml } from "../src/lib/guideSeo.mjs";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://onesimplesite.co.uk";
const meta = JSON.parse(readFileSync(join(root, "src/data/meta.json"), "utf8"));
const locData = JSON.parse(readFileSync(join(root, "src/data/locations.json"), "utf8"));
// Local pages: head, structured data and a plain-HTML copy of the page text, all from src/data/locations.json.
const extra = { [HUB_PATH]: { title: hubTitle, description: hubDescription, jsonLd: hubJsonLd(locData, SITE), body: staticHubHtml(locData) } };
for (const l of locData.locations) extra[locationPath(l.slug)] = { title: l.title, description: l.metaDescription, jsonLd: locationJsonLd(l, locData, SITE), body: staticLocationHtml(l, locData) };
const guideData = JSON.parse(readFileSync(join(root, "src/data/guides.json"), "utf8"));
extra[GUIDES_PATH] = { title: guidesHubTitle, description: guidesHubDescription, jsonLd: guidesHubJsonLd(guideData, SITE), body: staticGuidesHubHtml(guideData) };
for (const g of guideData.guides) extra[guidePath(g.slug)] = { title: g.title, description: g.metaDescription, jsonLd: guideJsonLd(g, guideData, SITE), body: staticGuideHtml(g, guideData) };
for (const [p, m] of Object.entries(extra)) meta[p] = m;
const template = readFileSync(join(dist, "index.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function render(path, m) {
  const url = SITE + (path === "/" ? "/" : path);
  const image = `${SITE}/og-image.png`;
  // data-rh marks these as owned by react-helmet-async, so the <Seo> component replaces them on hydration instead of duplicating them.
  const tag = (t) => t.replace(/ \/>$/, ' data-rh="true" />');
  const head = [
    tag(`<meta name="description" content="${esc(m.description)}" />`),
    tag(`<meta name="robots" content="${m.noindex ? "noindex, nofollow" : "index, follow"}" />`),
    tag(`<link rel="canonical" href="${url}" />`),
    tag(`<meta property="og:type" content="website" />`),
    tag(`<meta property="og:site_name" content="OneSimpleSite" />`),
    tag(`<meta property="og:locale" content="en_GB" />`),
    tag(`<meta property="og:url" content="${url}" />`),
    tag(`<meta property="og:title" content="${esc(m.title)}" />`),
    tag(`<meta property="og:description" content="${esc(m.description)}" />`),
    tag(`<meta property="og:image" content="${image}" />`),
    tag(`<meta property="og:image:width" content="1200" />`),
    tag(`<meta property="og:image:height" content="630" />`),
    tag(`<meta name="twitter:card" content="summary_large_image" />`),
    tag(`<meta name="twitter:title" content="${esc(m.title)}" />`),
    tag(`<meta name="twitter:description" content="${esc(m.description)}" />`),
    tag(`<meta name="twitter:image" content="${image}" />`),
  ].join("\n    ");
  if (!template.includes("<!--oss-head-->")) throw new Error("prerender: <!--oss-head--> marker missing from index.html");
  if (!/<title>[^<]*<\/title>/.test(template)) throw new Error("prerender: <title> missing from index.html");
  const ld = (m.jsonLd ?? []).map((b) => `<script type="application/ld+json" data-rh="true">${JSON.stringify(b).replace(/</g, "\\u003c")}</script>`).join("\n    ");
  const out = template
    .replace("<!--oss-head-->", head + (ld ? `\n    ${ld}` : ""))
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`);
  return m.body ? out.replace('<div id="root"></div>', `<div id="root">${m.body}</div>`) : out;
}

let count = 0;
const urls = [];
for (const [path, m] of Object.entries(meta)) {
  const html = render(path, m);
  if (path === "/") writeFileSync(join(dist, "index.html"), html);
  else {
    const dir = join(dist, path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
  }
  count++;
  if (!m.noindex && !path.startsWith("/checkout")) urls.push(path);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((p) => `  <url><loc>${SITE}${p === "/" ? "/" : p}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n")}\n</urlset>\n`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);
if (!existsSync(join(dist, "robots.txt"))) throw new Error("prerender: robots.txt missing from dist");
console.log(`prerender: ${count} routes, ${urls.length} in sitemap`);
