
import { useState, useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              layout: number;
              autoDisplay: boolean;
            },
            elementId: string
          ): void;
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
  }
}

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState("fr");
  const [isGoogleTranslateLoaded, setIsGoogleTranslateLoaded] = useState(false);

  // Détecter la langue du navigateur au chargement
  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0];
    const supportedLanguages = ['fr', 'en', 'es', 'de', 'it', 'pt', 'ar', 'zh', 'ja', 'ko', 'ru', 'hi', 'sw', 'yo', 'ig', 'ha'];
    
    if (supportedLanguages.includes(browserLanguage)) {
      setCurrentLanguage(browserLanguage);
    }
  }, []);

  // Charger Google Translate
  useEffect(() => {
    const loadGoogleTranslate = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
      }

      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'fr',
              includedLanguages: 'fr,en,es,de,it,pt,ar,zh,ja,ko,ru,hi,sw,yo,ig,ha',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          );
          setIsGoogleTranslateLoaded(true);
        }
      };
    };

    loadGoogleTranslate();

    // Créer l'élément Google Translate (caché)
    if (!document.getElementById('google_translate_element')) {
      const translateElement = document.createElement('div');
      translateElement.id = 'google_translate_element';
      translateElement.style.display = 'none';
      document.body.appendChild(translateElement);
    }
  }, []);

  const translatePage = (languageCode: string) => {
    if (!isGoogleTranslateLoaded) {
      console.warn('Google Translate not loaded yet');
      return;
    }

    // Trouver le sélecteur Google Translate
    const translateSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (translateSelect) {
      translateSelect.value = languageCode;
      translateSelect.dispatchEvent(new Event('change'));
      setCurrentLanguage(languageCode);
    } else {
      // Fallback: utiliser la méthode directe de Google Translate
      const translateTrigger = document.querySelector('.goog-te-menu-value span');
      if (translateTrigger) {
        (translateTrigger as HTMLElement).click();
        
        setTimeout(() => {
          const languageOption = document.querySelector(`[value="${languageCode}"]`) as HTMLElement;
          if (languageOption) {
            languageOption.click();
            setCurrentLanguage(languageCode);
          }
        }, 100);
      }
    }
  };

  return {
    currentLanguage,
    translatePage,
    isGoogleTranslateLoaded,
  };
};
