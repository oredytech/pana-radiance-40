
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const useContentUpdater = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
  }, [queryClient, toast]);

  return { applyUpdates };
};
