# One Simple Site

Websites for local UK businesses using proven layouts that work.

## Technologies

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
- Pricing and offer review agenda: `docs/pricing-review.md`. Review screenshots: `docs/review/`.
