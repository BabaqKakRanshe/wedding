# 07 — Assets

## Reference site

The envelope intro is borrowed from a reference wedding site **«Boda Mar & Jaume»** (Lovable build), dumped locally at:

```
tools/site_dumper/dumps/finca/finca-demo.thedigitalyes.com/
```

Reusable assets from that dump:

| File | Size | Notes |
|---|---|---|
| `assets/intro-video-BpkZMtTn.mov` | 4.8 MB | Envelope opening animation, vertical 1080×1920. **Audio: TBD — verify.** |
| `assets/intro-video-BSNlV4m4.webm` | 4.4 MB | Same content, webm fallback. |
| `assets/intro-poster-BQrMtd4k.png` | 2.8 MB | Closed envelope, cream paper, **wax seal with "M & J" monogram** + Spanish caption *"Esta invitación es exclusiva para ti"*. **Cannot use as-is** — monogram and caption belong to another couple. |
| `assets/intro-music-CzqJOUtA.mp3` | 2.7 MB | Intro background music (license unknown — assume not reusable; use as a pattern for our own track). |

The illustrations from the same dump (`hero-illustration`, `champagne-illustration`, `party-illustration`, `rings-illustration`) are reference for **style only** — Bali invitation should commission its own.

## Inventory

| Asset | Path (target) | Status | Source |
|---|---|---|---|
| Envelope intro video | `src/assets/intro-video.mov` + `intro-video.webm` | **Located in finca dump.** Reusable as-is (no monogram visible in motion, presumably). Verify by playing. | Copied from finca dump on import. |
| Envelope intro poster | `src/assets/intro-poster.png` | **Needs rework.** Original has M&J monogram + Spanish text. Rebuild: same envelope photo, our monogram (`Е & С` or generic `&`), caption translated per locale. | New artwork — see Q15 in open questions. |
| Site favicon | `public/favicon.svg` | TBD | Sage-coloured monogram or single leaf |
| Botanical decor — monstera | `src/assets/decor/monstera.svg` | TBD | Custom or royalty-free SVG |
| Botanical decor — frangipani | `src/assets/decor/frangipani.svg` | TBD | Custom or royalty-free SVG |
| Heart divider | `src/assets/decor/heart.svg` | Reusable | Already designed in previous Lemon iteration; recolour to sage |
| Map fallback image | not stored | n/a | Embed Google Maps via iframe; no static image needed |
| Background ocean wash | `src/assets/decor/wash-ocean.svg` | TBD | Subtle pastel watercolour at cover |

## Envelope video — requirements

- **Format:** keep both `.mov` and `.webm` from the dump; serve `.webm` first via `<source>` ordering (smaller, broader codec support on Chromium/Firefox), `.mov` fallback for Safari.
- **Duration:** as-is from the source clip (~3s).
- **Dimensions:** 1080×1920 (vertical) — site is mobile-first and the video fills the viewport.
- **Poster image:** custom PNG (see open question Q15) — same envelope styling but with our monogram. Optimise under 300 KB.
- **Audio:** confirm whether the .mov has an audio track. If yes, mute via `<video muted>`. Background music is handled as a separate file (see below).
- **Loop:** no loop. One play, then transition.

If the original video can't be reused (e.g. monogram visible mid-animation), fall back to a CSS/SVG envelope: a paper rectangle with a triangular flap rotating open along its base edge, revealing a card behind. Adds ~2 hours of work but gives full control.

## Music — promoted to v1 scope

The bride explicitly asked for music. The reference site demonstrates the pattern (separate `intro-music.mp3` triggered alongside the video, then loops quietly under the invitation).

Requirements for our track:

- Royalty-free, ambient or acoustic (matches Bali calm). Suggested sources: Epidemic Sound (paid), Pixabay Music (free), Free Music Archive.
- 30–60s loopable, gentle fade-in/fade-out at boundaries.
- File: `src/assets/intro-music.mp3`, target under 1.5 MB.
- Browser policy: cannot autoplay with sound; play is user-initiated by the same tap that opens the envelope.
- Mute toggle in the corner, persisted in `localStorage`.

Track selection: TBD — see Q10.

## Fonts

Loaded via Google Fonts CDN, single `<link>` tag in `index.html`:

```
https://fonts.googleapis.com/css2?
  family=Cormorant+Garamond:wght@400;500&
  family=Manrope:wght@400;500&
  family=Noto+Serif+JP:wght@400;500&
  family=Noto+Sans+JP:wght@400;500&
  family=Noto+Serif+KR:wght@400;500&
  family=Noto+Sans+KR:wght@400;500&
  display=swap
```

Total cost: ~6 font requests, lazy-loaded, ~120 KB on first paint (mostly CJK subsets). Acceptable.

If size becomes a concern, switch to self-hosted subsets via `unicode-range` — defer until measured.

## Music — out of scope for v1

Bride mentioned music in feedback ("Музыки нет"). Treating as a v2 feature. If added:

- Single ambient track, looping.
- Mute by default (browsers block autoplay with sound anyway).
- Mute/unmute toggle bottom-left, persistent across pages.
- Track licensed for personal use (royalty-free).

Add to spec only when bride confirms a track and use case.

## Image optimisation

- All raster assets through `vite-imagetools` or pre-optimised manually with Squoosh.
- Target: WebP for photos/decor, SVG for everything geometric/iconic.
- Lazy-load anything below the fold via `loading="lazy"`.
