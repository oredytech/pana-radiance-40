
import { useEffect } from 'react';

export const useAutoRefresh = (refreshCallback: () => void, intervalMs = 1 * 60 * 1000) => {
  useEffect(() => {
    const interval = setInterval(() => {
      refreshCallback();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [refreshCallback, intervalMs]);
};
