
import React from "react";
import { Button } from "@/components/ui/button";

const AdvertisementSection = () => {
  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-r from-pana-purple to-purple-500 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Annoncez avec nous</h2>
          <p className="text-lg opacity-90">
            Touchez une audience engagée et passionnée. Nos solutions publicitaires
            vous permettent d'atteindre efficacement votre cible.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button 
              size="lg" 
              className="bg-white text-pana-purple hover:bg-gray-100 hover:text-pana-purple transition-colors"
            >
              Demander un devis
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-pana-purple transition-colors"
            >
              En savoir plus
            </Button>
          </div>
        </div>
        <div className="relative h-64 md:h-auto overflow-hidden rounded-lg">
          <div className="w-full h-full bg-[url('/placeholder.svg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="bg-white bg-opacity-90 p-6 rounded-lg max-w-xs mx-auto text-center">
                <span className="block text-pana-purple font-bold text-xl mb-2">Publicité</span>
                <span className="block text-gray-800 font-medium">Votre message ici</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-purple-800 p-4 text-center text-sm opacity-90">
        Des offres spéciales sont disponibles pour les partenaires de longue durée. Contactez notre équipe commerciale.
      </div>
    </div>
  );
};

export default AdvertisementSection;
