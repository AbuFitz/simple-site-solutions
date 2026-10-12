# One Simple SitE

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

## Design system (editorial rebuild)

- Type: Bricolage Grotesque (display) and Figtree (body), self-hosted via Fontsource (OFL). Both are set through `--font-display` and `--font-body` in `src/index.css`; change those two variables (and `tailwind.config.ts`) to switch fonts.
- Tokens: warm-white pages with `.theme-ink` for black panels. Brand green is the accent.
- Building blocks in `src/components/oss/`: `Pill` (CTA with connected arrow), `Label`, `Shot` (real project capture inside an original contour such as a stepped notch, built by `clip.ts`) and `FaqList`.
- Motion is CSS-only (`data-rise`, `data-drift`) and never hides content; it is disabled for `prefers-reduced-motion`.
- Project data and captures: `src/data/work.ts`, `src/assets/work/`. Only claims verified against each project's repo or live site belong there.
- Review screenshots: `docs/redesign-screenshots/`.
