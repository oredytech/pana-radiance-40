
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
    <div className="inline-flex items-center gap-3">
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
        <Card className="absolute top-12 left-0 z-10 w-80">
          <CardContent className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Voix
              </label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une voix" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Vitesse: {speechRate}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full"
              />
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

            <p className="text-xs text-gray-500">
              <Volume2 className="h-3 w-3 inline mr-1" />
              Lecture vocale par le navigateur (gratuit)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArticleAudioPlayer;
