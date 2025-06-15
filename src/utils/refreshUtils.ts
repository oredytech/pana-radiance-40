
import { invalidateRecentPostsCache, refreshPostsInBackground } from '@/services/wordpress';

export const performBackgroundRefresh = async (
  onNewContent: (newPosts: any[]) => void,
  postsToLoad = 50
): Promise<void> => {
  try {
    // Invalider le cache existant
    invalidateRecentPostsCache();
    
    // Charger les nouveaux articles en arrière-plan
    await refreshPostsInBackground(onNewContent, postsToLoad);
  } catch (error) {
    console.warn('Erreur lors du rafraîchissement:', error);
    throw error;
  }
};
