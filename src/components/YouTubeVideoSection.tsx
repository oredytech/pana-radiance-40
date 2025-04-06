
import React from "react";
import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const YouTubeSubscriptionCTA = () => {
  const handleSubscribe = () => {
    window.open("https://www.youtube.com/@PanaRadio-qr4dv", "_blank");
  };

  return (
    <div className="py-8">
      <Card className="bg-gradient-to-r from-red-600 to-red-700 border-none shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="bg-white p-4 rounded-full">
                <Youtube className="h-12 w-12 text-red-600" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Abonnez-vous à notre chaîne YouTube
                </h2>
                <p className="text-white/90 text-base md:text-lg">
                  Découvrez nos analyses vidéo, interviews exclusives et contenus sportifs
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSubscribe}
              className="bg-white text-red-600 hover:bg-gray-100 transition-colors px-6 py-6 text-lg font-semibold"
            >
              <Youtube className="h-5 w-5 mr-2" />
              S'abonner maintenant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeSubscriptionCTA;
