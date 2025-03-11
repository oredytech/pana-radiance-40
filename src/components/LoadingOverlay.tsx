
import { useEffect, useState } from "react";
import { AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  onLoadComplete?: () => void;
}

const LoadingOverlay = ({ onLoadComplete }: LoadingOverlayProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [audioLines, setAudioLines] = useState<number[]>([]);

  useEffect(() => {
    // Generate random heights for audio spectrum lines
    const generateAudioSpectrum = () => {
      return Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
    };

    // Update spectrum animation
    const animationInterval = setInterval(() => {
      setAudioLines(generateAudioSpectrum());
    }, 150);

    // Hide overlay after everything is loaded
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onLoadComplete) onLoadComplete();
    }, 3000);

    // Initial generation
    setAudioLines(generateAudioSpectrum());

    return () => {
      clearInterval(animationInterval);
      clearTimeout(timer);
    };
  }, [onLoadComplete]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500",
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="w-48 h-48 mb-8 relative animate-pulse">
          <img 
            src="/lovable-uploads/cb273fa4-08f7-4b02-aa9c-1d04fafad2e7.png" 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Audio spectrum visualization */}
        <div className="flex items-end h-20 gap-1 mb-4">
          {audioLines.map((height, index) => (
            <div
              key={index}
              className="w-2 bg-pana-red rounded-t transition-all duration-150"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-pana-red">
          <AudioLines className="animate-pulse" />
          <span>Chargement en cours...</span>
          <AudioLines className="animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
