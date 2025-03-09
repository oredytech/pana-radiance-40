
import React from "react";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const VIDEOS = [
  {
    id: "video1",
    thumbnail: "/placeholder.svg",
    title: "Actualités sportives du jour",
    duration: "10:25",
    views: "2.3K",
    date: "Il y a 2 jours"
  },
  {
    id: "video2",
    thumbnail: "/placeholder.svg",
    title: "Interview exclusive avec Elisha Sadiki",
    duration: "15:42",
    views: "1.8K",
    date: "Il y a 3 jours"
  },
  {
    id: "video3",
    thumbnail: "/placeholder.svg",
    title: "Résumé du match TP Mazembe vs Bazano",
    duration: "8:15",
    views: "5.4K",
    date: "Il y a 1 semaine"
  },
  {
    id: "video4",
    thumbnail: "/placeholder.svg",
    title: "Analyse tactique: les forces et faiblesses",
    duration: "12:37",
    views: "3.1K",
    date: "Il y a 1 semaine"
  }
];

const YouTubeVideoSection = () => {
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Nos dernières vidéos
          </h2>
          <p className="text-gray-600 mt-2">Retrouvez toutes nos analyses et interviews en vidéo</p>
        </div>
        <Button 
          variant="outline" 
          className="border-pana-red text-pana-red hover:bg-pana-red hover:text-white"
        >
          Voir toutes les vidéos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {VIDEOS.map((video) => (
          <div key={video.id} className="group overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all">
            <div className="relative">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle size={48} className="text-white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-pana-red transition-colors">
                {video.title}
              </h3>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                <span>{video.views} vues</span>
                <span>{video.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeVideoSection;
