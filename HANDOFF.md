# PIZA — Project Handoff

Context for a fresh session picking up this project. Read this, then `README.md`.

---

## What this is

A single-page site for **PIZA / PIZA Global** — a creator-first talent
management company founded by **Stephanie Piza** in Los Angeles.

Brand tone: bold, defiant, future-focused. Fashion-house-meets-venture-studio,
not a corporate agency template.

- **Stack:** Next.js 15 (App Router) + React 19, TypeScript. `output: 'export'`
  produces a fully static site; there is no server runtime.
- **Fonts:** display **Space Grotesk** via `next/font/google` (self-hosted into
  the bundle at build, so no runtime request to Google); body **Satoshi** from
  Fontshare via a stylesheet link in `app/layout.tsx`.
- **No CSS framework.** All styling is hand-written in `app/globals.css`.

## Where it lives

- **GitHub:** https://github.com/14rd/piza (account `14rd`, branch `master`)
- **Live URL:** https://piza.studiosubtract.com
- **Hosting:** GitHub Pages, **Source: GitHub Actions** (`.github/workflows/deploy.yml`).
  DNS is on Namecheap: `CNAME` record, host `piza` → `14rd.github.io`.

## Deploy loop

```bash
git add -A && git commit -m "…" && git push
```

The Action builds and publishes. If a deploy fails, check the run under the
repo's Actions tab before touching Pages settings.

Two files must keep existing in `public/`:
- `CNAME` — the custom domain. Losing it drops the domain on next deploy.
- `.nojekyll` — without it Jekyll strips `_next/`, and the site loads unstyled
  with no JS.

---

## Architecture

The page does **not** scroll content. Seven `100svh` spacers create scroll
length; the seven scenes are absolutely positioned on a fixed stage and
**crossfade in place** over a persistent WebGL background.

- `app/page.tsx` — spacers + `<ScrollStage>` wrapping the seven scenes.
- `components/ScrollStage.tsx` — the scroll engine. Per frame it computes
  `pos = scrollY / vh`, and for each scene `d = pos - i`, opacity via smoothstep
  of `max(0, 1 - |d|·1.6)`, plus a 42px parallax drift and a scale-to-fit factor.
  It mutates styles directly on the DOM — **no React state, no re-render per
  frame**. Keep it that way.
- `components/CloudShader.tsx` — 6-octave domain-warped fbm cloud. Scroll
  advances the field's evolution (it never translates); cursor movement stirs
  local turbulence. Falls back to a CSS gradient without WebGL.
- `components/CharReveal.tsx` — splits text into per-character spans with a
  random 0–0.75s stagger. The stage adds `.pz-on` when a scene passes 55%
  opacity and removes it below 6%, so reveals replay on every re-entry.

### Scene order
`Hero → Why PIZA → About → Roster → Founder → Press/Notes → Contact`
(spacer ids: `top, manifesto, essence, roster, founder, notes, contact`)

### Scale-to-fit
Scenes taller than the viewport shrink rather than clip. `ScrollStage` sums each
scene's children heights and re-measures on resize, at 700ms/2200ms, and on
`document.fonts.ready`. If you add tall content to a scene and it looks
mysteriously small, this is why.

## Design tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0b0402` | page ground |
| `--text` | `#e5e5e5` | alabaster type |
| `--crimson` | `#930F12` | accent, progress bar, hovers |
| `--mahogany` | `#2F0E00` | mid-tone in shader, inverted button text |
| `--ease` | `cubic-bezier(.16,1,.3,1)` | the easing signature |

Alabaster is used at many alpha steps (.45–.85) for hierarchy. Hairlines are
`rgba(229,229,229,.12–.28)`. Radius 999px on pills only; everything else square.
No shadows. Micro-labels are 10px, letter-spacing .2–.24em, uppercase.

---

## Open items

1. **Roster is placeholder.** Only two clients are confirmed (Vic Mensa, Edgar
   Esteves); they repeat 3× to fill the 3×2 grid, per the design handoff. Real
   roster and six portraits are pending from the client. Edit `lib/content.ts`.
2. **Founder portrait pending.** The 4:5 slot in `components/scenes/Founder.tsx`
   renders a "Portrait / awaiting" placeholder.
3. **Contact form has no endpoint.** `components/ContactForm.tsx` calls
   `preventDefault()` and flips a label. Nothing is sent anywhere. Wire it to a
   form service or a mailto before launch.
4. **Confirm contact details** — `inbox@piza.global` and `@piza.global`.

## Copy rules

- All copy in `lib/content.ts` and the scene components is **final** per the
  design handoff. Do not rewrite it.
- Typographic characters are deliberate: em dashes, curly quotes, and the
  non-breaking space in "Charles D. King". Preserve them.
- ⚠ Note a conflict with the previous brand guidance, which said **no em or en
  dashes anywhere**. The current design copy uses em dashes throughout. The
  design handoff is newer and was followed; worth confirming with the client.

## Quality bar

- Semantic landmarks, alt text, visible focus states, AA contrast.
- `prefers-reduced-motion` is honoured: character stagger is skipped, grain is
  hidden, shader speed drops to 20%. The scene crossfade stays, since it is the
  navigation mechanism.
- No console errors.
