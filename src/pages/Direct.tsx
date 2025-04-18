
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/LoadingCircle";
import Footer from "@/components/Footer";

const Direct = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(window.isGlobalPlaying || false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayPause = () => {
    setIsLoading(true);
    if (isPlaying) {
      window.globalAudio.pause();
    } else {
      window.globalAudio.play()
        .then(() => {
          window.isGlobalPlaying = true;
        })
        .catch((error) => {
          toast({
            title: "Erreur de lecture",
            description: "Impossible de lancer la radio. Veuillez réessayer.",
            variant: "destructive",
          });
          console.error("Playback error:", error);
        });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsPlaying(!window.globalAudio.paused);
    
    const updatePlayingState = () => setIsPlaying(!window.globalAudio.paused);
    
    window.globalAudio.addEventListener('play', updatePlayingState);
    window.globalAudio.addEventListener('pause', updatePlayingState);
    window.globalAudio.addEventListener('waiting', () => setIsLoading(true));
    window.globalAudio.addEventListener('playing', () => setIsLoading(false));
    window.globalAudio.addEventListener('pause', () => setIsLoading(false));
    window.globalAudio.addEventListener('error', () => setIsLoading(false));

    return () => {
      window.globalAudio.removeEventListener('play', updatePlayingState);
      window.globalAudio.removeEventListener('pause', updatePlayingState);
      window.globalAudio.removeEventListener('waiting', () => setIsLoading(true));
      window.globalAudio.removeEventListener('playing', () => setIsLoading(false));
      window.globalAudio.removeEventListener('pause', () => setIsLoading(false));
      window.globalAudio.removeEventListener('error', () => setIsLoading(false));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20 flex-grow">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 bg-white border shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-full md:w-1/3 aspect-square bg-pana-red rounded-lg relative overflow-hidden">
                  <img 
                    src="/lovable-uploads/cb273fa4-08f7-4b02-aa9c-1d04fafad2e7.png" 
                    alt="PANA Radio Logo" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <LoadingCircle size={48} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1 bg-pana-red text-white text-sm font-medium rounded mb-4">
                    EN DIRECT {isPlaying && "• EN COURS"}
                  </div>
                  <h1 className="text-3xl font-bold mb-4">PANA RADIO en direct</h1>
                  <p className="text-gray-600 mb-4">
                    Suivez toute l'information avec PANA RADIO en direct. Retrouvez notre grille des programmes et écoutez nos derniers journaux chaque demi-heure.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={handlePlayPause}
                      className="bg-white hover:bg-gray-200 text-black flex items-center justify-center gap-2 border-2 border-pana-red"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                      {isPlaying ? "Pause" : "Écouter le direct"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-pana-red hover:bg-pana-red/90 text-white border-none"
                    >
                      Découvrez nos podcasts
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-gray-900 mb-4">À venir</h2>
                <ul className="space-y-4">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Journal Panafricain</span>
                    <span className="text-gray-500">14:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Culture et Traditions</span>
                    <span className="text-gray-500">15:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Musique Live</span>
                    <span className="text-gray-500">16:00</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Dernières actualités</h2>
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-pana-red">
                      Les dernières tendances musicales en Afrique
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-pana-red">
                      Interview exclusive avec un artiste local
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-pana-red">
                      Découverte des traditions ancestrales
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Direct;
