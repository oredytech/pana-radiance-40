
import { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(window.isGlobalPlaying || false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([window.globalAudio?.volume * 100 || 50]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Synchronisation avec l'audio global
  useEffect(() => {
    // Mettre à jour l'état local depuis l'état global
    setIsPlaying(!window.globalAudio.paused);
    setIsMuted(window.globalAudio.muted);
    setVolume([window.globalAudio.volume * 100]);
    
    const updatePlayingState = () => {
      setIsPlaying(!window.globalAudio.paused);
    };
    
    const updateVolume = () => {
      setVolume([window.globalAudio.volume * 100]);
    };
    
    window.globalAudio.addEventListener('play', updatePlayingState);
    window.globalAudio.addEventListener('pause', updatePlayingState);
    window.globalAudio.addEventListener('volumechange', updateVolume);
    window.globalAudio.addEventListener('waiting', () => setIsLoading(true));
    window.globalAudio.addEventListener('playing', () => setIsLoading(false));
    window.globalAudio.addEventListener('pause', () => setIsLoading(false));
    window.globalAudio.addEventListener('error', () => setIsLoading(false));
    
    return () => {
      window.globalAudio.removeEventListener('play', updatePlayingState);
      window.globalAudio.removeEventListener('pause', updatePlayingState);
      window.globalAudio.removeEventListener('volumechange', updateVolume);
      window.globalAudio.removeEventListener('waiting', () => setIsLoading(true));
      window.globalAudio.removeEventListener('playing', () => setIsLoading(false));
      window.globalAudio.removeEventListener('pause', () => setIsLoading(false));
      window.globalAudio.removeEventListener('error', () => setIsLoading(false));
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      window.globalAudio.pause();
    } else {
      window.globalAudio
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
  };

  const toggleMute = () => {
    window.globalAudio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume([newVolume]);
    window.globalAudio.volume = newVolume / 100;
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
        {isLoading ? (
          <Loader2 className="h-6 w-6 mr-2 animate-spin" />
        ) : isPlaying ? (
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
