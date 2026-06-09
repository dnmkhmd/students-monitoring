// i18n.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ruTranslation from './locales/ru.json';
import kzTranslation from './locales/kz.json';
import enTranslation from './locales/en.json';

const resources = {
  ru: {
    translation: ruTranslation
  },
  kk: {
    translation: kzTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;
