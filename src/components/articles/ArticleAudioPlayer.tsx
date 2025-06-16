
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { stripHtml } from '@/utils/textUtils';

interface ArticleAudioPlayerProps {
  title: string;
  content: string;
}

const ArticleAudioPlayer = ({ title, content }: ArticleAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('9BWtsMINqrJLrRacOk9x'); // Aria
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Voices disponibles
  const voices = [
    { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
    { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura' },
    { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte' },
    { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice' },
    { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica' },
  ];

  const cleanText = stripHtml(content).substring(0, 5000); // Limiter à 5000 caractères
  const fullText = `${stripHtml(title)}. ${cleanText}`;

  const generateAudio = async () => {
    if (!apiKey) {
      alert('Veuillez entrer votre clé API ElevenLabs dans les paramètres');
      setShowSettings(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: fullText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération audio');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      if (audioRef.current) {
        audioRef.current.src = url;
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de l\'audio. Vérifiez votre clé API.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!audioUrl) {
      await generateAudio();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      const handleLoadedData = () => {
        if (isLoading) {
          audio.play();
          setIsPlaying(true);
          setIsLoading(false);
        }
      };

      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadeddata', handleLoadedData);

      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [audioUrl, isLoading]);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={togglePlayPause}
              disabled={isLoading}
              size="sm"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isLoading ? 'Génération...' : isPlaying ? 'Pause' : 'Écouter l\'article'}
            </Button>
            
            <Volume2 className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Lecture vocale par IA</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {showSettings && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Clé API ElevenLabs
              </label>
              <Input
                type="password"
                placeholder="Entrez votre clé API ElevenLabs"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Obtenez votre clé API sur{' '}
                <a 
                  href="https://elevenlabs.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  elevenlabs.io
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Voix
              </label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <audio ref={audioRef} style={{ display: 'none' }} />
      </CardContent>
    </Card>
  );
};

export default ArticleAudioPlayer;
