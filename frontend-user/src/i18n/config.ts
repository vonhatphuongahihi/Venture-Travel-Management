import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './locales/vi.json';
import en from './locales/en.json';

const resources = {
    vi: {
        translation: vi
    },
    en: {
        translation: en
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('language') || 'vi', // default language
        fallbackLng: 'vi',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;

