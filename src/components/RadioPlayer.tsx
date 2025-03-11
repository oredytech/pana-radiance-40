
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

// On utilise les variables globales
const globalAudio = window.globalAudio;

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([50]);
  const audioRef = useRef<HTMLAudioElement | null>(globalAudio || null);
  const { toast } = useToast();
  
  // Synchronisation avec l'audio global
  useEffect(() => {
    if (globalAudio) {
      audioRef.current = globalAudio;
      setIsPlaying(!globalAudio.paused);
      setIsMuted(globalAudio.muted);
      setVolume([globalAudio.volume * 100]);
      
      const updatePlayingState = () => {
        setIsPlaying(!globalAudio.paused);
      };
      
      globalAudio.addEventListener('play', updatePlayingState);
      globalAudio.addEventListener('pause', updatePlayingState);
      
      return () => {
        globalAudio.removeEventListener('play', updatePlayingState);
        globalAudio.removeEventListener('pause', updatePlayingState);
      };
    } else if (!audioRef.current) {
      // Crée une instance locale uniquement si globalAudio n'existe pas encore
      audioRef.current = new Audio("https://stream.zeno.fm/dnw3x5tqpc9uv");
      audioRef.current.preload = "none";
      audioRef.current.volume = volume[0] / 100;
      window.globalAudio = audioRef.current;
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((error) => {
            toast({
              title: "Erreur de lecture",
              description: "Impossible de lancer la radio. Veuillez réessayer.",
              variant: "destructive",
            });
            console.error("Playback error:", error);
          });
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume([newVolume]);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">En Direct</h2>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="hover:text-pana-red"
          >
            {isMuted ? (
              <VolumeX className="h-6 w-6" />
            ) : (
              <Volume2 className="h-6 w-6" />
            )}
          </Button>
          <div className="w-32">
            <Slider
              value={volume}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>
      <Button
        onClick={togglePlay}
        className="w-full bg-pana-red hover:bg-pana-purple transition-colors duration-200"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6 mr-2" />
        ) : (
          <Play className="h-6 w-6 mr-2" />
        )}
        {isPlaying ? "Pause" : "Écouter"}
      </Button>
    </div>
  );
};

export default RadioPlayer;
