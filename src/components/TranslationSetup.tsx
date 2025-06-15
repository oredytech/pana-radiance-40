
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { translationService } from "@/services/translationService";

interface TranslationSetupProps {
  onApiKeySet: () => void;
}

const TranslationSetup = ({ onApiKeySet }: TranslationSetupProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    try {
      translationService.setApiKey(apiKey);
      localStorage.setItem('google-translate-api-key', apiKey);
      onApiKeySet();
    } catch (error) {
      console.error('Erreur lors de la configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configuration de la traduction</CardTitle>
        <CardDescription>
          Entrez votre clé API Google Translate pour activer la traduction du site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Clé API Google Translate"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button type="submit" disabled={!apiKey.trim() || isLoading} className="w-full">
            {isLoading ? "Configuration..." : "Configurer"}
          </Button>
        </form>
        <div className="mt-4 text-xs text-gray-600">
          <p>Pour obtenir une clé API :</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Allez sur Google Cloud Console</li>
            <li>Activez l'API Google Translate</li>
            <li>Créez une clé API</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationSetup;
