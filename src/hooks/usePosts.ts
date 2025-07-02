
import { useState, useEffect } from 'react';
import type { WordPressPost } from '@/types/wordpress';
import { fetchRecentPosts } from '@/services/posts';

export function usePosts(limit = 20) {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        const data = await fetchRecentPosts(Math.min(limit, 30)); // Limiter pour la performance
        if (isMounted) {
          setPosts(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { posts, loading, updating: false };
}
