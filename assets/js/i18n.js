// i18n — inline dictionaries, browser detection, manual switcher.
// Per SPEC §5. Translations are placeholders pending TODO items (names, date, venue, copy).

const dictionaries = {
  ru: {
    'meta.title': 'Y & S — Свадебное приглашение',
    'meta.description': 'Свадебное приглашение Y & S',
    'hero.saveTheDate': 'Save the date',
    'hero.date': '12 сентября 2026',
    'hero.city': 'Осака, Япония',
    'greeting.title': 'Дорогие гости',
    'greeting.body': 'Мы счастливы пригласить вас разделить с нами день, когда мы скажем друг другу «да». Ваше присутствие — самый дорогой подарок.',
    'date.title': 'До свадьбы',
    'countdown.days': 'Дней',
    'countdown.hours': 'Часов',
    'countdown.minutes': 'Минут',
    'countdown.seconds': 'Секунд',
    'programme.title': 'Программа дня',
    'programme.ceremony.label': 'Церемония',
    'programme.ceremony.desc': 'Регистрация и обмен клятвами',
    'programme.photo.label': 'Фотосессия',
    'programme.photo.desc': 'Совместные снимки с гостями',
    'programme.banquet.label': 'Банкет',
    'programme.banquet.desc': 'Ужин, тосты, танцы',
    'programme.afterparty.label': 'Афтепати',
    'programme.afterparty.desc': 'Для тех, кто остаётся до утра',
    'venue.title': 'Место проведения',
    'venue.name': 'Название площадки',
    'venue.address': 'Адрес латиницей будет здесь',
    'venue.addressJa': '日本語の住所',
    'venue.mapLink': 'Открыть в Google Maps',
    'dressCode.title': 'Дресс-код',
    'dressCode.body': 'Мы будем очень рады, если вы поддержите цветовую гамму праздника.',
    'rsvp.title': 'Подтверждение',
    'rsvp.body': 'Пожалуйста, дайте знать, сможете ли вы быть с нами.',
    'rsvp.button': 'Подтвердить присутствие',
    'rsvp.deadline': 'Просим ответить до {{deadline}}',
    'faq.title': 'Полезное',
    'faq.q1': 'Можно ли с детьми?',
    'faq.a1': 'Информация будет добавлена.',
    'faq.q2': 'Парковка',
    'faq.a2': 'Информация будет добавлена.',
    'faq.q3': 'Подарки',
    'faq.a3': 'Информация будет добавлена.',
    'footer.signaturePrefix': 'с любовью, Y'
  },
  en: {
    'meta.title': 'Y & S — Wedding Invitation',
    'meta.description': 'Wedding invitation for Y & S',
    'hero.saveTheDate': 'Save the date',
    'hero.date': 'September 12, 2026',
    'hero.city': 'Osaka, Japan',
    'greeting.title': 'Dear guests',
    'greeting.body': 'We are so happy to invite you to share the day we say "yes" to each other. Your presence is the most precious gift.',
    'date.title': 'Until the big day',
    'countdown.days': 'Days',
    'countdown.hours': 'Hours',
    'countdown.minutes': 'Minutes',
    'countdown.seconds': 'Seconds',
    'programme.title': 'Programme',
    'programme.ceremony.label': 'Ceremony',
    'programme.ceremony.desc': 'Vows and rings',
    'programme.photo.label': 'Photo session',
    'programme.photo.desc': 'Group photos with guests',
    'programme.banquet.label': 'Banquet',
    'programme.banquet.desc': 'Dinner, toasts, dancing',
    'programme.afterparty.label': 'Afterparty',
    'programme.afterparty.desc': 'For those who stay till morning',
    'venue.title': 'Venue',
    'venue.name': 'Venue name',
    'venue.address': 'Address in Latin script',
    'venue.addressJa': '日本語の住所',
    'venue.mapLink': 'Open in Google Maps',
    'dressCode.title': 'Dress code',
    'dressCode.body': 'We would be delighted if you joined the celebration palette.',
    'rsvp.title': 'RSVP',
    'rsvp.body': 'Please let us know if you can be with us.',
    'rsvp.button': 'Confirm attendance',
    'rsvp.deadline': 'Kindly reply by {{deadline}}',
    'faq.title': 'Good to know',
    'faq.q1': 'Are children welcome?',
    'faq.a1': 'Details to be added.',
    'faq.q2': 'Parking',
    'faq.a2': 'Details to be added.',
    'faq.q3': 'Gifts',
    'faq.a3': 'Details to be added.',
    'footer.signaturePrefix': 'with love, Y'
  },
  ja: {
    'meta.title': 'Y & S — 結婚式のご招待',
    'meta.description': 'Y & S 結婚式のご招待',
    'hero.saveTheDate': 'Save the date',
    'hero.date': '2026年9月12日（土）',
    'hero.city': '日本・大阪',
    'greeting.title': 'ご招待',
    'greeting.body': '私たちが「はい」と誓い合うこの大切な日を、皆さまと共に過ごせますことを心より願っております。',
    'date.title': '結婚式まで',
    'countdown.days': '日',
    'countdown.hours': '時間',
    'countdown.minutes': '分',
    'countdown.seconds': '秒',
    'programme.title': '当日のプログラム',
    'programme.ceremony.label': '挙式',
    'programme.ceremony.desc': '誓いと指輪の交換',
    'programme.photo.label': '写真撮影',
    'programme.photo.desc': 'ゲストとの記念撮影',
    'programme.banquet.label': '披露宴',
    'programme.banquet.desc': 'お食事・乾杯・ダンス',
    'programme.afterparty.label': '二次会',
    'programme.afterparty.desc': '夜を楽しむ皆さまへ',
    'venue.title': '会場',
    'venue.name': '会場名',
    'venue.address': 'Address in Latin script',
    'venue.addressJa': '日本語の住所',
    'venue.mapLink': 'Google Mapsで開く',
    'dressCode.title': 'ドレスコード',
    'dressCode.body': 'お祝いのカラーパレットに合わせていただけますと幸いです。',
    'rsvp.title': '出欠のご連絡',
    'rsvp.body': 'ご出席いただけるかどうか、お知らせください。',
    'rsvp.button': '出欠を回答する',
    'rsvp.deadline': '{{deadline}}までにお返事をお願いいたします',
    'faq.title': 'ご案内',
    'faq.q1': 'お子様連れについて',
    'faq.a1': '追って詳細をお知らせいたします。',
    'faq.q2': '駐車場',
    'faq.a2': '追って詳細をお知らせいたします。',
    'faq.q3': 'お祝いについて',
    'faq.a3': '追って詳細をお知らせいたします。',
    'footer.signaturePrefix': 'with love, Y'
  },
  ko: {
    'meta.title': 'Y & S — 결혼 초대장',
    'meta.description': 'Y & S 결혼식 초대',
    'hero.saveTheDate': 'Save the date',
    'hero.date': '2026년 9월 12일 (토)',
    'hero.city': '일본 오사카',
    'greeting.title': '소중한 분들께',
    'greeting.body': '저희 두 사람이 서로에게 "예"라고 약속하는 이 특별한 날, 함께해 주신다면 더없는 기쁨이겠습니다.',
    'date.title': '결혼식까지',
    'countdown.days': '일',
    'countdown.hours': '시간',
    'countdown.minutes': '분',
    'countdown.seconds': '초',
    'programme.title': '식순',
    'programme.ceremony.label': '예식',
    'programme.ceremony.desc': '서약과 반지 교환',
    'programme.photo.label': '사진 촬영',
    'programme.photo.desc': '하객과의 단체 사진',
    'programme.banquet.label': '피로연',
    'programme.banquet.desc': '식사 · 건배 · 댄스',
    'programme.afterparty.label': '애프터파티',
    'programme.afterparty.desc': '아침까지 함께하실 분들을 위해',
    'venue.title': '예식장',
    'venue.name': '예식장 이름',
    'venue.address': 'Address in Latin script',
    'venue.addressJa': '日本語の住所',
    'venue.mapLink': 'Google 지도에서 열기',
    'dressCode.title': '드레스 코드',
    'dressCode.body': '축제의 컬러 팔레트에 맞춰 주신다면 정말 기쁠 것입니다.',
    'rsvp.title': '참석 회신',
    'rsvp.body': '참석 여부를 알려주세요.',
    'rsvp.button': '참석 회신하기',
    'rsvp.deadline': '{{deadline}}까지 회신 부탁드립니다',
    'faq.title': '안내 사항',
    'faq.q1': '아이와 함께 와도 되나요?',
    'faq.a1': '추후 안내드리겠습니다.',
    'faq.q2': '주차',
    'faq.a2': '추후 안내드리겠습니다.',
    'faq.q3': '축의금',
    'faq.a3': '추후 안내드리겠습니다.',
    'footer.signaturePrefix': 'with love, Y'
  }
};

const SUPPORTED = ['ru', 'en', 'ja', 'ko'];
const STORAGE_KEY = 'wedding-lang';
const DEFAULT_LANG = 'en';

function detectLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;
  const browser = (navigator.language || '').toLowerCase();
  if (browser.startsWith('ru')) return 'ru';
  if (browser.startsWith('ko')) return 'ko';
  if (browser.startsWith('ja')) return 'ja';
  if (browser.startsWith('en')) return 'en';
  return DEFAULT_LANG;
}

function applyLang(lang) {
  if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
  const dict = dictionaries[lang];
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem(STORAGE_KEY, lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  // attribute form: data-i18n-attr="alt:hero.image_alt;title:hero.title"
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const spec = el.getAttribute('data-i18n-attr');
    spec.split(';').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (attr && key && dict[key] !== undefined) el.setAttribute(attr, dict[key]);
    });
  });

  // switcher pressed state
  document.querySelectorAll('[data-lang-set]').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.getAttribute('data-lang-set') === lang ? 'true' : 'false');
  });

  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function initSwitcher() {
  document.querySelectorAll('[data-lang-set]').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.getAttribute('data-lang-set')));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSwitcher();
  applyLang(detectLang());
});

// Expose for countdown.js to read current dictionary
window.__i18n = { dictionaries, getLang: () => document.documentElement.getAttribute('data-lang') || DEFAULT_LANG };
