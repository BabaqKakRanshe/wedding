# 03 — Architecture

## Page model

Single HTML document. Two states:

1. **Intro state (envelope):** full-viewport video of an envelope. Tap/click → plays opening animation → transitions into invitation state.
2. **Invitation state:** vertical-scroll long page with the sections below. Top-right fixed language switcher. No router, no separate pages.

State transition is one-way: once the envelope is opened, the user cannot go back to it without a hard refresh. Persist `envelopeOpened` in `sessionStorage` so reloads during the same session skip the intro.

## Section order (top → bottom)

| # | Section | Content source | Notes |
|---|---|---|---|
| 0 | Intro / envelope | `assets/intro-video.mov` + poster | Pre-invitation gate, see above. |
| 1 | Cover | Names + date + Bali sub-line (phrase 7) | Hero. Above the fold. Names from `02-content.md`, date "27.08.2026". |
| 2 | Greeting | Phrase 1 | First scroll-reveal. Centered, generous padding. |
| 3 | Countdown | Auto-computed from 2026-08-27 | Days / hours / minutes ticker. |
| 4 | Schedule | 4 timeline items (15/16/17/20) | Vertical timeline, time + label. Phrase 8 as section intro. |
| 5 | Venue | Google Maps embed + transfer note (phrase 2) | "Open in Maps" button → maps.app.goo.gl link. |
| 6 | Dress code | Phrase 4 + 7-circle palette | No human models. Circles only. |
| 7 | RSVP | Phrase 5 + form + deadline (15.08.2026) | Web3Forms POST. Inline success state. |
| 8 | Gifts | Phrase 6 | One paragraph, no card details, no registry. |
| 9 | Closing | Phrase 3 | Last warm note. |
| 10 | Footer | "with love, Екатерина & Сынтек" + lang switcher | Minimal. |

## Navigation

- **No top nav menu** — the site is short; scroll is the navigation.
- **Fixed language switcher:** top-right corner, three pills `RU · 日本語 · 한국어`. Active locale highlighted.
- **Floating "back to top":** appears after first viewport of scroll, bottom-right.

## Scroll behaviour

- Smooth scroll: native CSS `scroll-behavior: smooth` is enough; no Lenis/Locomotive needed.
- Reveal on scroll: each section fades + slides up 16px on entering viewport (IntersectionObserver, 200ms, `ease-out`).
- No scroll-jacking, no horizontal scroll, no scroll-snap (it fights mobile).

## Responsive breakpoints

| Breakpoint | Width | Behaviour |
|---|---|---|
| Mobile | ≤ 640px | Single column, larger touch targets, schedule timeline becomes left-aligned. |
| Tablet | 641–1024px | Single column, wider line length. |
| Desktop | ≥ 1025px | Single column with max-width 720px centred. Visual decorations (botanicals) appear in margins. |

The site is a long single column at every breakpoint — no multi-column layouts. Decorative elements scale and reposition only.

## Accessibility

- All interactive elements keyboard-reachable.
- Envelope intro must be skippable via a visible "Skip" link or Esc key.
- Video has poster image (already specified) so muted/no-autoplay browsers still see something meaningful.
- Form labels are real `<label>` elements, not placeholders.
- Colour contrast meets WCAG AA for all body text against the chosen pastel background.
