import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files - using simplified versions for admin
const resources = {
  en: {
    translation: {
      "dashboard": {
        "title": "Admin Dashboard",
        "overview": "Overview",
        "properties": "Properties",
        "gallery": "Gallery",
        "agents": "Agents",
        "users": "Users",
        "leads": "Leads",
        "messages": "Inquiries",
        "blogs": "Blogs",
        "settings": "Settings",
        "notifications": "Notifications",
        "appointments": "Appointments",
        "aichats": "AI Chats",
        "logout": "Logout"
      }
    }
  },
  bn: {
    translation: {
      "dashboard": {
        "title": "অ্যাডমিন ড্যাশবোর্ড",
        "overview": "ওভারভিউ",
        "properties": "প্রপার্টিজ",
        "gallery": "গ্যালারি",
        "agents": "এজেন্ট",
        "users": "ইউজার",
        "leads": "লিড",
        "messages": "ইনকোয়ারি",
        "blogs": "ব্লগ",
        "settings": "সেটিংস",
        "notifications": "নোটিফিকেশন",
        "appointments": "অ্যাপয়েন্টমেন্ট",
        "aichats": "এআই চ্যাট",
        "logout": "লগআউট"
      }
    }
  },
  de: {
    translation: {
      "dashboard": {
        "title": "Admin-Dashboard",
        "overview": "Übersicht",
        "properties": "Immobilien",
        "gallery": "Galerie",
        "agents": "Agenten",
        "users": "Benutzer",
        "leads": "Leads",
        "messages": "Anfragen",
        "blogs": "Blogs",
        "settings": "Einstellungen",
        "notifications": "Benachrichtigungen",
        "appointments": "Termine",
        "aichats": "KI-Chats",
        "logout": "Abmelden"
      }
    }
  },
  nl: {
    translation: {
      "dashboard": {
        "title": "Admin-dashboard",
        "overview": "Overzicht",
        "properties": "Woningen",
        "gallery": "Galerij",
        "agents": "Agenten",
        "users": "Gebruikers",
        "leads": "Leads",
        "messages": "Aanvragen",
        "blogs": "Blogs",
        "settings": "Instellingen",
        "notifications": "Meldingen",
        "appointments": "Afspraken",
        "aichats": "AI-Chats",
        "logout": "Uitloggen"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lng') || 'en', // Use same storage as client
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
