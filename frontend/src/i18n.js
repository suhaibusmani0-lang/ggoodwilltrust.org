import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Yahan hum apni dictionary banayenge
const resources = {
  en: {
    translation: {
      "home": "Home",
      "about": "About Us",
      "donate": "Donate",
      "contact": "Contact"
    }
  },
  hi: {
    translation: {
      "home": "होम",
      "about": "हमारे बारे में",
      "donate": "दान करें",
      "contact": "संपर्क करें"
    }
  },
  ar: {
    translation: {
      "home": "الرئيسية",
      "about": "معلومات عنا",
      "donate": "تبرع",
      "contact": "اتصل بنا"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;