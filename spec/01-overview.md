# 01 — Overview

## What this is

A single-page, multilingual digital wedding invitation hosted as a static site on GitHub Pages. Guests open the link, watch a short envelope-opening intro, then scroll through invitation, schedule, venue, dress code, and RSVP form.

## Couple context (private — informs tone, not displayed verbatim)

- **Bride:** Russian, family roots in Kazakhstan, currently lives in Japan.
- **Groom:** Korean, family roots in Korea, currently lives in Japan.
- **Wedding location:** Bali, Indonesia (villa, see `02-content.md`).
- **Couple's day-to-day language:** Japanese.

This drives the audience mix: Russian-speaking relatives, Korean-speaking relatives, and Japanese-speaking guests/colleagues.

## Audience

| Audience | Language | Notes |
|---|---|---|
| Bride's family/friends | Russian | Default language for first visit if browser is RU. |
| Groom's family/friends | Korean | Default if browser is KO. |
| Couple's friends in Japan | Japanese | Default if browser is JA or anything else. |

English is **explicitly out of scope** (bride confirmed: "Английский кстати не нужен").

## Goals

1. Deliver invitation content in three languages without making a guest hunt for the switcher.
2. Convey the Bali atmosphere visually (pastel green-blue, ocean/tropical) — not Italian, not Mediterranean.
3. Collect RSVP responses by 2026-08-15.
4. Be editable by a non-developer later (text changes shouldn't require a rebuild that breaks).
5. Cost zero to host and run.

## Non-goals

- No photos of the couple or guests (couple preference; visuals are illustrative/atmospheric).
- No backend, no database, no CMS — pure static.
- No analytics requiring consent banners.
- No live-streaming.
- No gift registry / e-commerce (gift policy is a single soft sentence; see `02-content.md` phrase 6).
- No English UI.
- No Tilda, no website builder — hand-built static site.

## Success criteria

- Loads in under 2s on a mid-tier mobile (4G).
- Works offline after first load (service worker — nice-to-have, not required for v1).
- All three language flows validated end-to-end (open, switch, RSVP, submit).
- Bride approves the visual prototype before code is written for sections beyond the cover.
