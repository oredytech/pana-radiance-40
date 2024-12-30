import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

const RadioPlayer = () => {
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
      <audio
        ref={audioRef}
        src="https://stream.zeno.fm/dnw3x5tqpc9uv"
        preload="none"
      />
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