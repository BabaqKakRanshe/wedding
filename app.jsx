// Main wedding invitation app — Bali style.
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const PHOTOS = [
  "IMG_0573.JPG", "IMG_0568.JPG", "IMG_0556.JPG", "IMG_0526.JPG",
  "IMG_0530.JPG", "IMG_0546.JPG", "IMG_0554.JPG", "IMG_0558.JPG",
  "IMG_0561.JPG", "IMG_0570.JPG", "IMG_0572.JPG", "IMG_0574.JPG",
  "IMG_0575.JPG", "IMG_0547.JPG",
];

const SWATCHES = [
  { hex: "#3D2817", name: "Espresso" },
  { hex: "#5C3A21", name: "Walnut" },
  { hex: "#8B6F47", name: "Caramel" },
  { hex: "#C4A584", name: "Beige" },
  { hex: "#D8C09F", name: "Sand" },
  { hex: "#8FA77B", name: "Sage" },
  { hex: "#5D6E3F", name: "Olive" },
];

const WEDDING_AT = new Date("2026-08-27T08:00:00+08:00").getTime();
const VENUE_MAPS_URL = "https://maps.app.goo.gl/HRpBWqefWj793oJK7";

function detectLang() {
  try {
    const stored = localStorage.getItem("wedding-lang");
    if (stored === "ru" || stored === "ja" || stored === "ko") return stored;
  } catch (e) {}
  const prefix = (navigator.language || "ja").toLowerCase().split("-")[0];
  if (prefix === "ru") return "ru";
  if (prefix === "ko") return "ko";
  return "ja";
}

// ============================================================
// Reveal-on-scroll hook
// ============================================================
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) en.target.classList.add("in"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

// ============================================================
// Envelope opening overlay
// ============================================================
function Envelope({ t, onOpen }) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  const handleClick = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(() => {
      setGone(true);
      setTimeout(onOpen, 600);
    }, 1400);
  };

  return (
    <div className={"envelope-overlay" + (gone ? " gone" : "")}>
      <div className="env-bg-leaves" aria-hidden>
        <svg viewBox="0 0 1200 800">
          <g fill="#F4EADB">
            {[...Array(18)].map((_, i) => {
              const x = (i * 73) % 1200;
              const y = (i * 137) % 800;
              const r = 30 + (i % 4) * 20;
              const rot = (i * 41) % 360;
              return (
                <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${r/60})`} opacity="0.4">
                  <ellipse cx="0" cy="0" rx="40" ry="60"/>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className={"envelope" + (opening ? " opening" : "")} onClick={handleClick} role="button" tabIndex={0} aria-label={t.envOpen}
           onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}>
        <div className="env-body" />
        <div className="env-letter">
          <span className="ampersand">&</span>
        </div>
        <div className="env-flap" />
        <div className="env-seal">
          E<span style={{ fontSize: "0.7em", margin: "0 2px", opacity: 0.7 }}>&amp;</span>S
        </div>
      </div>

      <div className="env-prompt">
        <div className="name">
          {t.bride} <span className="ampersand-big">&amp;</span> {t.groom}
        </div>
        <div className="sub">{opening ? "·  ·  ·" : t.envSubtitle}</div>
      </div>
    </div>
  );
}

// ============================================================
// Language switcher
// ============================================================
function LangSwitcher({ lang, setLang, className = "lang-switcher" }) {
  const langs = [
    { code: "ru", label: "RU" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
  ];
  return (
    <div className={className} role="group" aria-label="Language">
      {langs.map(l => (
        <button
          key={l.code}
          className={"lang-pill" + (lang === l.code ? " active" : "")}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
        >{l.label}</button>
      ))}
    </div>
  );
}

// ============================================================
// Audio toggle (locale-aware)
// ============================================================
function AudioToggle({ lang, t, started }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.45;
  }, []);

  // Try to auto-start once envelope is opened (user gesture qualifies)
  useEffect(() => {
    if (!started || !audioRef.current) return;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
  }, [started]);

  // Swap track when language changes; preserve play/pause state
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const wasPlaying = playing;
    el.load();
    if (wasPlaying) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [lang]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  return (
    <>
      <audio ref={audioRef} src={`assets/music-${lang}.mp3`} loop preload="auto" />
      <button
        className={"audio-toggle" + (playing ? " playing" : "")}
        onClick={toggle}
        aria-label={playing ? t.audioOff : t.audioOn}
        title={playing ? t.audioOff : t.audioOn}
      >
        <SoundIcon on={playing} size={20} />
      </button>
    </>
  );
}

// ============================================================
// Cover section
// ============================================================
function Cover({ t }) {
  return (
    <section className="cover">
      <div className="cover-photo" />
      <div className="botanical" style={{ top: 30, left: -20, width: 180, height: 180, opacity: 0.55, color: "rgba(244, 234, 219, 0.6)" }}>
        <MonsteraLeaf size={180} color="rgba(244, 234, 219, 0.6)" />
      </div>
      <div className="botanical" style={{ bottom: 120, right: -30, width: 220, height: 220, transform: "rotate(45deg)", color: "rgba(244, 234, 219, 0.5)" }}>
        <PalmFrond size={220} color="rgba(244, 234, 219, 0.55)" />
      </div>

      <div className="cover-content">
        <div className="eyebrow">{t.coverEyebrow}</div>
        <h1 className="cover-names">
          <span>{t.bride}</span>
          <span className="amp">&amp;</span>
          <span>{t.groom}</span>
        </h1>
        <div className="cover-date">{t.coverDate}</div>
        <div className="cover-place">{t.coverPlace}</div>
        <p className="cover-subline">{t.coverSubline}</p>
      </div>

      <div className="cover-scroll">{t.coverScroll}</div>
    </section>
  );
}

// ============================================================
// Greeting section — text + 2 photos
// ============================================================
function Greeting({ t }) {
  return (
    <section className="greeting">
      <div className="botanical" style={{ top: -40, right: -60, width: 260, height: 260, transform: "rotate(15deg)" }}>
        <MonsteraLeaf size={260} color="var(--sage)" style={{ opacity: 0.25 }} />
      </div>
      <div className="container">
        <div className="greeting-grid">
          <div className="greeting-photos reveal">
            <div className="gp-1" />
            <div className="gp-2" />
            <div className="botanical" style={{ position: "absolute", bottom: -30, left: -30, width: 110, height: 110, color: "var(--terra-soft)", opacity: 0.85 }}>
              <Frangipani size={110} color="var(--terra-soft)" />
            </div>
          </div>
          <div className="greeting-text reveal">
            <div className="eyebrow">{t.greetingEyebrow}</div>
            <h2 style={{ marginTop: "1rem" }}>{t.greetingTitle}</h2>
            <HeartDivider color="var(--sage)" style={{ marginBottom: "1.5rem", marginTop: "0.5rem" }} />
            <p>{t.greetingText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Photo band — editorial 3-up + heading
// ============================================================
function PhotoBand({ t }) {
  return (
    <section className="photo-band">
      <div className="botanical" style={{ top: 20, left: 10, width: 140, height: 140, color: "var(--sage)" }}>
        <PalmFrond size={140} color="var(--sage)" />
      </div>
      <div className="photo-band-inner">
        <div className="pb-text reveal">
          <div className="eyebrow">{t.bandEyebrow}</div>
          <h2>{t.bandTitle}</h2>
        </div>
        <div className="pb-card large reveal" style={{ backgroundImage: `url(photos/IMG_0575.JPG)`, transform: "translateY(20px)" }} />
        <div className="pb-card med reveal"   style={{ backgroundImage: `url(photos/IMG_0530.JPG)` }} />
        <div className="pb-card small reveal" style={{ backgroundImage: `url(photos/IMG_0547.JPG)`, transform: "translateY(40px)" }} />
      </div>
    </section>
  );
}

// ============================================================
// Countdown
// ============================================================
function pad(n) { return String(Math.max(0, n)).padStart(2, "0"); }

function Countdown({ t }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, WEDDING_AT - now);
  const total = Math.floor(diff / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return (
    <section className="countdown">
      <div className="botanical" style={{ top: 30, left: -40, width: 200, height: 200, transform: "rotate(-20deg)" }}>
        <MonsteraLeaf size={200} color="var(--sage)" style={{ opacity: 0.3 }} />
      </div>
      <div className="botanical" style={{ bottom: 30, right: -40, width: 200, height: 200, transform: "scaleX(-1) rotate(-15deg)" }}>
        <MonsteraLeaf size={200} color="var(--sea)" style={{ opacity: 0.25 }} />
      </div>

      <div className="countdown-inner reveal">
        <div className="eyebrow">{t.countdownEyebrow}</div>
        <h2 style={{ marginTop: "1rem", fontStyle: "italic", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>{t.countdownTitle}</h2>
        <HeartDivider color="var(--sea)" style={{ margin: "1.5rem auto" }} />

        <div className="countdown-grid">
          {[
            { n: days, l: t.days },
            { n: pad(hours), l: t.hours },
            { n: pad(minutes), l: t.minutes },
            { n: pad(seconds), l: t.seconds },
          ].map((c, i) => (
            <div key={i} className="cd-cell">
              <div className="cd-num">{c.n}</div>
              <div className="cd-label">{c.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Schedule
// ============================================================
function Schedule({ t }) {
  return (
    <section className="schedule">
      <div className="botanical" style={{ top: 60, right: 20, width: 140, height: 140, opacity: 0.6 }}>
        <Frangipani size={140} color="var(--terra-soft)" />
      </div>

      <div className="container">
        <div className="sched-head reveal">
          <div className="eyebrow">{t.schedEyebrow}</div>
          <h2 style={{ marginTop: "1rem", fontStyle: "italic" }}>{t.schedTitle}</h2>
          <HeartDivider color="var(--sage)" style={{ margin: "1.5rem auto" }} />
          <p>{t.schedIntro}</p>
        </div>

        <div className="timeline">
          {t.sched.map((item, i) => (
            <div key={i} className="sched-item reveal">
              <div className="time">{item.time}</div>
              <div className="sched-dot" />
              <div className="label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Full-bleed photo quote
// ============================================================
function BleedQuote({ t, photo, quote, attr }) {
  return (
    <section className="bleed" style={{ backgroundImage: `url(photos/${photo})` }}>
      <div className="bleed-content reveal">
        <div className="quote">{quote}</div>
        <div className="attr">{attr}</div>
      </div>
    </section>
  );
}

// ============================================================
// Venue
// ============================================================
function Venue({ t }) {
  return (
    <section className="venue">
      <div className="botanical" style={{ top: 40, left: 20, width: 130, height: 130, transform: "rotate(20deg)" }}>
        <Frangipani size={130} color="var(--terra-soft)" />
      </div>

      <div className="venue-grid">
        <div className="venue-info reveal">
          <div className="eyebrow">{t.venueEyebrow}</div>
          <h2 style={{ marginTop: "1rem" }}>{t.venueTitle}</h2>
          <HeartDivider color="var(--sage)" style={{ marginTop: "1.5rem", marginBottom: "2rem", marginLeft: 0 }} />
          <div className="place-name">{t.venuePlaceLatin}</div>
          <div className="venue-address">{t.venueAddress}</div>
          <div className="venue-transfer">{t.venueTransfer}</div>
          <a className="btn" href={VENUE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            <MapPin size={16} color="currentColor" /> {t.venueOpenMap}
          </a>
        </div>

        <div className="venue-image reveal">
          <div className="map-frame">
            <iframe
              title="The Cove Bali map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=114.94%2C-8.62%2C115.04%2C-8.52&amp;layer=mapnik&amp;marker=-8.57%2C114.99"
              loading="lazy"
            />
          </div>
          <div className="map-pin">
            <MapPin size={56} color="var(--terra)" />
          </div>
          <div className="venue-stamp">
            <div>{t.venueStampLine1}</div>
            <div className="big">{t.venueStampBig}</div>
            <div>8.57°S · 114.99°E</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Dress code
// ============================================================
function DressCode({ t }) {
  return (
    <section className="dress">
      <div className="dress-inner">
        <div className="dress-photo reveal" />
        <div className="dress-text reveal">
          <div className="eyebrow">{t.dressEyebrow}</div>
          <h2 style={{ fontStyle: "italic" }}>{t.dressTitle}</h2>
          <HeartDivider color="var(--sage)" style={{ marginTop: "1.5rem", marginBottom: "2rem", marginLeft: 0 }} />
          <p>{t.dressText}</p>
          <div className="palette">
            {SWATCHES.map((s, i) => (
              <div key={i} className="swatch" style={{ background: s.hex }} data-hex={s.hex} title={s.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Photo carousel — 3D coverflow
// ============================================================
function Carousel({ t }) {
  const [idx, setIdx] = useState(0);
  const n = PHOTOS.length;

  const prev = () => setIdx((idx - 1 + n) % n);
  const next = () => setIdx((idx + 1) % n);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section className="carousel-section">
      <div className="carousel-head reveal">
        <div className="eyebrow">{t.carouselEyebrow}</div>
        <h2>{t.carouselTitle}</h2>
        <p>{t.carouselSub}</p>
      </div>

      <div className="carousel-wrap"
           onTouchStart={(e) => { e.currentTarget._x = e.touches[0].clientX; }}
           onTouchEnd={(e) => {
             const dx = e.changedTouches[0].clientX - (e.currentTarget._x || 0);
             if (dx > 40) prev();
             else if (dx < -40) next();
           }}>
        <div className="car-stage">
          {PHOTOS.map((p, i) => {
            let rel = i - idx;
            if (rel > n / 2) rel -= n;
            if (rel < -n / 2) rel += n;
            const abs = Math.abs(rel);
            if (abs > 3) return null;

            const x = rel * 110;        // px
            const z = -abs * 200;       // px
            const rot = rel * -10;      // deg
            const opacity = abs > 2 ? 0 : 1 - abs * 0.25;
            const filter = abs === 0 ? "none" : `brightness(${1 - abs * 0.15}) saturate(${1 - abs * 0.2})`;
            const zIndex = 10 - abs;

            return (
              <div
                key={p}
                className="car-card"
                style={{
                  backgroundImage: `url(photos/${p})`,
                  transform: `translate3d(${x}px, 0, ${z}px) rotateY(${rot}deg)`,
                  opacity,
                  filter,
                  zIndex,
                  pointerEvents: abs > 0 ? "auto" : "none",
                  cursor: abs > 0 ? "pointer" : "default",
                }}
                onClick={() => abs > 0 && setIdx(i)}
                aria-hidden={abs > 0}
              />
            );
          })}
        </div>

        <div className="car-controls">
          <button className="car-btn" onClick={prev} aria-label={t.carouselPrev}>
            <ArrowIcon dir="left" />
          </button>
          <div className="car-counter">{String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</div>
          <button className="car-btn" onClick={next} aria-label={t.carouselNext}>
            <ArrowIcon dir="right" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// RSVP form
// ============================================================
function Rsvp({ t, lang }) {
  const [attending, setAttending] = useState("");
  const [state, setState] = useState("idle"); // idle / sending / sent / error

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!attending) return;
    setState("sending");
    const form = e.target;
    const data = new FormData(form);
    data.set("attending", attending);
    data.set("access_key", "63feca7e-d92f-4516-b6c8-b2337fb71e2b");
    data.set("subject", `RSVP: ${t.bride} & ${t.groom}`);
    data.set("lang", lang);
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="rsvp" id="rsvp">
      <div className="container">
        <div className="rsvp-head reveal">
          <div className="eyebrow">{t.rsvpEyebrow}</div>
          <h2 style={{ marginTop: "1rem", fontStyle: "italic" }}>{t.rsvpTitle}</h2>
          <HeartDivider color="var(--sage)" style={{ margin: "1.5rem auto" }} />
          <p>{t.rsvpIntro}</p>
          <div className="rsvp-deadline">{t.rsvpDeadline}</div>
        </div>

        {state === "sent" ? (
          <div className="rsvp-status sent" style={{ fontSize: "1.1rem", padding: "2.5rem 1.5rem" }}>
            <Frangipani size={50} color="var(--sage)" style={{ display: "block", margin: "0 auto 1rem" }} />
            {t.rsvpSent}
          </div>
        ) : (
          <form className="reveal" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="rsvp-name">{t.rsvpName}</label>
              <input id="rsvp-name" name="name" type="text" required />
            </div>

            <div className="field">
              <label>{t.rsvpAttending}</label>
              <div className="radio-group">
                <label className="radio-pill">
                  <input type="radio" name="attending-r" value="yes" checked={attending === "yes"} onChange={() => setAttending("yes")} />
                  <span className="pill">{t.rsvpYes}</span>
                </label>
                <label className="radio-pill">
                  <input type="radio" name="attending-r" value="no" checked={attending === "no"} onChange={() => setAttending("no")} />
                  <span className="pill">{t.rsvpNo}</span>
                </label>
              </div>
            </div>

            {attending === "yes" && (
              <>
                <div className="field">
                  <label htmlFor="rsvp-plus">{t.rsvpPlusOne}</label>
                  <input id="rsvp-plus" name="plusOne" type="text" placeholder={t.rsvpPlusOnePlaceholder} />
                </div>
                <div className="field">
                  <label htmlFor="rsvp-diet">{t.rsvpDiet}</label>
                  <textarea id="rsvp-diet" name="diet" rows={2} placeholder={t.rsvpDietPlaceholder} />
                </div>
              </>
            )}

            <div className="field">
              <label htmlFor="rsvp-msg">{t.rsvpMessage}</label>
              <textarea id="rsvp-msg" name="message" rows={3} placeholder={t.rsvpMessagePlaceholder} />
            </div>

            <div className="rsvp-submit">
              <button type="submit" className="btn" disabled={state === "sending" || !attending}>
                {state === "sending" ? t.rsvpSending : t.rsvpSubmit}
              </button>
            </div>

            {state === "error" && <div className="rsvp-status error">{t.rsvpError}</div>}
          </form>
        )}
      </div>
    </section>
  );
}

// ============================================================
// Gifts + closing notes
// ============================================================
function Gifts({ t }) {
  return (
    <section className="note-section gifts">
      <div className="container reveal">
        <div className="ornament">
          <Frangipani size={56} color="var(--terra-soft)" />
        </div>
        <div className="eyebrow" style={{ marginTop: "1.5rem" }}>{t.giftsEyebrow}</div>
        <p>{t.giftsText}</p>
      </div>
    </section>
  );
}

function Closing({ t }) {
  return (
    <section className="note-section closing">
      <div className="container reveal">
        <div className="eyebrow">{t.closingEyebrow}</div>
        <p>«{t.closingText}»</p>
        <HeartDivider color="var(--sage)" style={{ margin: "2rem auto 1rem" }} />
        <div style={{
          fontFamily: "var(--display)", fontStyle: "italic",
          color: "var(--ink-soft)", fontSize: "1.1rem",
        }}>{t.closingSign}</div>
        <div style={{
          fontFamily: "var(--display)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          color: "var(--ink)",
          marginTop: "0.4rem",
        }}>
          {t.bride} <span style={{ color: "var(--terra)", fontStyle: "italic" }}>&amp;</span> {t.groom}
        </div>
      </div>
    </section>
  );
}

function Footer({ t, lang, setLang }) {
  return (
    <footer>
      <div className="footer-names">
        {t.bride} <span className="amp">&amp;</span> {t.groom}
      </div>
      <div className="footer-date">{t.coverDate} · Bali</div>
      <div className="footer-langs">
        <button onClick={() => setLang("ru")} className={lang === "ru" ? "active" : ""}>Русский</button>
        <span style={{ color: "var(--ink-mute)" }}>·</span>
        <button onClick={() => setLang("ja")} className={lang === "ja" ? "active" : ""}>日本語</button>
        <span style={{ color: "var(--ink-mute)" }}>·</span>
        <button onClick={() => setLang("ko")} className={lang === "ko" ? "active" : ""}>한국어</button>
      </div>
    </footer>
  );
}

// ============================================================
// Root app
// ============================================================
function App() {
  const [lang, setLangState] = useState(detectLang);
  const [opened, setOpened] = useState(() => {
    try { return sessionStorage.getItem("wedding-envelope-opened") === "1"; }
    catch (e) { return false; }
  });

  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem("wedding-lang", l); } catch (e) {}
  }, []);

  const t = COPY[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.pageTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t.pageDesc);
  }, [lang, t]);

  const onOpen = useCallback(() => {
    setOpened(true);
    try { sessionStorage.setItem("wedding-envelope-opened", "1"); } catch (e) {}
  }, []);

  useReveal();

  return (
    <>
      {!opened && <Envelope t={t} onOpen={onOpen} />}
      {opened && <LangSwitcher lang={lang} setLang={setLang} />}
      {opened && <AudioToggle lang={lang} t={t} started={opened} />}

      <Cover t={t} />
      <Greeting t={t} />
      <PhotoBand t={t} />
      <BleedQuote t={t} photo="IMG_0556.JPG" quote={t.quote1} attr={t.quote1Attr} />
      <Countdown t={t} />
      <Schedule t={t} />
      <BleedQuote t={t} photo="IMG_0568.JPG" quote={`«${t.coverSubline}»`} attr={t.coverPlace} />
      <Venue t={t} />
      <DressCode t={t} />
      <Carousel t={t} />
      <Rsvp t={t} lang={lang} />
      <Gifts t={t} />
      <Closing t={t} />
      <Footer t={t} lang={lang} setLang={setLang} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
