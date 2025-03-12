
import { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

const PersistentRadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(window.isGlobalPlaying || false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([window.globalAudio?.volume * 100 || 50]);
  const { toast } = useToast();

  // Synchronisation avec l'audio global
  useEffect(() => {
    // Mettre à jour l'état local depuis l'état global
    setIsPlaying(!window.globalAudio.paused);
    setIsMuted(window.globalAudio.muted);
    setVolume([window.globalAudio.volume * 100]);
    
    const updatePlayingState = () => {
      setIsPlaying(!window.globalAudio.paused);
      window.isGlobalPlaying = !window.globalAudio.paused;
    };
    
    const updateVolume = () => {
      setVolume([window.globalAudio.volume * 100]);
    };
    
    window.globalAudio.addEventListener('play', updatePlayingState);
    window.globalAudio.addEventListener('pause', updatePlayingState);
    window.globalAudio.addEventListener('volumechange', updateVolume);
    
    return () => {
      window.globalAudio.removeEventListener('play', updatePlayingState);
      window.globalAudio.removeEventListener('pause', updatePlayingState);
      window.globalAudio.removeEventListener('volumechange', updateVolume);
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="hover:text-pana-purple"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <div className="text-sm font-medium">
              <div className="text-gray-900">PANA RADIO</div>
              <div className="text-gray-500 text-xs">En direct {isPlaying && "• EN COURS"}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="hover:text-pana-purple"
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
      </div>
    </div>
  );
};

export default PersistentRadioPlayer;
