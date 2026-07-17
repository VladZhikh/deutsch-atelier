// assets/js/app.js

const DEFAULT_LANG = localStorage.getItem('da_lang') || 'ru';

const LANG_FILES = {
  ru: 'data/ui.ru.json',
  uk: 'data/ui.uk.json',
  en: 'data/ui.en.json',
  es: 'data/ui.es.json'
};

let currentTranslations = {};

async function loadTranslations(lang) {
  const file = LANG_FILES[lang] || LANG_FILES.ru;

  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Failed to load translation file: ${file}`);
    }

    currentTranslations = await response.json();
    return currentTranslations;
  } catch (error) {
    console.error('Translation load error:', error);

    if (lang !== 'ru') {
      return loadTranslations('ru');
    }

    currentTranslations = {};
    return currentTranslations;
  }
}

function applyTranslations(translations) {
  document.documentElement.lang = localStorage.getItem('da_lang') || 'ru';

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (translations[key]) {
      element.textContent = translations[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.dataset.i18nPlaceholder;
    if (translations[key]) {
      element.placeholder = translations[key];
    }
  });

  const switcher = document.getElementById('languageSwitcher');
  if (switcher) {
    switcher.value = localStorage.getItem('da_lang') || 'ru';
  }
}

async function setLanguage(lang) {
  localStorage.setItem('da_lang', lang);
  const translations = await loadTranslations(lang);
  applyTranslations(translations);
}

function initLanguageSwitcher() {
  const switcher = document.getElementById('languageSwitcher');
  if (!switcher) return;

  switcher.value = DEFAULT_LANG;

  switcher.addEventListener('change', async () => {
    await setLanguage(switcher.value);
  });
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.14 });

  items.forEach(item => observer.observe(item));
}

async function initApp() {
  const lang = localStorage.getItem('da_lang') || 'ru';
  const translations = await loadTranslations(lang);

  applyTranslations(translations);
  initLanguageSwitcher();
  initReveal();
}

document.addEventListener('DOMContentLoaded', initApp);

