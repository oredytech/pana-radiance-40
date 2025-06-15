
import { useState, useEffect } from "react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export const useTranslation = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("fr");

  useEffect(() => {
    // Charger le script Google Translate
    if (!document.querySelector('#google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    // Fonction d'initialisation globale
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'fr',
          includedLanguages: 'fr,en,es,de,it,pt,ar,zh,ja,ko,ru,hi,sw,yo,ig,ha',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true
        }, 'google_translate_element');
        setIsLoaded(true);
      }
    };

    // Si Google Translate est déjà chargé
    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  const translateTo = (languageCode: string) => {
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = languageCode;
      selectElement.dispatchEvent(new Event('change'));
      setCurrentLanguage(languageCode);
    }
  };

  const resetToOriginal = () => {
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = '';
      selectElement.dispatchEvent(new Event('change'));
      setCurrentLanguage('fr');
    }
  };

  return {
    isLoaded,
    currentLanguage,
    translateTo,
    resetToOriginal
  };
};
