
// Cache en mémoire amélioré avec invalidation intelligente
const cache = new Map();
const CACHE_DURATION = 1 * 60 * 1000; // 5 minutes pour les articles récents
const LONG_CACHE_DURATION = 5 * 60 * 1000; // 30 minutes pour les catégories (changent moins souvent)

export const getCacheKey = (url: string) => url;

export const setCache = (key: string, data: any, duration = CACHE_DURATION) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    duration
  });
};

export const getCache = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.duration) {
    return cached.data;
  }
  if (cached) {
    cache.delete(key);
  }
  return null;
};

// Fonction pour vider le cache des articles récents (utile pour forcer une mise à jour)
export const invalidateRecentPostsCache = () => {
  const keysToDelete = [];
  for (const [key] of cache) {
    if (key.includes('recent-posts') || key.includes('all-posts') || key.includes('posts')) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => cache.delete(key));
};

export { CACHE_DURATION, LONG_CACHE_DURATION };
