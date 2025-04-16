
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingCircleProps {
  className?: string;
  size?: number;
}

const LoadingCircle = ({ className, size = 24 }: LoadingCircleProps) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={cn("animate-spin text-white", className)} size={size} />
    </div>
  );
};

export default LoadingCircle;
