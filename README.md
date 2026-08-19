# PIZA — Representation 2.0

Single-page site for PIZA Global. Next.js (App Router, TypeScript), statically
exported and served from GitHub Pages at **https://piza.studiosubtract.com**.

## Develop

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build

```bash
npm run build
```

Writes a fully static site to `out/`. There is no server runtime.

## Deploy

Push to `master`. The `Deploy to GitHub Pages` Action builds and publishes
`out/` automatically. Nothing to run by hand.

> Pages must be set to **Settings → Pages → Source: GitHub Actions** (not
> "Deploy from a branch"). `public/CNAME` holds the custom domain and
> `public/.nojekyll` stops Jekyll from stripping Next's `_next/` directory —
> both are copied into `out/` at build.

## Layout

| Path | What |
|------|------|
| `app/page.tsx` | composes the seven scenes |
| `app/layout.tsx` | metadata, fonts |
| `app/globals.css` | all styling and design tokens |
| `components/CloudShader.tsx` | WebGL cloud background |
| `components/ScrollStage.tsx` | scroll engine and scene crossfade |
| `components/CharReveal.tsx` | character-level text reveal |
| `components/scenes/` | one file per scene |
| `lib/content.ts` | all copy and roster/press data |
| `public/assets/` | logotype SVG, inflated logomark |

See `HANDOFF.md` for architecture, brand rules, and open items.
