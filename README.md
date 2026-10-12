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

## Experience layer

- `src/components/three/` holds the 3D layer. Pages only touch `Scene3D`, which imports no three.js: it shows a CSS poster first, lazy-loads the WebGL engine near the viewport, pauses off-screen, and falls back to the poster with no WebGL, `?3d=0`, or data-saver. Reduced motion renders a static composition.
- Scenes: `hero`, `work`, `core`, `path`, `towers`, `finale`, `device` (one canvas mounted at a time per section).
- Portfolio data lives in `src/data/work.ts`; captures are in `src/assets/work/` (`-d` desktop full page, `-m` phone, `-t` thumbnail). Only claims verified against each project's repo or live site belong there.
