# SPEC — Wedding Invitation Site `Y & S`

> Living specification document. SDD (Spec-Driven Development): implementation only happens after spec is approved. Any change in implementation that doesn't match the spec requires a spec update first.

**Version:** 0.1 (draft)
**Last updated:** 2026-05-03
**Status:** awaiting approval on §1–§7; §8–§9 blocked on TODO items

---

## 1. Goal & audience

Single-page wedding invitation web site for **Y & S** (initials only — full names TBD, see [TODO](TODO.md)).

**Couple context:**
- Bride: Russian, currently lives in Japan (Osaka). Family roots: Kazakhstan.
- Groom: Korean, currently lives in Japan. Family roots: Korea.
- Wedding location: Japan (city TBD).

**Audience** is therefore mixed: Russian-speaking relatives/friends, Korean-speaking relatives/friends, Japanese-speaking guests/colleagues, and English-speaking international friends. The site must serve all four equally well.

---

## 2. Non-goals (explicitly out of scope)

- No photos of the couple or guests on the site (couple's preference: illustrations/watercolor only, no people).
- No backend, no database, no CMS — pure static.
- No e-commerce / gift purchasing.
- No live-streaming integration.
- No analytics that require consent banners (avoid GA / Yandex.Metrica unless explicitly requested later).

---

## 3. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Site type | Static (vanilla HTML + CSS + JS, no build step) | Maximum portability, zero hosting cost, works on GitHub Pages out of the box, easy for non-developer to edit later |
| Hosting | GitHub Pages | Confirmed by user. Free. Custom domain optional later. |
| Source control | Git, single `main` branch | Simple. `git init` + GitHub remote. |
| i18n | Inline JS dictionaries in `assets/js/i18n.js` (one `const` per locale) | No framework, no fetch, works on `file://` for local dev. ~30 strings per language. Browser-language auto-detect with manual override + `localStorage` persistence. |
| Fonts | Google Fonts (web fonts) for Latin/Cyrillic/Japanese/Korean. Specific picks TBD (see §6). | Free, CDN-hosted, supports all 4 scripts. |
| Illustrations | Watercolor PNGs/SVGs — sourced from royalty-free sites (Freepik free tier, Unsplash, Pixabay) OR custom-made | TBD with bride. See [TODO](TODO.md). |
| Animations | CSS transitions + minimal IntersectionObserver-based reveals. No heavy JS animation libs. | Keep page light. |
| Map embed | OpenStreetMap iframe or static Google Maps image | Free, no API key for static. Decided after venue is known. |
| RSVP | Google Forms embed (free) OR `mailto:` link | Decided when bride confirms which contact channel she wants. |

**No framework** (no React, no Vue, no Next, no Tilda). The reference site in this folder was built on Tilda — we are NOT replicating its build system, only borrowing visual cues.

---

## 4. Page structure (single-page, scroll)

Sections are vertical, full-viewport on desktop, stacked on mobile. Order:

1. **Hero / cover** — couple's initials `Y & S` in elegant serif, wedding date, "Save the date" line in active language. Watercolor olive/sage botanical decoration in corners. Subtle scroll-down hint.
2. **Greeting / "Dear Guests"** — short paragraph from the couple inviting guests. 2–3 sentences max per language.
3. **Story** *(optional — bride decides)* — 2–3 short cards: how they met, engagement, etc. **Skipped in v1 unless content provided.**
4. **Date & countdown** — large date display + live countdown ticker (days/hours/minutes). Date TBD.
5. **Programme / timeline** — vertical timeline: ceremony → photo session → banquet → afterparty. Times TBD.
6. **Venue** — venue name, address (in active language + always Japanese for taxi/maps), embedded map, "Open in Google Maps" button.
7. **Dress code** — color palette swatches (the 7 circles from the reference image), short copy. **No human models** — palette circles + watercolor fabric swatches only.
8. **RSVP** — confirm-attendance form OR mailto button. Field set: name, attending y/n, +1, dietary notes, language preference. Method TBD.
9. **Details / FAQ** — gifts policy, parking, kids welcome y/n, language of ceremony, contact for questions. Items TBD.
10. **Footer** — small "with love, Y & S" line, language switcher (also in fixed top-right corner).

Section visibility per locale is identical — no per-language sections hidden.

---

## 5. Internationalization (i18n)

### 5.1 Language detection
1. On first visit, read `navigator.language`. Map prefix:
   - `ru*` → Russian
   - `ko*` → Korean
   - `ja*` → Japanese
   - everything else → English (default fallback, since user said default doesn't matter but EN is safest for international audience)
2. Persist active language in `localStorage` under key `wedding-lang`.
3. Manual override via switcher always wins and is persisted.

### 5.2 Switcher UI
Fixed top-right pill: `RU · EN · 日本語 · 한국어`. Active language is bolded/highlighted. Tap/click swaps content live without page reload (DOM text update, no flicker, no layout shift).

### 5.3 String storage
- One JSON file per language under `/i18n/{lang}.json`.
- Keys are dot-paths: `hero.title`, `hero.date`, `programme.ceremony.label`, etc.
- DOM elements with translatable copy carry `data-i18n="hero.title"`. JS replaces `textContent` on language change.
- For attributes (alt, aria-label, placeholder), use `data-i18n-attr="alt:hero.image_alt"`.

### 5.4 Locale-sensitive content
- **Date format:** RU → `12 сентября 2026`. EN → `September 12, 2026`. JA → `2026年9月12日（土）`. KO → `2026년 9월 12일 (토)`. Stored as separate keys, not auto-formatted (saves us from `Intl.DateTimeFormat` quirks across browsers).
- **Address:** always show in Latin transliteration + Japanese. Korean and Russian users still need the Japanese version for taxis.
- **Names:** stored separately for each language (e.g. groom Korean name in Hangul, transliterated for RU/EN, in Katakana for JA). [TODO](TODO.md) to collect.

### 5.5 Fonts per script
- Cyrillic + Latin: one elegant serif (e.g. **Cormorant Garamond** or **Playfair Display**) + one humanist sans for body.
- Japanese: **Noto Serif JP** (matches Cormorant in feel).
- Korean: **Noto Serif KR**.
- Decision deferred until visual prototype.

---

## 6. Visual design

### 6.1 Palette (extracted from references)
```
--color-bg:           #F5F0E8   /* warm cream */
--color-ink:          #2A1F18   /* dark chocolate, body text */
--color-brown-dark:   #3D2A1E   /* darkest swatch */
--color-brown-mid:    #5C4332   /* coffee */
--color-camel:        #A88766   /* tan */
--color-beige:        #C9B299   /* warm beige */
--color-sand:         #E5D4BC   /* lightest brown */
--color-sage-light:   #A8B89A   /* light sage */
--color-olive:        #6F7A52   /* deep olive */
--color-accent:       #6F7A52   /* CTA buttons, links — olive */
```
These match the 7 dress-code swatches from the reference image (chocolate → coffee → camel → beige → sand → sage → olive).

### 6.2 Typography scale
- Display (couple initials, section headers): serif, 48–96px depending on viewport.
- Subtitle: serif italic, 18–24px.
- Body: sans, 16–18px, 1.6 line-height.
- All-caps section labels (e.g. `ДРЕСС-КОД`): letter-spacing 0.2em, smaller serif.

### 6.3 Imagery
**Watercolor only. No human figures.** Acceptable elements:
- Botanical sprigs (olive branches, eucalyptus, wildflowers) — corners of hero, between sections.
- Abstract watercolor washes in palette colors as soft backgrounds.
- Optional: single watercolor sketch of the venue exterior (if available).
- Optional: monogram `Y & S` hand-drawn in the same watercolor style.

Asset sourcing: Freepik free tier with attribution, or commission a single illustrator for the monogram + corner sprigs (cheap on Fiverr, ~$30–50). Decision deferred.

### 6.4 Layout & motion
- Mobile-first. Breakpoints: 480 / 768 / 1200.
- Generous whitespace, centered content column max-width 720px.
- On-scroll fade-in (IntersectionObserver) — single 600ms ease-out, no parallax, no fancy effects.
- Countdown ticker updates every 1s with `requestAnimationFrame` throttled to 1Hz.

### 6.5 Accessibility
- Color contrast ≥ 4.5:1 for body text (dark chocolate on cream passes).
- All decorative SVGs `aria-hidden="true"`.
- All meaningful images have `alt` (translated).
- Language switcher is a `<nav>` with `aria-label`.
- Keyboard navigation works for all interactive elements (RSVP form, language switcher, "Open in Maps" link).

---

## 7. File structure

```
katyasite/
├── index.html                  # single page, all sections
├── assets/
│   ├── css/
│   │   ├── reset.css
│   │   ├── tokens.css          # CSS custom properties (palette, type scale)
│   │   └── styles.css          # everything else
│   ├── js/
│   │   ├── i18n.js             # language detection, switching, DOM update
│   │   ├── countdown.js
│   │   └── reveal.js           # IntersectionObserver fade-ins
│   ├── img/
│   │   ├── watercolor/         # PNG/SVG botanical assets
│   │   └── monogram-ys.svg
│   └── fonts/                  # if self-hosted, otherwise Google Fonts CDN
├── SPEC.md                     # this file
├── TODO.md                     # open items, blocking implementation
├── README.md                   # how to run locally + deploy
└── .gitignore
```

---

## 8. Deployment

1. `git init` in this folder, `git add .`, first commit.
2. Create GitHub repo (private or public — bride's choice).
3. Push `main`.
4. Repo Settings → Pages → Source: `main` / root → enables `https://<user>.github.io/<repo>/`.
5. Optional: bride buys a custom domain later (e.g. `y-and-s.love` ~$10/yr) and points CNAME at GitHub Pages.

No CI needed. Plain HTML deploys instantly on push.

---

## 9. Open questions (gating implementation)

See [TODO.md](TODO.md). Implementation **does not start** until at minimum these are resolved:

- Couple's full names in all 4 scripts.
- Wedding date.
- Venue name + address.

Everything else (dress code copy, story, FAQ) can land incrementally and the site can deploy with placeholder copy in the meantime.

---

## 10. Approval checklist

Before writing any code, please confirm:
- [ ] Section order in §4 is correct
- [ ] Tech choices in §3 are acceptable (vanilla HTML/CSS/JS, GitHub Pages, JSON i18n)
- [ ] Palette in §6.1 reads correctly (these hex values are my eyeballed guesses from your reference images — happy to tune)
- [ ] Default-fallback language is **English** (you said it doesn't matter — confirming EN as fallback)
- [ ] Watercolor assets: source from Freepik free tier (with attribution) initially, upgrade to commissioned art later if desired
