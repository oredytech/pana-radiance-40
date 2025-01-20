import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Podcasts = () => {
  const podcasts = [
    {
      title: "Culture et Traditions",
      description: "Découvrez les richesses culturelles de l'Afrique",
      duration: "45 min",
      date: "15 Feb 2024",
    },
    {
      title: "Musique Africaine",
      description: "Un voyage à travers les rythmes du continent",
      duration: "30 min",
      date: "14 Feb 2024",
    },
    {
      title: "Actualités Panafricaines",
      description: "Les dernières nouvelles du continent",
      duration: "60 min",
      date: "13 Feb 2024",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nos Podcasts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Button variant="ghost" size="icon" className="h-12 w-12">
                    <Play className="h-8 w-8" />
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
      </div>
    </div>
  );
};

export default Podcasts;