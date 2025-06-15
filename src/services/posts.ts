
import type { WordPressPost } from '@/types/wordpress';
import { fetchWithTimeout } from './api';
import { getCache, setCache, CACHE_DURATION, LONG_CACHE_DURATION, invalidateRecentPostsCache } from './cache';

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

// Nouvelle fonction pour recharger les articles en arrière-plan
export const refreshPostsInBackground = async (
  onUpdate: (newPosts: WordPressPost[]) => void,
  limit: number = 60 // Augmenter pour couvrir plus d'articles
): Promise<void> => {
  try {
    console.log('Rechargement des articles en arrière-plan...');
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${limit}&orderby=date&order=desc`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const newPosts = await response.json();
    
    // Mettre à jour le cache pour tous les articles
    const cacheKey = `all-posts`;
    setCache(cacheKey, newPosts);
    
    // Mettre à jour aussi le cache des articles récents
    const recentCacheKey = `recent-posts-20`;
    setCache(recentCacheKey, newPosts.slice(0, 20));
    
    // Notifier le composant des nouveaux articles
    onUpdate(newPosts);
    console.log('Articles mis à jour en arrière-plan');
  } catch (error) {
    console.warn("Erreur lors du rechargement en arrière-plan:", error);
  }
};

export const fetchRecentPosts = async (limit: number = 50): Promise<WordPressPost[]> => {
  const cacheKey = `recent-posts-${limit}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log(`Loading ${limit} recent posts from cache`);
    return cached;
  }

  try {
    console.log(`Fetching ${limit} recent posts from API`);
    const actualLimit = Math.min(limit, 100);
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${actualLimit}&orderby=date&order=desc`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn("Fallback to mock posts:", error);
    return mockPosts.slice(0, limit);
  }
};

export const fetchOlderPosts = async (page: number = 2, perPage: number = 20): Promise<WordPressPost[]> => {
  const cacheKey = `older-posts-${page}-${perPage}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log(`Loading older posts page ${page} from cache`);
    return cached;
  }

  try {
    console.log(`Fetching older posts page ${page} from API`);
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}&orderby=date&order=desc`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data, LONG_CACHE_DURATION);
    return data;
  } catch (error) {
    console.warn("Error fetching older posts:", error);
    return [];
  }
};

export const fetchPosts = async (): Promise<WordPressPost[]> => {
  const cacheKey = 'all-posts';
  const cached = getCache(cacheKey);
  if (cached) {
    console.log('Loading all posts from cache');
    return cached;
  }

  try {
    console.log('Fetching all posts from API with unlimited pagination');
    
    let allPosts: WordPressPost[] = [];
    let page = 1;
    let hasMore = true;
    const perPage = 100;
    
    while (hasMore) {
      console.log(`Fetching page ${page} of posts...`);
      const response = await fetchWithTimeout(
        `https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}&orderby=date&order=desc`
      );
      
      if (!response.ok) {
        if (response.status === 400 && page > 1) {
          console.log(`No more pages after page ${page - 1}`);
          break;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        hasMore = false;
      } else {
        allPosts = [...allPosts, ...data];
        console.log(`Page ${page} loaded: ${data.length} posts (Total: ${allPosts.length})`);
        
        if (data.length < perPage) {
          hasMore = false;
        } else {
          page++;
        }
      }
      
      if (page > 50) {
        console.warn('Stopping at page 50 to prevent infinite loop');
        break;
      }
    }
    
    console.log(`Total posts loaded: ${allPosts.length}`);
    setCache(cacheKey, allPosts);
    return allPosts;
  } catch (error) {
    console.warn("Fallback to mock posts:", error);
    return mockPosts;
  }
};

export const fetchPostsByCategory = async (categoryId: number): Promise<WordPressPost[]> => {
  const cacheKey = `posts-category-${categoryId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/posts?_embed&categories=${categoryId}&per_page=50`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn("Error fetching posts by category:", error);
    return mockPosts.filter((_, index) => index % 5 === categoryId % 5);
  }
};

export const searchPosts = async (query: string): Promise<WordPressPost[]> => {
  if (!query || query.trim().length === 0) {
    console.warn("Empty search query");
    return [];
  }

  const trimmedQuery = query.trim();
  const cacheKey = `search-${trimmedQuery.toLowerCase()}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log(`Returning cached search results for: ${trimmedQuery}`);
    return cached;
  }

  try {
    console.log(`Searching for: "${trimmedQuery}"`);
    
    // Essayer plusieurs approches de recherche
    const searchUrl = `https://panaradio.net/wp-json/wp/v2/posts?_embed&search=${encodeURIComponent(trimmedQuery)}&per_page=50&orderby=relevance`;
    console.log(`Search URL: ${searchUrl}`);
    
    const response = await fetchWithTimeout(searchUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Search API returned ${data.length} results for "${trimmedQuery}"`);
    
    // Si l'API ne retourne rien, essayer une recherche locale dans le cache
    if (data.length === 0) {
      console.log("No API results, trying local cache search...");
      const allPostsCache = getCache('all-posts') || getCache('recent-posts-50') || [];
      
      if (allPostsCache.length > 0) {
        const localResults = allPostsCache.filter((post: WordPressPost) => {
          const searchText = trimmedQuery.toLowerCase();
          const title = post.title.rendered.toLowerCase();
          const content = post.content?.rendered?.toLowerCase() || '';
          const excerpt = post.excerpt?.rendered?.toLowerCase() || '';
          
          return title.includes(searchText) || 
                 content.includes(searchText) || 
                 excerpt.includes(searchText);
        });
        
        console.log(`Local search found ${localResults.length} results`);
        setCache(cacheKey, localResults);
        return localResults;
      }
    }
    
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn("Error in search, trying fallback:", error);
    
    // Fallback: recherche dans les articles mock
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

export const fetchPost = async (id: string): Promise<WordPressPost> => {
  const cacheKey = `post-${id}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/posts/${id}?_embed`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn("Error fetching post:", error);
    const mockPost = mockPosts.find(p => p.id === parseInt(id));
    if (!mockPost) {
      throw new Error("Post not found");
    }
    return mockPost;
  }
};

export { invalidateRecentPostsCache };
