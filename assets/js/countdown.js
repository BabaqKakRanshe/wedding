// Countdown — updates the four cells in the date/countdown section every second.
// Target date is a placeholder until SPEC §9 / TODO 🔴 are resolved.
// Format: ISO 8601 with timezone. Use Asia/Tokyo offset (+09:00) since wedding is in Japan.

const TARGET_ISO = '2026-09-12T15:00:00+09:00'; // PLACEHOLDER — replace when wedding date confirmed

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const target = new Date(TARGET_ISO).getTime();
  const now = Date.now();
  let diff = Math.max(0, target - now);

  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);  diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = pad(val);
  };
  set('cd-days', days);
  set('cd-hours', hours);
  set('cd-minutes', minutes);
  set('cd-seconds', seconds);
}

document.addEventListener('DOMContentLoaded', () => {
  tick();
  setInterval(tick, 1000);
});
