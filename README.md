# PIZA — piza.global

Static single-page marketing site for PIZA Global.

## Local preview

Open `index.html` directly in a browser — no server or build step needed.

## Deploy to GitHub Pages

1. Push this folder's contents to a GitHub repo (or as a subfolder).
2. Go to **Settings → Pages**.
3. Set source to the branch/folder containing `index.html`.
4. The `.nojekyll` file tells GitHub Pages to skip Jekyll processing.

## Customization

- **Unicorn Studio hero**: Replace `TODO_UNICORN_PROJECT_ID` in `index.html` with your project ID from unicorn.studio's Export → Embed dialog.
- **Logo**: Search for `<!-- LOGO SLOT -->` comments to swap in the real SVG wordmark.
- **Contact email / Instagram**: Replace `TODO_CONTACT_EMAIL` and `TODO_INSTAGRAM_URL` placeholders.
- **Inflated 3D logo**: Search for `<!-- INFLATED LOGO SLOT -->` in the contact section.
- **Fonts**: Space Grotesk (OFL license) is self-hosted in `/fonts`.
