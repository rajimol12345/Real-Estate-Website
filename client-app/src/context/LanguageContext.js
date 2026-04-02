import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export const LanguageContext = createContext();

const SUPPORTED_LANGS = ['en', 'bn', 'de', 'nl'];

export const LanguageProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Initial detection logic
    const getInitialLang = () => {
        const pathParts = window.location.pathname.split('/');
        const urlLang = pathParts[1];
        if (SUPPORTED_LANGS.includes(urlLang)) return urlLang;
        return localStorage.getItem('lng') || 'en';
    };

    const [locale, setLocale] = useState(getInitialLang());

    useEffect(() => {
        i18n.changeLanguage(locale);
        document.documentElement.lang = locale;
        localStorage.setItem('lng', locale);
    }, [locale, i18n]);

    // Handle URL changes manually or via popstate if needed
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const urlLang = pathParts[1];
        if (SUPPORTED_LANGS.includes(urlLang) && urlLang !== locale) {
            setLocale(urlLang);
        }
    }, [location.pathname, locale]);

    const switchLanguage = (lng) => {
        if (lng === locale) return;
        
        const pathParts = location.pathname.split('/');
        let newPath;
        
        if (SUPPORTED_LANGS.includes(pathParts[1])) {
            pathParts[1] = lng;
            newPath = pathParts.join('/');
        } else {
            newPath = `/${lng}${location.pathname === '/' ? '' : location.pathname}`;
        }
        
        setLocale(lng);
        navigate(newPath);
    };

    /**
     * Helper to get localized text from a DB object.
     * Usage: getLocalized(property.title)
     */
    const getLocalized = (obj) => {
        if (!obj) return '';
        // If it's already a string, return it
        if (typeof obj === 'string') return obj;
        // Return translated version or fallback to English
        return obj[locale] || obj['en'] || Object.values(obj)[0] || '';
    };

    return (
        <LanguageContext.Provider value={{ locale, switchLanguage, getLocalized }}>
            {children}
        </LanguageContext.Provider>
    );
};
