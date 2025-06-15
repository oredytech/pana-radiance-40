
import { useCallback } from 'react';
import { useRefreshState } from './useRefreshState';
import { useContentUpdater } from './useContentUpdater';
import { useAutoRefresh } from './useAutoRefresh';
import { performBackgroundRefresh } from '@/utils/refreshUtils';

export const useGlobalRefresh = () => {
  const {
    isRefreshing,
    hasNewContent,
    startRefreshing,
    stopRefreshing,
    markContentAsNew,
    clearNewContent
  } = useRefreshState();

  const { applyUpdates: baseApplyUpdates } = useContentUpdater();

  const startRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    startRefreshing();

    try {
      await performBackgroundRefresh((newPosts) => {
        console.log('Nouveaux articles chargés:', newPosts.length);
        markContentAsNew();
      }, 50); // Charger plus d'articles pour s'assurer d'avoir du nouveau contenu
      
    } catch (error) {
      console.warn('Erreur lors du rafraîchissement:', error);
    } finally {
      stopRefreshing();
    }
  }, [isRefreshing, startRefreshing, stopRefreshing, markContentAsNew]);

  const applyUpdates = useCallback(() => {
    baseApplyUpdates();
    clearNewContent();
  }, [baseApplyUpdates, clearNewContent]);

  // Démarrer automatiquement le rafraîchissement toutes les 10 minutes
  useAutoRefresh(startRefresh, 10 * 60 * 1000);

  return {
    isRefreshing,
    hasNewContent,
    startRefresh,
    applyUpdates
  };
};
