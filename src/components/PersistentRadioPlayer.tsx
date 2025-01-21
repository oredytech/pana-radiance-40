import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

const PersistentRadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([50]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

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
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const updatePlayingState = () => setIsPlaying(!audio.paused);
      
      audio.addEventListener('play', updatePlayingState);
      audio.addEventListener('pause', updatePlayingState);

      return () => {
        audio.removeEventListener('play', updatePlayingState);
        audio.removeEventListener('pause', updatePlayingState);
      };
    }
  }, []);

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
      <audio
        ref={audioRef}
        src="https://stream.zeno.fm/dnw3x5tqpc9uv"
        preload="none"
      />
    </div>
  );
};

export default PersistentRadioPlayer;