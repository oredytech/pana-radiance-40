import type { WordPressPost } from '@/types/wordpress';
import { fetchWithTimeout } from './api';

const mockPosts: WordPressPost[] = [
  {
    id: 1,
    date: "2024-02-15T10:00:00",
    title: {
      rendered: "Premier article"
    },
    content: {
      rendered: "Contenu du premier article"
    },
    excerpt: {
      rendered: "Extrait du premier article"
    }
  },
  {
    id: 2,
    date: "2024-02-14T09:00:00",
    title: {
      rendered: "Deuxième article"
    },
    content: {
      rendered: "Contenu du deuxième article"
    },
    excerpt: {
      rendered: "Extrait du deuxième article"
    }
  }
];

// Cache amélioré pour les articles
const articleCache = new Map<string, WordPressPost>();
const cacheTimeout = 2 * 60 * 1000; // Réduit à 2 minutes pour plus de fraîcheur

export const fetchPosts = async (): Promise<WordPressPost[]> => {
  try {
    console.log('🚀 Fetching optimized posts from API...');
    
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=100&orderby=date&order=desc`,
      4000 // Timeout réduit à 4 secondes
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Mise en cache immédiate et optimisée
    data.forEach((post: WordPressPost) => {
      const cacheKey = `post-${post.id}`;
      articleCache.set(cacheKey, {
        ...post,
        _cacheTime: Date.now()
      });
    });
    
    console.log(`✅ Loaded and cached ${data.length} posts`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return mockPosts;
  }
};

export const fetchRecentPosts = async (limit: number = 100): Promise<WordPressPost[]> => {
  try {
    console.log(`🔄 Fetching ${limit} recent posts from API`);
    
    // Ajuster la limite pour optimiser les performances
    const optimizedLimit = Math.min(limit, 500); // Plafonner à 500 pour éviter les timeouts
    
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${optimizedLimit}&orderby=date&order=desc`,
      6000 // Timeout légèrement augmenté pour les gros volumes
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Mise en cache ultra-rapide
    data.forEach((post: WordPressPost) => {
      const cacheKey = `post-${post.id}`;
      articleCache.set(cacheKey, {
        ...post,
        _cacheTime: Date.now()
      });
    });
    
    console.log(`✅ Loaded ${data.length} recent posts successfully`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching recent posts:", error);
    // Retourner plus d'articles mock en cas d'erreur
    return Array(Math.min(limit, 10)).fill(null).map((_, index) => ({
      ...mockPosts[index % mockPosts.length],
      id: index + 1
    }));
  }
};

export const fetchOlderPosts = async (page: number = 2, perPage: number = 20): Promise<WordPressPost[]> => {
  try {
    console.log(`Fetching older posts page ${page} from API`);
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}&orderby=date&order=desc`,
      8000
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Loaded ${data.length} older posts from page ${page}`);
    return data;
  } catch (error) {
    console.error("Error fetching older posts:", error);
    return [];
  }
};

export const fetchPostsByCategory = async (categoryId: number): Promise<WordPressPost[]> => {
  try {
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/posts?_embed&categories=${categoryId}&per_page=50`,
      8000
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Loaded ${data.length} posts for category ${categoryId}`);
    return data;
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return mockPosts.filter((_, index) => index % 5 === categoryId % 5);
  }
};

export const searchPosts = async (query: string): Promise<WordPressPost[]> => {
  if (!query || query.trim().length === 0) {
    console.warn("Empty search query");
    return [];
  }

  const trimmedQuery = query.trim();

  try {
    console.log(`Searching for: "${trimmedQuery}"`);
    
    const searchUrl = `https://panaradio.net/wp-json/wp/v2/posts?_embed&search=${encodeURIComponent(trimmedQuery)}&per_page=50&orderby=relevance`;
    const response = await fetchWithTimeout(searchUrl, 8000);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Search found ${data.length} results for "${trimmedQuery}"`);
    
    return data;
  } catch (error) {
    console.error("Error in search:", error);
    
    const mockResults = mockPosts.filter(post => {
      const searchText = trimmedQuery.toLowerCase();
      return post.title.rendered.toLowerCase().includes(searchText) ||
             post.content.rendered.toLowerCase().includes(searchText) ||
             post.excerpt.rendered.toLowerCase().includes(searchText);
    });
    
    console.log(`Mock search found ${mockResults.length} results`);
    return mockResults;
  }
};

// Nouvelle fonction optimisée pour charger un article individuel
export const fetchPost = async (id: string): Promise<WordPressPost> => {
  // Vérification de cache optimisée
  const cacheKey = `post-${id}`;
  const cachedPost = articleCache.get(cacheKey);
  
  if (cachedPost && cachedPost._cacheTime && (Date.now() - cachedPost._cacheTime < cacheTimeout)) {
    console.log(`⚡ Returning cached post ${id}`);
    return cachedPost;
  }

  try {
    console.log(`🔍 Fetching post ${id} from API`);
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/posts/${id}?_embed`,
      3000 // Timeout très court pour un article individuel
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Mise en cache immédiate
    articleCache.set(cacheKey, {
      ...data,
      _cacheTime: Date.now()
    });
    
    console.log(`✅ Loaded and cached post ${id}`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    const mockPost = mockPosts.find(p => p.id === parseInt(id));
    if (!mockPost) {
      throw new Error("Post not found");
    }
    return mockPost;
  }
};

// Fonction de rafraîchissement simplifiée et plus rapide
export const refreshPostsInBackground = async (
  onUpdate: (newPosts: WordPressPost[]) => void,
  limit: number = 60
): Promise<void> => {
  try {
    console.log('Refreshing posts in background...');
    const newPosts = await fetchRecentPosts(Math.min(limit, 30)); // Limiter pour la performance
    onUpdate(newPosts);
    console.log('Posts refreshed successfully');
  } catch (error) {
    console.warn("Error refreshing posts in background:", error);
  }
};

// Fonction pour vider le cache si nécessaire
export const clearArticleCache = () => {
  articleCache.clear();
  console.log('Article cache cleared');
};
