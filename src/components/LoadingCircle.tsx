
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingCircleProps {
  className?: string;
  size?: number;
}

const LoadingCircle = ({ className, size = 24 }: LoadingCircleProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Cercle de fond */}
        <div 
          className={cn("rounded-full border-4 border-gray-200", className)}
          style={{ width: size, height: size }}
        />
        {/* Cercle animé qui tourne */}
        <div 
          className={cn(
            "absolute top-0 left-0 rounded-full border-4 border-transparent border-t-current animate-spin",
            className
          )}
          style={{ width: size, height: size }}
        />
      </div>
    </div>
  );
};

export default LoadingCircle;
