
import { useState, useCallback } from 'react';

export const useRefreshState = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNewContent, setHasNewContent] = useState(false);

  const startRefreshing = useCallback(() => {
    setIsRefreshing(true);
    setHasNewContent(false);
  }, []);

  const stopRefreshing = useCallback(() => {
    setIsRefreshing(false);
  }, []);

  const markContentAsNew = useCallback(() => {
    setHasNewContent(true);
  }, []);

  const clearNewContent = useCallback(() => {
    setHasNewContent(false);
  }, []);

  return {
    isRefreshing,
    hasNewContent,
    startRefreshing,
    stopRefreshing,
    markContentAsNew,
    clearNewContent
  };
};
