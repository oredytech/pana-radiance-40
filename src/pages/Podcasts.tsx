import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchRssFeed, type PodcastEpisode } from "@/utils/rssFetcher";
import { useToast } from "@/components/ui/use-toast";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";

const PODCAST_RSS_URL = "https://podcast.zenomedia.com/api/public/podcasts/dccffad2-6a72-41f0-b115-499b7a4bf255/rss";

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { playPodcast } = usePodcastPlayer();

  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        const episodes = await fetchRssFeed(PODCAST_RSS_URL);
        if (episodes.length > 0) {
          setPodcasts(episodes);
        } else {
          throw new Error("No podcasts found");
        }
      } catch (error) {
        console.error("Failed to fetch podcast RSS feed:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les podcasts",
          variant: "destructive",
        });
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nos Podcasts</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={`loading-${index}`} className="animate-pulse">
                <CardContent className="p-6">
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
        ) : podcasts.length === 0 ? (
          <div className="text-center py-12">
            <p>Aucun podcast disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcasts.map((podcast) => (
              <Card key={podcast.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {podcast.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{podcast.description}</p>
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
      <Footer />
    </div>
  );
};

export default Podcasts;
