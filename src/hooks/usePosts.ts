import { useState, useEffect } from 'react';
import type { WordPressPost } from '@/types/wordpress';
import { fetchRecentPosts, refreshPostsInBackground } from '@/services/wordpress/posts';

export function usePosts(limit = 20) {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // 1. Charge rapide depuis cache ou API
    fetchRecentPosts(limit).then(data => {
      setPosts(data);
      setLoading(false);
    });

    // 2. Mise à jour silencieuse en fond
    setUpdating(true);
    refreshPostsInBackground(newPosts => {
      setPosts(newPosts.slice(0, limit));
      setUpdating(false);
    }, limit);
  }, [limit]);

  return { posts, loading, updating };
}
