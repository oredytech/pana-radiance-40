
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";
import { Button } from "@/components/ui/button";
import { Play, Pause, X } from "lucide-react";

const PodcastPlayer = () => {
  const { currentPodcast, isPlaying, togglePlayPause, stopPodcast } = usePodcastPlayer();

  if (!currentPodcast) return null;

  return (
    <div className="fixed bottom-[70px] left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded overflow-hidden">
            {currentPodcast.imageUrl && (
              <img 
                src={currentPodcast.imageUrl} 
                alt={currentPodcast.title} 
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{currentPodcast.title}</p>
            <p className="text-xs text-gray-500">Podcast en cours</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={stopPodcast}
            title="Arrêter le podcast"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;
