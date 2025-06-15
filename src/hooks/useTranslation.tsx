
import { useState, useEffect } from "react";
import { translationService } from "@/services/translationService";

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState("fr");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(false);

  // Vérifier si une clé API est déjà configurée
  useEffect(() => {
    const savedApiKey = localStorage.getItem('google-translate-api-key');
    if (savedApiKey) {
      translationService.setApiKey(savedApiKey);
      setIsApiKeyConfigured(true);
    }

    // Détecter la langue du navigateur
    const browserLanguage = navigator.language.split('-')[0];
    const supportedLanguages = ['fr', 'en', 'es', 'de', 'it', 'pt', 'ar', 'zh', 'ja', 'ko', 'ru', 'hi', 'sw', 'yo', 'ig', 'ha'];
    
    if (supportedLanguages.includes(browserLanguage)) {
      setCurrentLanguage(browserLanguage);
    }
  }, []);

  const configureApiKey = () => {
    setIsApiKeyConfigured(true);
  };

  const translatePage = async (languageCode: string) => {
    if (!isApiKeyConfigured) {
      setTranslationError('Clé API non configurée');
      return;
    }

    if (languageCode === currentLanguage) {
      return;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      if (languageCode === 'fr') {
        // Recharger la page pour revenir au français original
        window.location.reload();
        return;
      }

      // Identifier les éléments à traduire
      const elementsToTranslate = document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, p, span, a, button, li, td, th, label, [data-translate]'
      );

      // Traduire chaque élément
      for (const element of elementsToTranslate) {
        if (element.children.length === 0 && element.textContent?.trim()) {
          try {
            await translationService.translateElement(element, languageCode);
          } catch (error) {
            console.warn('Erreur lors de la traduction d\'un élément:', error);
          }
        }
      }

      setCurrentLanguage(languageCode);
      
    } catch (error) {
      console.error('Erreur de traduction:', error);
      setTranslationError('Erreur lors de la traduction');
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    currentLanguage,
    translatePage,
    isTranslating,
    translationError,
    isApiKeyConfigured,
    configureApiKey,
  };
};
