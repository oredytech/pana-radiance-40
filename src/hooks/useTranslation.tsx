
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
      // Nettoyer les anciens scripts
      const existingScript = document.getElementById('google-translate-script');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Translate script loaded');
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Translate script');
      };
      
      document.head.appendChild(script);

      window.googleTranslateElementInit = () => {
        try {
          if (window.google && window.google.translate) {
            // Nettoyer l'ancien élément
            const oldElement = document.getElementById('google_translate_element');
            if (oldElement) {
              oldElement.innerHTML = '';
            }

            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'fr',
                includedLanguages: 'fr,en,es,de,it,pt,ar,zh,ja,ko,ru,hi,sw,yo,ig,ha',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              'google_translate_element'
            );
            
            console.log('Google Translate initialized successfully');
            setIsGoogleTranslateLoaded(true);
          }
        } catch (error) {
          console.error('Error initializing Google Translate:', error);
        }
      };
    };

    // Créer l'élément Google Translate (caché)
    if (!document.getElementById('google_translate_element')) {
      const translateElement = document.createElement('div');
      translateElement.id = 'google_translate_element';
      translateElement.style.display = 'none';
      translateElement.style.position = 'absolute';
      translateElement.style.top = '-9999px';
      translateElement.style.left = '-9999px';
      document.body.appendChild(translateElement);
    }

    // Délai pour permettre au DOM de se stabiliser
    setTimeout(loadGoogleTranslate, 500);
  }, []);

  const translatePage = (languageCode: string) => {
    console.log('Attempting to translate to:', languageCode);
    
    if (!isGoogleTranslateLoaded) {
      console.warn('Google Translate not loaded yet');
      return;
    }

    // Méthode 1: Utiliser le sélecteur Google Translate
    const translateSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (translateSelect) {
      console.log('Using Google Translate select method');
      translateSelect.value = languageCode;
      translateSelect.dispatchEvent(new Event('change', { bubbles: true }));
      setCurrentLanguage(languageCode);
      return;
    }

    // Méthode 2: Rechercher et cliquer sur les éléments de menu
    setTimeout(() => {
      const menuFrame = document.querySelector('.goog-te-menu-frame');
      if (menuFrame) {
        const frameDoc = (menuFrame as HTMLIFrameElement).contentDocument;
        if (frameDoc) {
          const languageLink = frameDoc.querySelector(`a[href*="sl=auto&tl=${languageCode}"]`) as HTMLElement;
          if (languageLink) {
            console.log('Using iframe click method');
            languageLink.click();
            setCurrentLanguage(languageCode);
            return;
          }
        }
      }

      // Méthode 3: Manipulation directe de l'URL de traduction
      const currentUrl = window.location.href;
      if (languageCode === 'fr') {
        // Retourner à la version française (originale)
        if (currentUrl.includes('translate.goog')) {
          window.location.href = currentUrl.replace(/https:\/\/[^\/]*\.translate\.goog\/[^\/]*\//, 'https://');
        }
      } else {
        // Rediriger vers Google Translate
        const translateUrl = `https://translate.google.com/translate?sl=fr&tl=${languageCode}&u=${encodeURIComponent(window.location.href)}`;
        window.open(translateUrl, '_self');
      }
      
      setCurrentLanguage(languageCode);
    }, 100);
  };

  return {
    currentLanguage,
    translatePage,
    isGoogleTranslateLoaded,
  };
};
