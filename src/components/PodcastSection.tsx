
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PODCASTS = [
  {
    id: "podcast1",
    title: "Culture et Traditions",
    description: "Découvrez les richesses culturelles de l'Afrique",
    duration: "45 min",
    date: "15 Feb 2024",
  },
  {
    id: "podcast2",
    title: "Musique Africaine",
    description: "Un voyage à travers les rythmes du continent",
    duration: "30 min",
    date: "14 Feb 2024",
  },
  {
    id: "podcast3",
    title: "Actualités Panafricaines",
    description: "Les dernières nouvelles du continent",
    duration: "60 min",
    date: "13 Feb 2024",
  },
  {
    id: "podcast4",
    title: "Économie et Développement",
    description: "Analyse des tendances économiques africaines",
    duration: "40 min",
    date: "12 Feb 2024",
  }
];

const PodcastSection = () => {
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Nos derniers podcasts
          </h2>
          <p className="text-gray-600 mt-2">Écoutez nos émissions où que vous soyez</p>
        </div>
        <Button 
          variant="outline" 
          className="border-pana-red text-pana-red hover:bg-pana-red hover:text-white"
          as={Link}
          to="/podcasts"
        >
          Tous les podcasts
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PODCASTS.map((podcast) => (
          <Card key={podcast.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <Button variant="ghost" size="icon" className="h-12 w-12">
                  <Play className="h-8 w-8" />
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
    </div>
  );
};

export default PodcastSection;
