
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { invalidateRecentPostsCache } from "@/services/wordpress";

const RefreshButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    
    try {
      // Effacer tous les caches
      invalidateRecentPostsCache();
      await queryClient.clear();
      
      // Recharger la page après un court délai
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
      setIsRefreshing(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleRefreshClick}
      disabled={isRefreshing}
      className="hover:text-pana-red"
      aria-label="Rafraîchir le site"
    >
      <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
    </Button>
  );
};

export default RefreshButton;
