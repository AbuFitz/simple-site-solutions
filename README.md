# One Simple SitE

Websites for local UK businesses using proven layouts that work.

## TechnologieS

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Development

```sh
# Install dependencies
npm i

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Our Work (3D) and website previews

- **Our Work** (`src/components/sections/WorkShowcase.tsx`, `src/components/three/`): a lazy-loaded 3D rack of real project captures. It renders only while something moves, loads the long full-page capture only for the settled project, and falls back to a plain browser frame without WebGL, with `?3d=0`, with data-saver, or with reduced motion. Add `?debug3d` to the URL to expose frame, draw-call and texture counts on `window.__oss3d`.
- **Website previews** (`/preview`): `src/lib/preview/` holds the category configs (`categories.ts`), the pure generator, UK phone normalisation, package recommendation and shareable-URL state (`generate.ts`, covered by `generate.test.ts`). `src/components/preview/` renders the result. To add a category, add one entry to `categories.ts`; the tests check every palette for contrast and every line of copy for unsupported claims.
- **Preview in the project form** (`/start`): `src/components/preview/FlowPreview.tsx` shows the live preview beside the form from step 2 (or from step 1 when it arrived from `/preview`). `mergeFlowInput()` combines the earlier preview choices with what is typed, the preview choice is remembered for the tab only (`sessionStorage`), and a link to the preview can be attached to the enquiry (optional checkbox).
- Pricing and offer review agenda: `docs/pricing-review.md`. Review screenshots: `docs/review/`.

## Testing and quality

```bash
npm run lint                  # eslint
npx tsc -p tsconfig.app.json  # app types; tsconfig.api.json for the serverless API
npm test                      # vitest: preview generator, draft, schema, checkout lib, API handlers (tests/api)
npm run build                 # vite build + per-route head prerender + sitemap
PW_CHROMIUM=/path/to/chromium npx playwright test   # e2e + axe against `vite preview` (build first)
```

The e2e suite covers every route at 320, 390, 768, 1440 and 2200px (one h1, no console errors, no horizontal overflow), static metadata, canonical and sitemap, internal links, banned claims, the 3D fallbacks (`?3d=0`, reduced motion, no WebGL), package selection, the brief form (validation, draft persistence, success, failure, rate limit), contact, checkout gating and result pages, and axe (WCAG 2.2 AA) on every page at mobile and desktop.

## Docs

- `docs/fact-ledger.md`: verified, provisional and blocked facts. Read before changing any claim.
- `docs/deployment.md`: separate Vercel project, environment variables, Stripe test mode, fail-closed behaviour.
- `docs/security-review.md`: form and payment API review.
- `docs/research-notes.md`: UK buyer, competitor and legal research with sources.
- `docs/pricing-review.md`: open pricing decisions.

## Shop

`/shop` sells personalised QR and NFC products (review cards and stands, a review kit, smart business cards, QR table signs, window and van stickers, and a digital QR pack). Catalogue, prices and personalisation rules are one file: `src/data/shop.ts`, read by both the browser and the API. Stripe hosted Checkout, signed webhook, order records and fulfilment hand-off are built and tested, and the shop is **closed by default** until the owner approves the prices and configures real Stripe Price IDs: see `docs/shop-launch.md` and `docs/shop-catalogue.md`.

## Payments

Online payment (Stripe hosted Checkout) is built but **off by default**. It turns on only when every requirement in `docs/deployment.md` is met. Until then the site takes enquiries only and never shows a pay button.
