
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchRssFeed, type PodcastEpisode } from "@/utils/rssFetcher";
import { useToast } from "@/components/ui/use-toast";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";

const PODCAST_RSS_URL = "https://podcast.zenomedia.com/api/public/podcasts/dccffad2-6a72-41f0-b115-499b7a4bf255/rss";

// Fallback podcasts in case the RSS feed fails
const FALLBACK_PODCASTS = [
  {
    id: "podcast1",
    title: "Culture et Traditions",
    description: "Découvrez les richesses culturelles de l'Afrique",
    duration: "45 min",
    date: "15 Feb 2024",
    audioUrl: "",
  },
  {
    id: "podcast2",
    title: "Musique Africaine",
    description: "Un voyage à travers les rythmes du continent",
    duration: "30 min",
    date: "14 Feb 2024",
    audioUrl: "",
  },
  {
    id: "podcast3",
    title: "Actualités Panafricaines",
    description: "Les dernières nouvelles du continent",
    duration: "60 min",
    date: "13 Feb 2024",
    audioUrl: "",
  },
  {
    id: "podcast4",
    title: "Économie et Développement",
    description: "Analyse des tendances économiques africaines",
    duration: "40 min",
    date: "12 Feb 2024",
    audioUrl: "",
  }
];

const PodcastSection = () => {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { playPodcast } = usePodcastPlayer();

  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        const episodes = await fetchRssFeed(PODCAST_RSS_URL);
        if (episodes.length > 0) {
          setPodcasts(episodes.slice(0, 4)); // Only take the first 4 episodes
        } else {
          setPodcasts(FALLBACK_PODCASTS);
        }
      } catch (error) {
        console.error("Failed to fetch podcast RSS feed:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les podcasts",
          variant: "destructive",
        });
        setPodcasts(FALLBACK_PODCASTS);
      } finally {
        setIsLoading(false);
      }
    };

    loadPodcasts();
  }, [toast]);

  const handlePlayPodcast = (podcast: PodcastEpisode) => {
    if (podcast.audioUrl) {
      playPodcast(podcast);
    }
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Nos derniers podcasts
          </h2>
          <p className="text-gray-600 mt-2">Écoutez nos émissions où que vous soyez</p>
        </div>
        <Link to="/podcasts">
          <Button 
            variant="outline" 
            className="border-pana-red text-pana-red hover:bg-pana-red hover:text-white"
          >
            Tous les podcasts
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[200px]">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={`loading-${index}`} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-4" />
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {podcasts.map((podcast) => (
            <Card key={podcast.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div 
                  className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                  style={podcast.imageUrl ? { backgroundImage: `url(${podcast.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-12 w-12 relative z-10 bg-white bg-opacity-70 hover:bg-white hover:bg-opacity-90"
                    onClick={() => handlePlayPodcast(podcast)}
                  >
                    <Play className="h-8 w-8 text-pana-red" />
                  </Button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {podcast.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{podcast.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{podcast.duration}</span>
                  <span>{podcast.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PodcastSection;
