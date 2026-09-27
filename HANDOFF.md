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
- **Fonts:** display **General Sans**, body **Satoshi**, both from Fontshare
  via stylesheet links in `app/layout.tsx` (one link per family: Fontshare's
  CSS endpoint only serves the first `f[]` it is given). The brand guidelines
  name **Polymath** (Indian Type Foundry, commercial) as the main typeface;
  General Sans is the closest open match. If Polymath is licensed, self-host
  it and change the `--display` token in `app/globals.css`.
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
- `components/CloudShader.tsx` — domain-warped fbm cloud. Scroll advances the
  field's evolution (it never translates); cursor movement stirs local
  turbulence. Falls back to a CSS gradient without WebGL.
  - **Lighting.** Two light sources feed into the noise field before the
    palette ramp, so the cloud lights up from within rather than showing a
    flat disc: a soft bloom trailing the cursor that flares with pointer
    speed, and lightning strikes with a fast decay and a weaker echo. Strikes
    fire off fast cursor movement on pointer devices, and off scroll distance
    with a random gate on touch devices, where there is no cursor. Both are
    applied *after* the palette ceiling, otherwise they clamp flat and read as
    grey. Colours stay in palette: crimson halo, alabaster core.
  - Tuning lives at the top of the render loop: `MIN_GAP` / `GAP_JITTER`
    control how often strikes land.
- **Anchor scrolling** is animated by hand in `ScrollStage`, not via
  `scrollTo({behavior:'smooth'})`. Mobile aborts a native smooth scroll when
  the viewport changes, and the URL bar retracting mid-scroll does exactly
  that, so taps used to land short. Snapping is suspended during the
  animation and a timeout guarantees it lands even if frames stall.
- `components/CharReveal.tsx` — splits text into per-character spans with a
  random 0–0.75s stagger. The stage adds `.pz-on` when a scene passes 55%
  opacity and removes it below 6%, so reveals replay on every re-entry.

### Scene order
`Hero → Why PIZA → About → Roster (on request) → Founder → Press → Contact`
(spacer ids: `top, manifesto, essence, roster, founder, press, contact`)

- **Roster** is not published. The scene is a short statement and a
  `Request roster` button that opens a pre-addressed email to the founder.
- **Founder** shows the first paragraph of the bio; the full six-paragraph bio
  opens in a native `<dialog>` (`components/FounderBio.tsx`) because a fixed,
  crossfading stage cannot hold that much copy.
- **Press** leads with the SpringHill *Call My People* interview
  (`components/InterviewEmbed.tsx`): a self-hosted poster, and the YouTube
  player is only loaded on click.

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

1. **Founder portrait.** Save the client's photo as
   `public/assets/stephanie-piza.jpg` (4:5 crop works best, ~1200px wide) and
   push. `components/scenes/Founder.tsx` checks for the file at build time and
   swaps the placeholder for the image automatically.
2. **Contact form has no backend.** Submitting composes an email to
   `stephanie@piza.global` in the visitor's mail app with the fields filled in.
   Replace with a form service if the client wants submissions stored.
3. **Variety link** in `lib/content.ts` still points at variety.com's home page;
   swap in the article URL when the client has it.
4. **Polymath licence** — see Fonts above.

## Client notes, September 2026 (applied)

Font changed to something more elevated that sits with the logo; About copy
replaced; roster taken down and replaced with a request; full founder bio;
interview added to Press; `stephanie@piza.global` added to Get in touch.

## Copy rules

- All copy in `lib/content.ts` and the scene components is **final** per the
  design handoff and the client's September 2026 notes. Do not rewrite it.
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
