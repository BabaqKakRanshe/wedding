# Y & S — Wedding Invitation Site

Multilingual single-page wedding invitation. Statically hosted on GitHub Pages.
Languages: Russian / English / Japanese / Korean. See [SPEC.md](SPEC.md) for the full design.

## Locally

The site is plain HTML/CSS/JS — no build step. Two ways to view it:

**Easiest** — just double-click `index.html`. All scripts and styles work via relative paths.

**With a local server** (recommended for testing — closer to production):

```powershell
# Python (any version 3.x)
python -m http.server 8000

# Or Node, if installed
npx serve .
```

Then open http://localhost:8000.

## Editing content

All translatable copy lives in `assets/js/i18n.js` — one `dictionaries.<lang>` object per language. Find the key in the dictionary, edit the value. No build needed; refresh the browser.

To add or move sections, edit `index.html` and add `data-i18n="some.key"` to text elements.

## Deploy to GitHub Pages

```powershell
# first time
git remote add origin https://github.com/<your-user>/<repo>.git
git push -u origin main
```

Then in the GitHub repo: **Settings → Pages → Source: `main` / root → Save**. The site goes live at `https://<your-user>.github.io/<repo>/` within ~1 minute.

For a custom domain, add a `CNAME` file containing the domain at the repo root and configure DNS as per [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Project layout

```
.
├── index.html
├── assets/
│   ├── css/   reset.css, tokens.css, styles.css
│   ├── js/    i18n.js, countdown.js, reveal.js
│   └── img/   olive-sprig.svg, monogram-ys.svg
├── SPEC.md    full design spec — read before structural changes
├── TODO.md    open content items (names, date, venue, copy)
└── README.md  this file
```

## What's still placeholder

See [TODO.md](TODO.md). The site renders end-to-end but the following are demo values:
- Date: `2026-09-12 15:00 JST` (in `assets/js/countdown.js` — constant `TARGET_ISO`)
- Names: shown as `Y & S` everywhere (final names go into the i18n dictionary)
- Venue: generic Osaka coordinates in the OpenStreetMap iframe
- RSVP: placeholder `mailto:` — swap for Google Forms link or real email
