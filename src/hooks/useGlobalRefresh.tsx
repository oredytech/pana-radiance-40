
import { useCallback } from 'react';
import { useRefreshState } from './useRefreshState';
import { useContentUpdater } from './useContentUpdater';
import { refreshPostsInBackground } from '@/services/wordpress';

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
      await refreshPostsInBackground((newPosts) => {
        console.log('New posts loaded:', newPosts.length);
        markContentAsNew();
      }, 50);
      
    } catch (error) {
      console.warn('Error during refresh:', error);
    } finally {
      stopRefreshing();
    }
  }, [isRefreshing, startRefreshing, stopRefreshing, markContentAsNew]);

  const applyUpdates = useCallback(() => {
    baseApplyUpdates();
    clearNewContent();
  }, [baseApplyUpdates, clearNewContent]);

  return {
    isRefreshing,
    hasNewContent,
    startRefresh,
    applyUpdates
  };
};
