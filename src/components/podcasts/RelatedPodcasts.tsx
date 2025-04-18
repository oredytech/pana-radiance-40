
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { type PodcastEpisode } from "@/utils/rssFetcher";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";

interface RelatedPodcastsProps {
  episodes: PodcastEpisode[];
}

const RelatedPodcasts = ({ episodes }: RelatedPodcastsProps) => {
  const { playPodcast } = usePodcastPlayer();

  if (episodes.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Épisodes similaires</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {episodes.map((episode) => (
          <Card key={episode.id} className="hover:shadow-lg transition-shadow">
            <Link to={`/podcast/${episode.id}`}>
              <CardContent className="p-4">
                <div 
                  className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                  style={episode.imageUrl ? { backgroundImage: `url(${episode.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-12 w-12 relative z-10 bg-white bg-opacity-70 hover:bg-white hover:bg-opacity-90"
                    onClick={(e) => {
                      e.preventDefault();
                      playPodcast(episode);
                    }}
                  >
                    <Play className="h-8 w-8 text-pana-red" />
                  </Button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {episode.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{episode.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{episode.duration}</span>
                  <span>{episode.date}</span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedPodcasts;
