
import { useState, useEffect, useCallback } from "react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export const useTranslation = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("fr");

  // Fonction pour forcer la retraduction du contenu dynamique
  const retranslateContent = useCallback(() => {
    if (window.google && window.google.translate) {
      // Attendre un peu que le DOM soit mis à jour
      setTimeout(() => {
        try {
          // Forcer Google Translate à scanner le nouveau contenu
          const translateWidget = window.google.translate.TranslateElement;
          if (translateWidget) {
            // Déclencher une nouvelle analyse du DOM
            window.google.translate.TranslateService.getInstance().translatePage();
          }
        } catch (error) {
          console.log('Retranslation attempt:', error);
        }
      }, 100);
    }
  }, []);

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
      
      // Retraduire le contenu après changement de langue
      setTimeout(retranslateContent, 500);
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
    resetToOriginal,
    retranslateContent
  };
};
