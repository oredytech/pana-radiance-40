
import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/hooks/useTranslation";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", nativeName: "Igbo", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬" },
];

const LanguageSelector = () => {
  const [open, setOpen] = useState(false);
  const { isLoaded, currentLanguage, translateTo, resetToOriginal, retranslateContent } = useTranslation();

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (languageCode: string) => {
    setOpen(false);
    if (languageCode === 'fr') {
      resetToOriginal();
    } else {
      translateTo(languageCode);
    }
    
    // Forcer la retraduction du contenu après un court délai
    setTimeout(() => {
      retranslateContent();
    }, 1000);
  };

  return (
    <>
      {/* Element caché pour Google Translate */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:text-pana-red flex items-center gap-2"
            aria-label="Sélectionner la langue"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">{currentLang.flag} {currentLang.code.toUpperCase()}</span>
            <span className="sm:hidden">{currentLang.flag}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Sélectionner la langue</h4>
            {!isLoaded && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pana-red mx-auto mb-2"></div>
                <span className="text-sm text-gray-600">Chargement du traducteur...</span>
              </div>
            )}
            {isLoaded && (
              <ScrollArea className="h-60">
                <div className="space-y-1">
                  {languages.map((language) => (
                    <Button
                      key={language.code}
                      variant="ghost"
                      className={`w-full justify-start text-left p-2 h-auto hover:bg-gray-50 transition-colors ${
                        currentLanguage === language.code ? 'bg-gray-100 border border-pana-red' : ''
                      }`}
                      onClick={() => handleLanguageSelect(language.code)}
                    >
                      <span className="mr-3 text-lg">{language.flag}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{language.nativeName}</span>
                        <span className="text-xs text-gray-500">{language.name}</span>
                      </div>
                      {currentLanguage === language.code && (
                        <span className="ml-auto text-pana-red text-xs">✓</span>
                      )}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            )}
            <div className="text-xs text-center mt-2 p-2 bg-gray-50 rounded">
              <span className="text-green-600">✅ Traduction complète par Google</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default LanguageSelector;
