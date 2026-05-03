# Wedding Invitation Site — Specification

Spec-Driven Documentation (SDD) for the wedding website of **Екатерина & Сынтек** (27 August 2026, Bali).

This is the source of truth for the product. Implementation must follow these specs. Any code change that diverges from the spec requires a spec update **first**, then code.

## How to use this folder

1. Read `01-overview.md` to understand what the site is and who it's for.
2. Edit content in `02-content.md` — that file is the canonical source of every name, time, address, and translatable phrase.
3. When changing visual or technical decisions, update the relevant spec file before touching `src/`.
4. Add unresolved decisions to `99-open-questions.md` rather than hard-coding placeholder values.

## Index

| File | Purpose |
|---|---|
| [01-overview.md](01-overview.md) | Product goals, audience, scope, non-goals |
| [02-content.md](02-content.md) | Names, date, schedule, venue, RSVP deadline, copy bank |
| [03-architecture.md](03-architecture.md) | Page sections, scroll flow, navigation |
| [04-design.md](04-design.md) | Palette, typography, motion, visual language |
| [05-i18n.md](05-i18n.md) | Language strategy (RU / JA / KO) |
| [06-tech.md](06-tech.md) | Stack, build, RSVP integration, deployment |
| [07-assets.md](07-assets.md) | Envelope video, illustrations, fonts, icons |
| [99-open-questions.md](99-open-questions.md) | Pending decisions blocking implementation |

## Status

- **Version:** 0.1 (draft, awaiting bride approval)
- **Last updated:** 2026-05-03
- **Wedding date:** 2026-08-27
- **RSVP deadline:** 2026-08-15
- **Current blocker:** see `99-open-questions.md`
