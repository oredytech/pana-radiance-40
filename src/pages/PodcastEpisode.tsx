
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchRssFeed, type PodcastEpisode } from "@/utils/rssFetcher";
import { useToast } from "@/components/ui/use-toast";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RelatedPodcasts from "@/components/podcasts/RelatedPodcasts";
import { Button } from "@/components/ui/button";
import { PlayCircle, Calendar, Clock, ChevronLeft } from "lucide-react";

const PODCAST_RSS_URL = "https://podcast.zenomedia.com/api/public/podcasts/dccffad2-6a72-41f0-b115-499b7a4bf255/rss";

const PodcastEpisodePage = () => {
  const { id } = useParams();
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [relatedEpisodes, setRelatedEpisodes] = useState<PodcastEpisode[]>([]);
  const { playPodcast } = usePodcastPlayer();
  const { toast } = useToast();

  useEffect(() => {
    const loadEpisode = async () => {
      try {
        const episodes = await fetchRssFeed(PODCAST_RSS_URL);
        const currentEpisode = episodes.find(ep => ep.id === id);
        if (currentEpisode) {
          setEpisode(currentEpisode);
          // Get 3 related episodes (excluding current)
          const related = episodes
            .filter(ep => ep.id !== id)
            .slice(0, 3);
          setRelatedEpisodes(related);
        } else {
          toast({
            title: "Erreur",
            description: "Épisode introuvable",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to fetch episode:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'épisode",
          variant: "destructive"
        });
      }
    };

    if (id) {
      loadEpisode();
    }
  }, [id, toast]);

  if (!episode) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pana-red"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-20">
        <Link to="/podcasts" className="inline-flex items-center text-gray-600 hover:text-pana-red mb-8">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour aux podcasts
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-64 md:h-96">
            {episode.imageUrl ? (
              <img 
                src={episode.imageUrl} 
                alt={episode.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Image non disponible</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {episode.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {episode.date}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {episode.duration}
              </div>
            </div>

            <Button
              onClick={() => playPodcast(episode)}
              size="lg"
              className="bg-pana-red hover:bg-pana-red/90 text-white mb-6"
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              Écouter l'épisode
            </Button>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">À propos de cet épisode</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {episode.description}
              </p>
            </div>
          </div>
        </div>

        <RelatedPodcasts episodes={relatedEpisodes} />
      </main>
      <Footer />
    </div>
  );
};

export default PodcastEpisodePage;
