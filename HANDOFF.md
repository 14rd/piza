# PIZA — Project Handoff

Context for a fresh Claude Code session picking up this project on a new machine.
Read this first, then `README.md`.

---

## What this is

A single-page marketing site for **PIZA / PIZA Global** — a next-generation talent
management / representation company founded by **Stephanie Piza** in Los Angeles.

Brand tone: bold, defiant, future-focused, "sexy but simplistic." The reference
target is fashion-house-meets-venture-studio (e.g. floema.com), not a corporate
agency template.

- **Stack:** static site, no framework, no build step. Plain `index.html` +
  `styles.css` + `main.js`. Runs by opening the file; deploys to GitHub Pages as-is.
- **Fonts:** Space Grotesk (SIL OFL), self-hosted in `/fonts` (`.ttf`).
- **No external CSS frameworks. All CSS hand-written.** JS is vanilla, using
  `IntersectionObserver` + `requestAnimationFrame` only.

## Where it lives

- **GitHub:** https://github.com/14rd/piza  (account `14rd`, branch `master`)
- **Live URL:** https://piza.studiosubtract.com (GitHub Pages, custom domain via `CNAME`)
- **Hosting:** GitHub Pages, "Deploy from a branch" → `master` / root. `.nojekyll`
  disables Jekyll. `CNAME` holds the custom domain. Domain DNS is on Namecheap
  (a `CNAME` record: host `piza` → `14rd.github.io`).

## Fastest way to take over on the new machine

```bash
git clone https://github.com/14rd/piza.git
cd piza
```

That is the whole transfer — every file (including fonts) is committed. The
accompanying zip is the same tree if you'd rather not clone. To preview locally,
just open `index.html`, or run a static server:

```bash
python -m http.server 3456
```

Then visit http://localhost:3456. There is nothing to install or build.

> Note on editing: the browser aggressively caches `styles.css`/`main.js`. If a
> change doesn't show, hard-reload (Ctrl/Cmd+Shift+R) or append `?v=N` to the
> asset link while iterating.

---

## Brand tokens (defined as CSS custom properties in `styles.css` `:root`)

| Token          | Value      | Use                                   |
|----------------|------------|---------------------------------------|
| `--crimson`    | `#930F12`  | primary accent, key CTA               |
| `--crimson-hi` | `#b3181c`  | hover / hairline accent               |
| `--mahogany`   | `#2b0d00`  | dark backgrounds / near-black         |
| `--mahogany-2` | `#1c0800`  | deeper vignette (mahogany + black)    |
| `--alabaster`  | `#e5e5e5`  | light surfaces / muted text on dark   |
| `--ink`        | `#111`     | body text on light                    |
| `--paper`      | `#fff`     | base / text on dark                   |

**Palette rule from the brand book:** crimson, mahogany, alabaster + black/white
ONLY. No other hues, no gradients on the logo, no unapproved effects. (The
mahogany-family vignettes are just mahogany darkened with black — within palette.)

## Architecture / how the site is built

Every section is a full-viewport `.panel` (`100vh`), alternating
`.panel--dark` / `.panel--light` / `.panel--crimson`. Order:

1. `#hero` — wordmark, headline, CTA. WebGL/canvas background.
2. `#manifesto` — pull-quote (split from body per client request).
3. `#manifesto-body` — the manifesto paragraphs.
4. `#scope` — three cards (Equity & IP / Incubation / Cultural positioning).
5. `#approach` — three points.
6. `#clientele` — who we work with.
7. `#founder` — Stephanie Piza bio.
8. `#visual` — Unicorn Studio scene (see TODO below).
9. `#contact` — closing line + email/IG/location.

### Motion system (the "expensive" layer — keep this quality bar)
- **Masked line-rise:** display type is wrapped
  `<span class="r-mask"><span class="r-line">…</span></span>`. The line sits at
  `translateY(115%)` behind an `overflow:hidden` mask and rises to `0`.
- **Deblur-fade:** supporting copy uses `.r-fade` (opacity + translateY + blur).
- Reveals are **group-triggered**: each `[data-reveal]` container reveals its
  children with a JS-assigned stagger (`main.js` → `initReveal`).
- Hidden states are gated by `html.js` (added by an inline script in `<head>`
  before first paint) so the site is fully readable with **JS disabled**.
- Everything honors `prefers-reduced-motion: reduce` (animations cut to fades).

### Other JS (`main.js`)
- `initUnicornStudio` — loads the Unicorn Studio library **on-demand**, and only
  if a real (non-`TODO`) `data-us-project` id exists. Keeps the console clean.
- `initFallbackCanvas` — animated topographic-line canvas behind hero + visual
  sections; the fallback when no WebGL scene is set.
- `initHud` / `initProgress` — live section index (bottom-left) + scroll bar.
- `initNavScroll` — nav gains a blurred mahogany bg after the hero.
- `initHeroParallax` — wordmark drifts to cursor (desktop, non-reduced-motion).

### Typography / grain
- Extreme scale contrast: ~11px tracked eyebrows vs. clamp() display up to ~15rem.
- Film-grain overlay (`.grain`, inline SVG turbulence) + edge vignettes give the
  filmic surface. Keep opacity subtle (~0.05).

---

## OPEN TODOs (what the next session should tackle)

1. **Unicorn Studio scenes are placeholders.** Both the hero and the `#visual`
   section currently render the animated canvas fallback, NOT real WebGL scenes.
   - `index.html` has `data-us-project="TODO_UNICORN_PROJECT_ID"` (hero) and
     `data-us-project="TODO_VISUAL_PROJECT_ID"` (visual).
   - The client provided a scene as an EDITOR url:
     `https://www.unicorn.studio/dashboard/remix/Zv9wl6ZhgThsPvosR2X3`
     — that is NOT a usable public embed id. It must be **published**:
     open in Unicorn Studio → Export → Embed → copy the project id → paste over
     the relevant `TODO_...` value. Then the library auto-loads and the fallback
     hides.

2. **Real logo / wordmark.** The wordmark is currently set as tracked Space
   Grotesk text. Search `index.html` for `<!-- LOGO SLOT -->` (two places: nav +
   hero) to drop in the real SVG wordmark. Respect clear space = cap-height.
   Do not stretch, recolor outside palette, or retypeset the logo.

3. **Inflated 3D logo render.** Contact section has an
   `<!-- INFLATED LOGO SLOT -->` for the 3D crimson logo render as a closing
   visual.

4. **Confirm real contact details.** Placeholders in use:
   email `inbox@piza.global`, Instagram `@piza.global`. Confirm before launch.

## Copy rule (client is strict about this)
- **No em/en dashes anywhere.** Use clean commas, full stops, semicolons. Keep it
  this way when editing copy.
- Use the exact provided copy for facts/bio — do not invent claims about the
  company or founder.

## Deploy loop
Commit to `master` and push; GitHub Pages redeploys automatically (a
"pages build and deployment" Action). No build step.

```bash
git add -A && git commit -m "…" && git push
```

If the custom domain ever shows a 404 after a change, check
github.com/14rd/piza → Settings → Pages: custom domain should read
`piza.studiosubtract.com`, "Enforce HTTPS" on. (There was a GitHub Actions
outage during initial setup that stalled deploys; unrelated to the code.)

## Accessibility / quality bar
- Semantic HTML5 landmarks, alt text, visible focus states, AA contrast.
- Readable with JS off. No console errors. Mobile-first, fully responsive.
