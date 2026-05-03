# 04 — Design System

## Visual direction

**Bali — pastel green-blue.** Soft, airy, ocean-and-tropical. Think morning light through palm leaves, sea-foam, weathered stone. **Not** Mediterranean, **not** Italian, **not** sage-and-eucalyptus weddings (those have already been rejected).

Texture: matte paper background, subtle watercolor washes. No glossy gradients, no glassmorphism, no neon.

## Palette — site

| Token | Hex | Usage |
|---|---|---|
| `--bg-paper` | `#F5F1E8` | Page background, warm off-white. |
| `--bg-mist` | `#E8EFEA` | Section bands, subtle alternation. |
| `--ink-deep` | `#2B3A3A` | Body text, headings. |
| `--ink-soft` | `#516666` | Secondary text, captions. |
| `--accent-sage` | `#9CB89A` | Primary accent, dividers, hover states. |
| `--accent-aqua` | `#A8C9CC` | Secondary accent, links. |
| `--accent-sea` | `#6F9A9D` | Strong accent, button background, active language pill. |
| `--accent-sand` | `#D8C9A8` | Tertiary accent, hairlines. |

These are tentative — bride must approve on a real prototype before locking. Name them as CSS custom properties from day one so they can be tuned globally.

## Palette — dress code block (separate)

See `02-content.md`. The 7 earth-and-green swatches live **only inside the dress-code section**. They do not bleed into other sections. Visually: round 64px circles in a horizontal row, gap 16px, with hex labels below on hover (desktop) or always-visible (mobile).

## Typography

| Script | Display (headings) | Body |
|---|---|---|
| Latin + Cyrillic | **Cormorant Garamond** (400, 500) | **Manrope** (400, 500) |
| Japanese | **Noto Serif JP** (400, 500) | **Noto Sans JP** (400, 500) |
| Korean | **Noto Serif KR** (400, 500) | **Noto Sans KR** (400, 500) |

Load all three via Google Fonts CDN with `&display=swap`. The active script's stack is set on `<html lang="…">` via CSS `:lang()` selectors — no JS needed for font swap.

Sizes (mobile-first, in `rem`):

| Role | Size | Line-height |
|---|---|---|
| Hero name | 4.5rem | 1.05 |
| Hero date | 1.25rem | 1.4 |
| Section heading | 2.25rem | 1.2 |
| Body | 1.05rem | 1.6 |
| Caption | 0.875rem | 1.5 |

Letter-spacing on display: `0.02em` for Cormorant, default for Noto Serif (CJK doesn't need it).

## Motion

- **Reveal on scroll:** opacity 0→1, transform `translateY(16px)→0`, 200ms `ease-out`. Once per session.
- **Envelope opening:** poster → tap → video plays → fade to invitation state. Total under 4s.
- **Language switch:** instant text swap, no fade (fade looks broken on long content).
- **Hover (desktop):** colour-only transitions, 150ms.
- **No parallax.** No mouse-follow effects. No auto-playing carousels.

Respect `prefers-reduced-motion: reduce` — disable all scroll reveals and the envelope video animation, jump straight to invitation state.

## Visual decorations

Bali botanical motifs in section margins (desktop) or as faded backgrounds (mobile):

- Monstera leaf silhouettes, sage colour, low opacity (15–20%).
- Frangipani / plumeria sprigs at section dividers.
- Faint wave/watercolour wash at the cover and footer.

All decorations are SVG (inline or referenced), not raster — for crispness and theming.

## Iconography

Minimal. Only:

- Heart-outline divider between sections (kept from the previous Lemon-style version — bride liked it).
- Pin icon for venue.
- Calendar/clock icons for schedule.
- Globe icon next to language switcher.

All single-stroke, sage colour, 24px base size.

## Component patterns

- **Buttons:** pill-shaped, sea-accent background, paper text, 12px / 24px padding. Hover: aqua background.
- **Cards:** none — content is in sections, not cards. Schedule timeline uses dots-and-lines, not card containers.
- **Form inputs:** underline style only (no boxes), sage underline on focus.
- **Language switcher:** three text pills, active one filled, inactive ones outlined.
