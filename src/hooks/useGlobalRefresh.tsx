
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { refreshPostsInBackground, invalidateRecentPostsCache } from '@/services/wordpress';
import { useToast } from '@/hooks/use-toast';

export const useGlobalRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNewContent, setHasNewContent] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const startRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setHasNewContent(false);

    try {
      // Invalider le cache existant
      invalidateRecentPostsCache();
      
      // Charger les nouveaux articles en arrière-plan
      await refreshPostsInBackground((newPosts) => {
        console.log('Nouveaux articles chargés:', newPosts.length);
        setHasNewContent(true);
      }, 50); // Charger plus d'articles pour s'assurer d'avoir du nouveau contenu
      
    } catch (error) {
      console.warn('Erreur lors du rafraîchissement:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  const applyUpdates = useCallback(() => {
    // Invalider toutes les requêtes liées aux articles pour forcer un rechargement
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    queryClient.invalidateQueries({ queryKey: ['recent-posts'] });
    
    // Afficher une notification de succès
    toast({
      title: "Articles mis à jour",
      description: "Le contenu a été actualisé avec les derniers articles.",
      duration: 3000,
    });
    
    setHasNewContent(false);
  }, [queryClient, toast]);

  // Démarrer automatiquement le rafraîchissement toutes les 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      startRefresh();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [startRefresh]);

  return {
    isRefreshing,
    hasNewContent,
    startRefresh,
    applyUpdates
  };
};
