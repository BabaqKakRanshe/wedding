# TODO — Wedding Invitation Roadmap

Tracking work toward launch. Spec lives in [spec/](spec/README.md). Open decisions in [spec/99-open-questions.md](spec/99-open-questions.md).

**Target launch:** end of May 2026 (gives bride 3 months to share the link before RSVP deadline 2026-08-15).

---

## Phase 0 — Spec approval (now)

- [x] Draft `spec/` folder with all SDD documents
- [ ] Bride reads and approves `spec/01-overview.md` (scope)
- [ ] Bride reads and approves `spec/02-content.md` (every word, every name spelling)
- [ ] Bride reads and approves `spec/04-design.md` (palette, fonts) — visual prototype helps
- [ ] Resolve blocking open questions Q2, Q3, Q15 in `spec/99-open-questions.md`

## Phase 1 — Project skeleton

- [ ] `npm init` + Vite + TypeScript scaffold
- [ ] `tsconfig.json`, `vite.config.ts` configured for GitHub Pages base path
- [ ] `.gitignore` (node_modules, dist, .env.local)
- [ ] Folder structure per `spec/06-tech.md`
- [ ] CSS tokens file with palette from `spec/04-design.md`
- [ ] Google Fonts link in `index.html`
- [ ] Empty i18n JSON files with all keys stubbed in RU only

## Phase 2 — Cover and intro (vertical slice)

- [ ] Copy `intro-video-{BpkZMtTn.mov, BSNlV4m4.webm}` from finca dump into `src/assets/`
- [ ] Verify .mov audio track — mute if present
- [ ] Rebuild intro poster with our monogram (depends on Q15)
- [ ] `<video>` element with webm + mov sources, poster, playsInline, muted
- [ ] Tap-to-open transition → invitation state
- [ ] `sessionStorage` persistence for `envelopeOpened`
- [ ] "Skip" button + Esc key handler
- [ ] Cover section: names + date + Bali sub-line (phrase 7)
- [ ] Language switcher component (top-right)
- [ ] i18n runtime: `data-i18n` walker, locale switching, localStorage
- [ ] Manual QA: switch RU → JA → KO, verify cover renders correctly

## Phase 3 — Body sections

- [ ] Greeting (phrase 1) + reveal-on-scroll
- [ ] Countdown component (auto from 2026-08-27)
- [ ] Schedule timeline (4 items)
- [ ] Venue section + Google Maps embed + transfer note (phrase 2)
- [ ] Dress code section (palette circles, no people, phrase 4)
- [ ] Gifts (phrase 6)
- [ ] Closing (phrase 3)
- [ ] Footer + secondary lang switcher
- [ ] Heart-outline dividers between sections (pending Q12)

## Phase 4 — RSVP

- [ ] Form markup with all fields per `spec/02-content.md`
- [ ] Conditional plus-one field (shown when Attending = Yes)
- [ ] Web3Forms integration (`spec/06-tech.md` flow)
- [ ] Inline success/error states
- [ ] Honeypot field
- [ ] `.env.local` with `VITE_WEB3FORMS_KEY` (depends on Q2)
- [ ] Send a test submission end-to-end

## Phase 5 — Translations

- [ ] Translate all keys to JA (depends on Q6)
- [ ] Translate all keys to KO (depends on Q6)
- [ ] Verify all three locales render with correct fonts (`:lang()` selectors)
- [ ] Verify date/time strings use locale-formatted versions from `spec/02-content.md`

## Phase 6 — Polish

- [ ] Botanical SVG decorations in margins (depends on Q11)
- [ ] Watercolour wash at cover and footer
- [ ] Source royalty-free intro music track + mute toggle (depends on Q10)
- [ ] Mobile QA on real devices (iOS Safari + Android Chrome at minimum)
- [ ] `prefers-reduced-motion` audit
- [ ] Lighthouse: target 95+ on all categories
- [ ] Image optimisation pass (WebP, lazy-load)

## Phase 7 — Deployment

- [ ] Repo created on GitHub (depends on Q3)
- [ ] `WEB3FORMS_KEY` added to repo secrets
- [ ] `.github/workflows/deploy.yml` set up
- [ ] First successful deploy
- [ ] Visit live URL on mobile, walk through every section in every language
- [ ] Submit RSVP from live URL — verify email lands in correct inbox
- [ ] Custom domain (optional, depends on Q9)

## Phase 8 — Handover

- [ ] Share live URL with bride
- [ ] Document how to edit text (point at `spec/02-content.md` + `src/i18n/`)
- [ ] Document how to redeploy (push to main → auto-deploy)
- [ ] Final sign-off

---

## Done

- 2026-05-03: Cleared previous Lemon-style iteration from working tree (visible in `git status` as deleted files; commit pending after spec approval).
- 2026-05-03: Drafted full `spec/` folder.
