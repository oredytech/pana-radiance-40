
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import HeroLoadingIndicator from "./HeroLoadingIndicator";

interface LoadingOverlayProps {
  onLoadComplete?: () => void;
}

const LoadingOverlay = ({ onLoadComplete }: LoadingOverlayProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide overlay after everything is loaded
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onLoadComplete) onLoadComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onLoadComplete]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500",
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <HeroLoadingIndicator />
    </div>
  );
};

export default LoadingOverlay;
