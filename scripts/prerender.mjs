// Post-build step: give every route its own static HTML head (title, description, canonical, Open Graph,
// Twitter, robots) so crawlers and link previews that don't run JavaScript see the right tags.
// Source of truth: src/data/meta.json, the same file the React <Seo> component reads.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://onesimplesite.co.uk";
const meta = JSON.parse(readFileSync(join(root, "src/data/meta.json"), "utf8"));
const template = readFileSync(join(dist, "index.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function render(path, m) {
  const url = SITE + (path === "/" ? "/" : path);
  let html = template;
  const set = (re, replacement) => {
    if (!re.test(html)) throw new Error(`prerender: pattern not found in index.html: ${re}`);
    html = html.replace(re, replacement);
  };
  set(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`);
  set(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(m.title)}" />`);
  set(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(m.description)}" />`);
  set(/<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${m.noindex ? "noindex, nofollow" : "index, follow"}" />`);
  set(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(m.title)}" />`);
  set(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(m.description)}" />`);
  set(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(m.title)}" />`);
  set(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(m.description)}" />`);
  html = html.replace("</head>", `    <link rel="canonical" href="${url}" data-rh="true" />\n    <meta property="og:url" content="${url}" />\n    <meta name="twitter:url" content="${url}" />\n  </head>`);
  return html;
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
