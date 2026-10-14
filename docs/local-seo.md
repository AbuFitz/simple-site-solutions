# Local SEO pages

OneSimpleSite serves the whole UK. The positioning line, used everywhere: **"OneSimpleSite provides web design and development for businesses across the UK."**

## What exists

- `/web-design` is the hub, grouped by county.
- `/web-design/<slug>` has one page for each of: Hemel Hempstead, St Albans, Watford, London, Luton, Dunstable, Harpenden, Hatfield, Welwyn Garden City, Stevenage, Aylesbury, Milton Keynes.
- All copy lives in `src/data/locations.json`. `src/lib/locationSeo.mjs` builds titles, FAQ, JSON-LD (BreadcrumbList, Service, FAQPage) and a plain-HTML copy of each page, shared by the React pages and `scripts/prerender.mjs`.
- The build writes each page's head, structured data and a static copy of the page text into its own `index.html`, so crawlers that don't run JavaScript read the same content. Pages are in the sitemap and linked from every page footer, the hub and each other.

## Rules these pages follow

- No claim of a local office, address, local clients, reviews, ratings, years or awards. The pages say plainly that we work online across the UK.
- Each page has its own written copy (intro, local context, sectors, nearby places, questions). `tests/locations.test.ts` fails if copy is repeated between places, titles or descriptions are duplicated or too long, or banned claims appear. Add a place by writing real copy for it, not by cloning another.
- Local facts are limited to well-known ones (county, new-town and city history, landmarks, neighbouring towns). Check any new fact before adding it.
- No guarantee of rankings.

## To do outside the code (owner)

1. Add the site to Google Search Console and submit `sitemap.xml`; request indexing for the hub and each place page.
2. Create the Google Business Profile as a service-area business. Do not publish a premises address you do not have. Use the same name, phone and email as the site.
3. Keep name, phone and email identical across every listing.
4. Earn real reviews and add them only when they exist.
5. Add further places only when there is something genuine to say about each.
