
// 📁 src/utils/otSiteStats.tsx
import { useEffect, useState, useCallback } from "react";

// 🛠️ Ton domaine WordPress ici
const WORDPRESS_API_BASE = "https://panaradio.net/wp-json";

// Cache pour éviter les appels répétés
const postIdCache = new Map<string, number>();
const viewsCache = new Map<number, { views: number; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// 🔁 Récupérer le post ID depuis un slug avec cache
export const usePostIdFromSlug = (slug: string): number | null => {
  const [postId, setPostId] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;

    // Vérifier le cache d'abord
    if (postIdCache.has(slug)) {
      setPostId(postIdCache.get(slug)!);
      return;
    }

    const controller = new AbortController();
    
    fetch(`${WORDPRESS_API_BASE}/wp/v2/posts?slug=${slug}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const id = data[0].id;
          postIdCache.set(slug, id);
          setPostId(id);
        } else {
          console.warn("Aucun article trouvé pour le slug :", slug);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Erreur récupération ID par slug :", err);
        }
      });

    return () => controller.abort();
  }, [slug]);

  return postId;
};

// 🔁 Hook pour tracking différé
export const useTrackArticleView = (postId: number | null, delay: number = 1000) => {
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (!postId || hasTracked) return;

    const timer = setTimeout(() => {
      fetch(`${WORDPRESS_API_BASE}/otstats/v1/track`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Accept': 'application/json',
        },
        body: JSON.stringify({ post_id: postId }),
      })
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            console.warn("Tracking échoué :", data);
          }
          setHasTracked(true);
        })
        .catch(err => console.error("Erreur tracking :", err));
    }, delay);

    return () => clearTimeout(timer);
  }, [postId, delay, hasTracked]);
};

// 👁️ Hook pour charger les vues avec délai et cache
export const useArticleViews = (postId: number | null, delay: number = 2000): number | null => {
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadViews = useCallback(async () => {
    if (!postId || isLoading) return;

    // Vérifier le cache
    const cached = viewsCache.get(postId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setViews(cached.views);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${WORDPRESS_API_BASE}/otstats/v1/views/${postId}`, {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      if (typeof data.views === "number") {
        const viewCount = data.views;
        setViews(viewCount);
        // Mettre en cache
        viewsCache.set(postId, { views: viewCount, timestamp: Date.now() });
      }
    } catch (err) {
      console.error("Erreur chargement vues :", err);
    } finally {
      setIsLoading(false);
    }
  }, [postId, isLoading]);

  useEffect(() => {
    if (!postId) return;

    const timer = setTimeout(() => {
      loadViews();
    }, delay);

    return () => clearTimeout(timer);
  }, [postId, delay, loadViews]);

  return views;
};
