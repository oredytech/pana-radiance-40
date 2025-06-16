
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { stripHtml } from '@/utils/textUtils';

interface ArticleAudioPlayerProps {
  title: string;
  content: string;
}

const ArticleAudioPlayer = ({ title, content }: ArticleAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speechRate, setSpeechRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cleanText = stripHtml(content).substring(0, 5000); // Limiter à 5000 caractères
  const fullText = `${stripHtml(title)}. ${cleanText}`;

  // Charger les voix disponibles
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Sélectionner la première voix française ou la première voix disponible
      const frenchVoice = availableVoices.find(voice => voice.lang.startsWith('fr'));
      const defaultVoice = frenchVoice || availableVoices[0];
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    
    // Certains navigateurs chargent les voix de manière asynchrone
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const togglePlayPause = () => {
    if (isPlaying && !isPaused) {
      // Pause
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      // Resume
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      // Start new speech
      const utterance = new SpeechSynthesisUtterance(fullText);
      const voice = voices.find(v => v.name === selectedVoice);
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = speechRate;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        alert('Erreur lors de la lecture de l\'article');
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="relative inline-flex items-center gap-3">
      <Button
        onClick={togglePlayPause}
        size="sm"
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
      >
        {isPlaying && !isPaused ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        {isPlaying && !isPaused ? 'Pause' : 'Écouter l\'article'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSettings(!showSettings)}
        className="p-2"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {showSettings && (
        <Card className="absolute top-12 right-0 z-50 w-80 shadow-lg border-2">
          <CardContent className="p-4 space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-semibold text-lg mb-2">Paramètres de lecture</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Sélection de la voix
              </label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une voix" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      <div className="flex flex-col">
                        <span className="font-medium">{voice.name}</span>
                        <span className="text-xs text-gray-500">
                          {voice.lang} - {voice.localService ? 'Local' : 'Réseau'}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {voices.length} voix disponibles
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Vitesse de lecture: {speechRate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5x (Lent)</span>
                <span>1.0x (Normal)</span>
                <span>2.0x (Rapide)</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Lecture vocale gratuite
                </span>
              </div>
              <p className="text-xs text-blue-700">
                Utilise la synthèse vocale de votre navigateur. 
                La qualité dépend des voix installées sur votre système.
              </p>
            </div>

            {isPlaying && (
              <Button
                onClick={stopSpeech}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                Arrêter la lecture
              </Button>
            )}

            <div className="text-center">
              <Button
                onClick={() => setShowSettings(false)}
                variant="outline"
                size="sm"
                className="px-6"
              >
                Fermer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArticleAudioPlayer;
