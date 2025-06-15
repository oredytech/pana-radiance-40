
import { Play, Pause, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";
import { useIsMobile } from "@/hooks/use-mobile";
import LanguageSelector from "./LanguageSelector";
import RefreshButton from "./RefreshButton";

const HeaderActions = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { currentPodcast, stopPodcast } = usePodcastPlayer();

  const handleDirectClick = () => {
    if (currentPodcast) {
      stopPodcast();
    }
    if (window.globalAudio) {
      if (window.globalAudio.paused) {
        window.globalAudio.play().catch(error => {
          console.error("Playback error:", error);
        });
      } else {
        window.globalAudio.pause();
      }
    }
    navigate('/direct');
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  const isPlaying = window.globalAudio ? !window.globalAudio.paused : false;

  return (
    <div className="flex items-center gap-2">
      <LanguageSelector />
      <RefreshButton />
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleSearchClick}
        className="hover:text-pana-red"
        aria-label="Rechercher"
      >
        <Search className="h-5 w-5" />
      </Button>
      <Button 
        onClick={handleDirectClick} 
        className="bg-pana-red hover:bg-pana-purple transition-colors animate-pulse"
        size={isMobile ? "icon" : "default"}
        aria-label={isMobile ? (isPlaying ? "Pause" : "Play") : undefined}
      >
        {isMobile ? (
          isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />
        ) : (
          <>
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            EN DIRECT {isPlaying && "• EN COURS"}
          </>
        )}
      </Button>
    </div>
  );
};

export default HeaderActions;
