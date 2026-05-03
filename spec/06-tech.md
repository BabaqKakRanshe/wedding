# 06 — Tech, RSVP, Deployment

## Stack

| Concern | Choice | Why |
|---|---|---|
| Build tool | **Vite** | Minimal config, fast dev server, builds to plain static files. |
| Language | **Vanilla TypeScript** | Type safety on i18n keys and form schema; no framework overhead. |
| UI | **No framework.** Hand-written HTML templates + DOM manipulation. | Site is small; React/Vue would add bundle weight without benefit. |
| Styles | **Plain CSS** with custom properties. No Tailwind, no preprocessor. | Design system is small; tokens via CSS vars are enough. |
| i18n | Custom 30-line runtime over `data-i18n` attributes (see `05-i18n.md`) | No need for i18next — three languages, ~50 keys. |
| Form | Web3Forms (see below) | Free, no account beyond email confirmation, 250 submissions/month. |
| Hosting | GitHub Pages via Actions workflow | Free, custom domain optional, user already has GitHub. |
| Analytics | None for v1 | No consent banner needed. May add Plausible self-hosted later. |

Final bundle target: under 200 KB JS + CSS gzipped (excluding fonts and the envelope video).

## Project layout

```
katyasite/
├── spec/                  # this folder — SDD source of truth
├── src/
│   ├── index.html
│   ├── main.ts            # entry — i18n bootstrap, envelope state, form handler
│   ├── i18n/
│   │   ├── ru.json
│   │   ├── ja.json
│   │   └── ko.json
│   ├── styles/
│   │   ├── tokens.css     # palette, type scale, spacing
│   │   ├── base.css       # reset + global
│   │   └── sections.css   # per-section styles
│   ├── modules/
│   │   ├── envelope.ts
│   │   ├── i18n.ts
│   │   ├── reveal.ts
│   │   ├── countdown.ts
│   │   └── rsvp.ts
│   └── assets/
│       ├── intro-video.mov
│       ├── intro-poster.png
│       └── decor/         # SVG botanicals, icons
├── public/                # static passthrough (favicon, robots.txt)
├── .github/workflows/
│   └── deploy.yml         # Pages deploy
├── vite.config.ts
├── tsconfig.json
├── package.json
└── TODO.md
```

## RSVP — Web3Forms integration

1. Sign up at https://web3forms.com with the chosen email (see `99-open-questions.md` — whose email).
2. Get an `access_key` (one POST field).
3. Form action: `POST https://api.web3forms.com/submit` with multipart form-data including `access_key`, all visible fields, and a hidden `subject` field.
4. Successful submission returns `{success: true}` JSON — show inline success state, do NOT navigate away.
5. Honeypot field (`botcheck`) is built into Web3Forms — include it.
6. Custom redirect: NONE — handle response in JS to keep the user on the page.

The `access_key` is fine to expose in client JS — Web3Forms validates it server-side and rate-limits.

```ts
// rsvp.ts shape
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
async function submit(formData: FormData) {
  formData.append('access_key', WEB3FORMS_KEY);
  formData.append('subject', `Wedding RSVP — ${formData.get('name')}`);
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST', body: formData,
  });
  return res.json();
}
```

The key lives in `.env.local` (gitignored) and is injected at build time via Vite's `import.meta.env`. The GitHub Action sets it from a repo secret.

## Deployment — GitHub Pages

Workflow at `.github/workflows/deploy.yml`:

1. Trigger on push to `main`.
2. Checkout, install Node 20, `npm ci`, `npm run build`.
3. Inject `VITE_WEB3FORMS_KEY` from secret `WEB3FORMS_KEY`.
4. Upload `dist/` as Pages artifact.
5. Deploy to `gh-pages` branch / Pages.

Repo settings → Pages → source = "GitHub Actions".

URL pattern: `https://<github-user>.github.io/<repo-name>/`. If the repo is renamed to `<github-user>.github.io`, the URL becomes `https://<github-user>.github.io/`. Custom domain (e.g. `katya-and-seungtaek.com`) optional, configured later via `CNAME` file.

GitHub username and final repo name: TBD — see `99-open-questions.md`.

## Local dev

```bash
npm install
npm run dev      # vite dev server on http://localhost:5173
npm run build    # outputs dist/
npm run preview  # preview built dist/
```

Node 20+ required.
