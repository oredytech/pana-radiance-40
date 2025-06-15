
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
              multilanguagePage?: boolean;
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
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Détecter la langue du navigateur au chargement
  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0];
    const supportedLanguages = ['fr', 'en', 'es', 'de', 'it', 'pt', 'ar', 'zh', 'ja', 'ko', 'ru', 'hi', 'sw', 'yo', 'ig', 'ha'];
    
    if (supportedLanguages.includes(browserLanguage)) {
      setCurrentLanguage(browserLanguage);
    }
  }, []);

  // Charger Google Translate de manière plus robuste
  useEffect(() => {
    const loadGoogleTranslate = () => {
      setTranslationError(null);
      
      // Nettoyer les anciens éléments
      const existingScript = document.getElementById('google-translate-script');
      if (existingScript) {
        existingScript.remove();
      }

      // Créer l'élément de traduction caché
      let translateElement = document.getElementById('google_translate_element');
      if (!translateElement) {
        translateElement = document.createElement('div');
        translateElement.id = 'google_translate_element';
        translateElement.style.cssText = `
          position: fixed !important;
          top: -9999px !important;
          left: -9999px !important;
          width: 1px !important;
          height: 1px !important;
          overflow: hidden !important;
          z-index: -1 !important;
          opacity: 0 !important;
          pointer-events: none !important;
        `;
        document.body.appendChild(translateElement);
      } else {
        translateElement.innerHTML = '';
      }

      // Fonction d'initialisation
      window.googleTranslateElementInit = () => {
        try {
          console.log('Initialisation de Google Translate...');
          
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'fr',
                includedLanguages: 'fr,en,es,de,it,pt,ar,zh,ja,ko,ru,hi,sw,yo,ig,ha',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
                multilanguagePage: true
              },
              'google_translate_element'
            );
            
            // Attendre que l'élément soit prêt
            setTimeout(() => {
              const selectElement = document.querySelector('.goog-te-combo');
              if (selectElement) {
                console.log('Google Translate prêt avec sélecteur');
                setIsGoogleTranslateLoaded(true);
              } else {
                console.log('Google Translate initialisé mais sélecteur non trouvé');
                setIsGoogleTranslateLoaded(true);
              }
            }, 1000);
          }
        } catch (error) {
          console.error('Erreur lors de l\'initialisation de Google Translate:', error);
          setTranslationError('Erreur d\'initialisation du traducteur');
        }
      };

      // Charger le script
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Script Google Translate chargé');
      };
      
      script.onerror = () => {
        console.error('Échec du chargement de Google Translate');
        setTranslationError('Impossible de charger le traducteur');
      };
      
      document.head.appendChild(script);
    };

    // Délai pour permettre au DOM de se stabiliser
    const timeoutId = setTimeout(loadGoogleTranslate, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const translatePage = (languageCode: string) => {
    console.log('Tentative de traduction vers:', languageCode);
    setTranslationError(null);
    
    if (!isGoogleTranslateLoaded) {
      console.warn('Google Translate pas encore chargé');
      setTranslationError('Traducteur en cours de chargement...');
      return;
    }

    // Si on retourne au français, restaurer la page originale
    if (languageCode === 'fr') {
      // Chercher et utiliser le lien de restauration de Google Translate
      const restoreLink = document.querySelector('.goog-te-menu-value span:first-child') as HTMLElement;
      if (restoreLink && restoreLink.textContent?.includes('Français')) {
        restoreLink.click();
        setCurrentLanguage('fr');
        return;
      }
      
      // Méthode alternative: utiliser le sélecteur
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = 'fr';
        const event = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(event);
        setCurrentLanguage('fr');
        return;
      }
      
      // Dernière méthode: recharger la page sans paramètres de traduction
      const currentUrl = window.location.href;
      if (currentUrl.includes('#googtrans') || currentUrl.includes('translate.goog')) {
        const cleanUrl = currentUrl.split('#')[0].split('?')[0];
        window.location.href = cleanUrl;
      }
      setCurrentLanguage('fr');
      return;
    }

    // Pour les autres langues, utiliser le sélecteur Google Translate
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      console.log('Utilisation du sélecteur Google Translate');
      selectElement.value = languageCode;
      const event = new Event('change', { bubbles: true });
      selectElement.dispatchEvent(event);
      setCurrentLanguage(languageCode);
      
      // Vérifier si la traduction a réussi
      setTimeout(() => {
        const body = document.body;
        if (body.classList.contains('translated-ltr') || body.classList.contains('translated-rtl')) {
          console.log('Traduction réussie');
        } else {
          console.warn('La traduction n\'a peut-être pas fonctionné');
        }
      }, 2000);
      
      return;
    }

    // Méthode de fallback: chercher dans le menu de traduction
    setTimeout(() => {
      const translateMenuFrame = document.querySelector('.goog-te-menu-frame');
      if (translateMenuFrame) {
        try {
          const frameDoc = (translateMenuFrame as HTMLIFrameElement).contentDocument;
          if (frameDoc) {
            const languageLink = frameDoc.querySelector(`a[href*="&tl=${languageCode}"]`) as HTMLElement;
            if (languageLink) {
              console.log('Utilisation du menu iframe');
              languageLink.click();
              setCurrentLanguage(languageCode);
              return;
            }
          }
        } catch (error) {
          console.warn('Impossible d\'accéder au menu iframe:', error);
        }
      }
      
      // Si toutes les méthodes échouent
      console.error('Aucune méthode de traduction disponible');
      setTranslationError('Traduction non disponible pour cette langue');
    }, 500);
  };

  return {
    currentLanguage,
    translatePage,
    isGoogleTranslateLoaded,
    translationError,
  };
};
