
interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

class TranslationService {
  private apiKey: string | null = null;
  private cache = new Map<string, string>();

  setApiKey(key: string) {
    this.apiKey = key;
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${text}-${targetLang}`;
  }

  async translateText(text: string, targetLanguage: string): Promise<TranslationResponse> {
    if (!this.apiKey) {
      throw new Error('Clé API Google Translate non configurée');
    }

    const cacheKey = this.getCacheKey(text, targetLanguage);
    if (this.cache.has(cacheKey)) {
      return { translatedText: this.cache.get(cacheKey)! };
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
            format: 'html'
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data: GoogleTranslateResponse = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      
      // Mettre en cache la traduction
      this.cache.set(cacheKey, translatedText);
      
      return {
        translatedText,
        detectedSourceLanguage: data.data.translations[0].detectedSourceLanguage
      };
    } catch (error) {
      console.error('Erreur de traduction:', error);
      throw new Error('Échec de la traduction');
    }
  }

  async translateElement(element: Element, targetLanguage: string): Promise<void> {
    const textNodes = this.getTextNodes(element);
    
    for (const node of textNodes) {
      const originalText = node.textContent?.trim();
      if (originalText && originalText.length > 1) {
        try {
          const result = await this.translateText(originalText, targetLanguage);
          node.textContent = result.translatedText;
        } catch (error) {
          console.warn('Erreur lors de la traduction du nœud:', error);
        }
      }
    }
  }

  private getTextNodes(element: Element): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          // Ignorer les scripts, styles et éléments cachés
          if (parent.tagName === 'SCRIPT' || 
              parent.tagName === 'STYLE' || 
              parent.style.display === 'none') {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Ignorer les nœuds vides ou avec seulement des espaces
          if (!node.textContent?.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }
    
    return textNodes;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const translationService = new TranslationService();
