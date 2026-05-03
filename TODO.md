# TODO — Open items

Items needed from the bride/groom before content/implementation can complete. Ordered by blocking severity.

## 🔴 Blocking (implementation cannot start without these)

- [ ] **Full names of bride and groom** in all 4 scripts:
  - Russian (Кириллица)
  - English (Latin transliteration)
  - Japanese (Kanji + Katakana — Korean name typically in Katakana, Russian name in Katakana)
  - Korean (Hangul + Latin transliteration if not native Korean for bride)
  - Initials confirmed as **Y & S**
- [ ] **Wedding date** (full date with day of week — needed for countdown + locale-formatted strings)
- [ ] **Wedding time** — main ceremony start, banquet start
- [ ] **Venue**:
  - Name
  - Full address in Japanese (official) + English transliteration
  - Google Maps / Apple Maps link
  - City (assumed Osaka — confirm)

## 🟡 Important (can launch with placeholders, but should land before invitation goes out)

- [ ] **Dress code copy** — final wording per language. Reference: "Мы будем очень рады, если вы поддержите цветовую гамму праздника" — translate for EN/JA/KO with same warmth.
- [ ] **Greeting paragraph** from the couple — 2–3 sentences, in any language; we'll translate the rest.
- [ ] **Programme / timeline** — exact times for ceremony, photo, banquet, afterparty. With or without breaks.
- [ ] **RSVP method** — choose:
  - (a) Google Forms (free, easy, works for all 4 languages)
  - (b) Plain `mailto:` button to bride's email
  - (c) Telegram contact button
  - (d) Multiple options (e.g. Google Form + Telegram fallback)
- [ ] **RSVP deadline** — date by which guests must respond.

## 🟢 Nice-to-have (polish, can come after launch)

- [ ] **"Story" section content** — how Y & S met / proposal story. Skip section entirely if bride doesn't want it.
- [ ] **Custom monogram `Y & S`** — commission watercolor-style monogram (Fiverr ~$30–50) OR I generate something acceptable from free assets.
- [ ] **Watercolor venue sketch** — optional, atmospheric.
- [ ] **Gift policy / wishlist** — does the couple want gifts, money, charity donations, nothing? Translate appropriately for KR/JA cultural norms (gift envelopes are traditional in both Korean and Japanese weddings).
- [ ] **FAQ items** — parking, kids welcome, language of ceremony, photography rules, what to do if you'll be late, etc.
- [ ] **Custom domain** — if bride wants `y-and-s.love` style URL instead of `*.github.io`.
- [ ] **Music / ambient audio** — optional autoplay-on-tap track. Off by default per accessibility best practice.

## 🔵 Decisions deferred (I'll propose, bride confirms)

- [ ] Final font pairing (Cormorant Garamond + Noto Serif JP/KR is my proposal — to confirm after first visual prototype)
- [ ] Exact watercolor asset set — propose 5–7 options once spec is approved
- [ ] Whether to include a "save the date" share button (WhatsApp / LINE / Telegram / KakaoTalk — KakaoTalk for Korean guests is important)
