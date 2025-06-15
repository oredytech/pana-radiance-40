
import React from 'react';

const HeroLoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
      <div className="relative">
        {/* Logo carré */}
        <div className="w-32 h-32 relative z-10">
          <img 
            src="/lovable-uploads/cb273fa4-08f7-4b02-aa9c-1d04fafad2e7.png" 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Indicateur de chargement qui circule en carré autour du logo */}
        <div className="absolute inset-0 w-32 h-32 pointer-events-none">
          <div className="absolute w-full h-full">
            {/* Point qui circule en carré */}
            <div className="absolute w-3 h-3 bg-pana-red rounded-full animate-square-path z-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroLoadingIndicator;
