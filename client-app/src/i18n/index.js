import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import bn from './locales/bn.json';
import de from './locales/de.json';
import nl from './locales/nl.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            bn: { translation: bn },
            de: { translation: de },
            nl: { translation: nl },
        },
        fallbackLng: 'en',
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'i18nextLng',
            cacheUserLanguage: true,
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
