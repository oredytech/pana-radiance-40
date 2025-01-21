import { useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Volume2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Direct = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Lancer automatiquement la radio quand la page est chargée
    const audio = document.querySelector('audio');
    if (audio) {
      audio.play().catch((error) => {
        toast({
          title: "Erreur de lecture",
          description: "Impossible de lancer la radio. Veuillez réessayer.",
          variant: "destructive",
        });
        console.error("Playback error:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-24 h-24 bg-pana-red rounded-lg flex items-center justify-center">
                  <Volume2 className="h-12 w-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">PANA RADIO EN DIRECT</h1>
                  <p className="text-gray-600">Votre radio panafricaine</p>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="font-semibold text-gray-900 mb-2">En ce moment sur PANA RADIO</h2>
                <p className="text-gray-600">Musique et Culture Africaine</p>
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
    </div>
  );
};

export default Direct;