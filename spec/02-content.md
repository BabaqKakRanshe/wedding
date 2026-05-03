# 02 — Content (Source of Truth)

This file is the canonical source for every name, date, time, address, and translatable phrase on the site. The i18n JSON files in `src/i18n/` mirror this — when these diverge, **this file wins** and code must be updated.

---

## Names

Display name on the cover/hero is **first name only** (no surname), shown in the active language only.

| Language | Bride | Groom | Joined display |
|---|---|---|---|
| Russian | Екатерина | Сынтек | Екатерина & Сынтек |
| Japanese | エカテリナ | スンテク | エカテリナ & スンテク |
| Korean | 예카테리나 | 승택 | 예카테리나 & 승택 |

Full names (used only if/where formal context requires — e.g. RSVP confirmation email):

| Language | Bride | Groom |
|---|---|---|
| Russian | Богомолова Екатерина | Джон Сынтек |
| Japanese | ボゴモロワ　エカテリナ | ジョン　スンテク (鄭　昇澤) |
| Korean | 보고모로봐 예카테리나 | 정 승택 |

The ampersand glyph is **&** (kept Latin across all locales — visually unifies the cover).

---

## Date

- **Wedding date:** 2026-08-27 (Thursday)
- **RSVP deadline:** 2026-08-15

Formatted strings per locale:

| Locale | Wedding date | RSVP deadline |
|---|---|---|
| RU | 27 августа 2026 | до 15 августа 2026 |
| JA | 2026年8月27日（木） | 2026年8月15日まで |
| KO | 2026년 8월 27일 (목) | 2026년 8월 15일까지 |

---

## Schedule

Source: bride's text message (overrides the schedule shown in the dress-code reference image, which was for a different couple).

| Time | Item (RU) | Item (JA) | Item (KO) |
|---|---|---|---|
| 15:00 | Сбор гостей | ゲストの集合 | 게스트 모임 |
| 16:00 | Церемония | 挙式 | 결혼식 |
| 17:00 | Ужин | ディナー | 만찬 |
| 20:00 | Танцы | ダンス | 댄스 |

End time is open (no "завершение" item — keep the schedule warm and open-ended).

---

## Venue

- **Type:** Villa, Bali, Indonesia
- **Google Maps:** https://maps.app.goo.gl/HRpBWqefWj793oJK7
- **Human-readable name and address:** TBD — see `99-open-questions.md`
- **Transfer:** organised by couple, time and pickup point shared separately (this is intentionally vague on the site — phrase 2 covers it)

---

## Copy bank — invitation phrases

Source: bride's text message. Each phrase has an assigned section. Translations TBD with native speakers; values below are the Russian original.

| # | Phrase (RU) | Section | Notes |
|---|---|---|---|
| 1 | Приглашаем вас отправиться вместе с нами в путешествие, пунктом назначения которого станет наша свадьба. Будем счастливы, если вы проведёте этот день рядом с нами. | Greeting | Opens the invitation after the cover. |
| 7 | Среди океана, солнца и ветра мы будем праздновать день, который для нас очень важен. И будем рады, если вы будете рядом. | Cover sub-line | Bali atmosphere — sets tone immediately. |
| 8 | Мы с трепетом готовимся к этому дню — каждая деталь важна для нас. | Story / pre-schedule | Bridges greeting → programme. |
| 2 | Нам очень важно, чтобы каждый чувствовал себя комфортно, поэтому для вас будет организован трансфер к месту проведения свадьбы и обратно (время и место сбора сообщим дополнительно). | Venue → Transfer | Sub-block under venue. |
| 4 | Мы очень старались создать красивую атмосферу этого дня и будем рады, если вы поддержите её в своих образах. | Dress code intro | One sentence above the colour palette. |
| 5 | Пожалуйста, ответьте на несколько вопросов — это поможет нам сделать праздник максимально комфортным для вас. | RSVP intro | One sentence above the form. |
| 6 | Если вы планировали подарок, мы будем благодарны за любую форму внимания. | Gifts | Single soft line, no registry. |
| 3 | Самым главным подарком на нашей свадьбе будет ваше хорошее настроение. | Closing | Last line before footer. |

All eight phrases are **in scope** for v1.

---

## Dress code

Bride's request: muted earth-and-green palette. **Show only the colour swatches**, do **not** include the human models from the reference image.

Palette (7 swatches, left → right, dark → light → green):

| # | Hex (approx) | Name |
|---|---|---|
| 1 | `#3D2817` | Espresso |
| 2 | `#5C3A21` | Walnut |
| 3 | `#8B6F47` | Caramel |
| 4 | `#C4A584` | Beige |
| 5 | `#D8C09F` | Sand |
| 6 | `#8FA77B` | Sage |
| 7 | `#5D6E3F` | Olive |

Hex values are approximations from the reference image — refine in `04-design.md` once design tokens are set.

This palette is **for the dress-code block only**. The site's overall palette is different — see `04-design.md`.

---

## RSVP form fields

Minimum viable field set:

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | text | yes | Free-form, single field. |
| Attending | radio | yes | Yes / No |
| Plus-one | text (conditional) | no | Shown only if Attending = Yes. |
| Dietary notes | textarea | no | Allergies, restrictions. |
| Language preference | select | no | RU / JA / KO — pre-filled from current site language. |
| Message to couple | textarea | no | Optional well-wishes. |

Submit destination: Web3Forms (see `06-tech.md`).
