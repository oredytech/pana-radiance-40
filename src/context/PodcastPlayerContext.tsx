
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PodcastEpisode } from "@/utils/rssFetcher";
import { useToast } from "@/components/ui/use-toast";

interface PodcastPlayerContextType {
  currentPodcast: PodcastEpisode | null;
  isPlaying: boolean;
  playPodcast: (podcast: PodcastEpisode) => void;
  pausePodcast: () => void;
  togglePlayPause: () => void;
  stopPodcast: () => void;
}

const PodcastPlayerContext = createContext<PodcastPlayerContextType | undefined>(undefined);

export const usePodcastPlayer = () => {
  const context = useContext(PodcastPlayerContext);
  if (!context) {
    throw new Error("usePodcastPlayer must be used within a PodcastPlayerProvider");
  }
  return context;
};

export const PodcastPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentPodcast, setCurrentPodcast] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const playPodcast = (podcast: PodcastEpisode) => {
    if (!podcast.audioUrl) {
      toast({
        title: "Erreur",
        description: "Aucune URL audio disponible pour ce podcast",
        variant: "destructive",
      });
      return;
    }

    // Si la radio est en cours de lecture, arrêtez-la d'abord
    if (!window.globalAudio.paused) {
      window.globalAudio.pause();
      window.isGlobalPlaying = false;
    }

    // Changez la source de l'audio global pour le podcast
    const previousUrl = window.globalAudio.src;
    
    // Si c'est le même podcast mais il était pausé, reprenez la lecture
    if (window.globalAudio.src === podcast.audioUrl && currentPodcast?.id === podcast.id) {
      window.globalAudio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Erreur lors de la lecture du podcast:", error);
          toast({
            title: "Erreur de lecture",
            description: "Impossible de lire ce podcast. Veuillez réessayer.",
            variant: "destructive",
          });
        });
    } else {
      // Nouveau podcast ou podcast différent
      window.globalAudio.src = podcast.audioUrl;
      window.globalAudio.play()
        .then(() => {
          setCurrentPodcast(podcast);
          setIsPlaying(true);
          toast({
            title: "Lecture en cours",
            description: podcast.title,
          });
        })
        .catch((error) => {
          // En cas d'erreur, revenir à l'URL précédente si c'était la radio
          console.error("Erreur lors de la lecture du podcast:", error);
          window.globalAudio.src = previousUrl;
          toast({
            title: "Erreur de lecture",
            description: "Impossible de lire ce podcast. Veuillez réessayer.",
            variant: "destructive",
          });
        });
    }
  };

  const pausePodcast = () => {
    if (!window.globalAudio.paused && currentPodcast) {
      window.globalAudio.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!currentPodcast) return;
    
    if (isPlaying) {
      pausePodcast();
    } else {
      playPodcast(currentPodcast);
    }
  };

  const stopPodcast = () => {
    // Arrêtez le podcast et revenez à la radio
    if (currentPodcast) {
      window.globalAudio.src = "https://stream.zeno.fm/dnw3x5tqpc9uv";
      setCurrentPodcast(null);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Sync with global audio
    const handlePlayPause = () => {
      if (currentPodcast) {
        setIsPlaying(!window.globalAudio.paused);
      }
    };
    
    const handleEnded = () => {
      if (currentPodcast) {
        setIsPlaying(false);
        setCurrentPodcast(null);
        // Revenez à la radio après la fin du podcast
        window.globalAudio.src = "https://stream.zeno.fm/dnw3x5tqpc9uv";
      }
    };
    
    window.globalAudio.addEventListener('play', handlePlayPause);
    window.globalAudio.addEventListener('pause', handlePlayPause);
    window.globalAudio.addEventListener('ended', handleEnded);
    
    return () => {
      window.globalAudio.removeEventListener('play', handlePlayPause);
      window.globalAudio.removeEventListener('pause', handlePlayPause);
      window.globalAudio.removeEventListener('ended', handleEnded);
    };
  }, [currentPodcast]);

  return (
    <PodcastPlayerContext.Provider
      value={{
        currentPodcast,
        isPlaying,
        playPodcast,
        pausePodcast,
        togglePlayPause,
        stopPodcast
      }}
    >
      {children}
    </PodcastPlayerContext.Provider>
  );
};
