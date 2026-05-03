# 99 — Open Questions

Decisions blocking implementation. Each item names the owner and the consequence of leaving it unresolved.

## Blocking — must resolve before code starts

| # | Question | Owner | Blocks |
|---|---|---|---|
| Q2 | **Web3Forms recipient email.** Whose inbox receives RSVP submissions? Bride's, groom's, or yours as project manager? | User | RSVP section deployment |
| Q3 | **GitHub username + repo name.** For Pages URL `https://<user>.github.io/<repo>/`. | User | Deployment workflow |
| Q15 | **Envelope poster monogram.** The reference poster has a wax seal with "M & J" and Spanish text — must be replaced. Options: (a) Photoshop a new seal with "Е & С" or "&" onto the same envelope, (b) commission new poster art, (c) drop the seal entirely and use a clean envelope with no monogram, only typeset names appearing on opening. | Bride | Intro poster |

## Important — must resolve before launch

| # | Question | Owner | Blocks |
|---|---|---|---|
| Q4 | **Venue human-readable name and address.** Google Maps short-link given but the villa name and full street address are needed for the venue card and for guests booking taxis. | Bride | Venue section copy |
| Q5 | **Transfer pickup point and time.** Phrase 2 says "сообщим дополнительно" — fine for v1, but needs a concrete update closer to the date. | Bride | Venue → Transfer block |
| Q6 | **JA and KO translations of all 8 phrases.** RU originals are in `02-content.md`. Native speaker review required (groom for KO, bride or friend for JA). | Couple | i18n JSON files for `ja.json`, `ko.json` |
| Q7 | **Default language for non-RU/KO browsers.** Currently spec'd as `ja` (couple lives in Japan). Confirm. | Bride | i18n bootstrap logic |
| Q8 | **Contact for questions.** A WhatsApp / Telegram / email for guests with questions, shown in the footer. | Bride | Footer / FAQ |
| Q10 | **Music track.** Bride asked for music. Reference site uses ~3 MB ambient mp3 (license unknown). We need a royalty-free track — pick one or get bride's preference. | Bride | Intro music + ambient loop |

## Nice-to-have — defer if needed

| # | Question | Owner | Blocks |
|---|---|---|---|
| Q9 | **Custom domain?** `katya-and-seungtaek.com` or similar — costs ~$15/year. Default is the free `*.github.io` URL. | Bride | DNS setup; not blocking launch |
| Q11 | **Bali botanical illustrations.** Custom or royalty-free? Source-free SVGs (Pixabay/Freepik) work but custom watercolour scans look richer. | Bride | Decorative polish |
| Q12 | **Heart-divider reuse.** Previous version had a heart-outline divider bride liked. Keep, restyle, or drop in the Bali theme? | Bride | Section transitions |
| Q13 | **Countdown at midnight.** When the countdown hits zero, what does it say? "Today!" / "Сегодня!" / "本日！" / "오늘!" — confirm wording per locale. | Bride | Countdown final state |
| Q14 | **End-of-evening time.** Schedule ends at 20:00 (танцы) with no end time. Open-ended is fine, but confirm. | Bride | Schedule section |

## Resolved (kept for history)

| # | Question | Resolution | Date |
|---|---|---|---|
| R1 | Languages? | RU + JA + KO. **No English.** | 2026-05-03 |
| R2 | Wedding date? | 2026-08-27 | 2026-05-03 |
| R3 | Schedule? | 15:00 сбор / 16:00 церемония / 17:00 ужин / 20:00 танцы (overrides reference image). | 2026-05-03 |
| R4 | Theme? | Bali, pastel green-blue. NOT Italian, NOT Mediterranean. | 2026-05-03 |
| R5 | Dress code visuals? | Colour swatches only, **no human models.** | 2026-05-03 |
| R6 | Hosting? | GitHub Pages, free tier. | 2026-05-03 |
| R7 | RSVP backend? | Web3Forms (chosen for simplicity over Formspree). | 2026-05-03 |
| R8 | Hero name format? | First name only, in active locale. (`Екатерина & Сынтек` / `エカテリナ & スンテク` / `예카테리나 & 승택`) | 2026-05-03 |
| R9 | SDD methodology? | Spec-Driven Documentation — these `spec/` files are the source of truth, code follows. | 2026-05-03 |
| R10 | Envelope video source? | Located at `tools/site_dumper/dumps/finca/.../assets/intro-video-{BpkZMtTn.mov, BSNlV4m4.webm}` — dumped from reference site «Boda Mar & Jaume». Reusable; poster needs rework (Q15). | 2026-05-03 |
