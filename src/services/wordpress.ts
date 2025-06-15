
import type { WordPressPost, WordPressComment } from '@/types/wordpress';

export type { WordPressPost, WordPressComment };

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

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

const mockCategories: WordPressCategory[] = [
  { id: 1, name: "Actualités", slug: "actualites", count: 10 },
  { id: 2, name: "Musique", slug: "musique", count: 8 },
  { id: 3, name: "Culture", slug: "culture", count: 5 },
  { id: 4, name: "Société", slug: "societe", count: 7 }
];

// Cache en mémoire amélioré avec invalidation intelligente
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes pour les articles récents
const LONG_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes pour les catégories (changent moins souvent)

const getCacheKey = (url: string) => url;

const setCache = (key: string, data: any, duration = CACHE_DURATION) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    duration
  });
};

const getCache = (key: string) => {
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

const fetchWithTimeout = async (url: string, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const fetchCategories = async (): Promise<WordPressCategory[]> => {
  const cacheKey = 'categories';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/categories?per_page=100`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data, LONG_CACHE_DURATION); // Cache plus long pour les catégories
    return data;
  } catch (error) {
    console.warn("Fallback to mock categories:", error);
    return mockCategories;
  }
};

export const fetchRecentPosts = async (limit: number = 20): Promise<WordPressPost[]> => {
  const cacheKey = `recent-posts-${limit}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log(`Loading ${limit} recent posts from cache`);
    return cached;
  }

  try {
    console.log(`Fetching ${limit} recent posts from API`);
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${limit}&orderby=date&order=desc`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data); // Cache standard de 5 minutes
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
    setCache(cacheKey, data, LONG_CACHE_DURATION); // Cache plus long pour les articles plus anciens
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
    console.log('Fetching all posts from API with increased limit');
    // Augmenter le nombre d'articles récupérés pour s'assurer d'avoir les nouveaux articles
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=100&orderby=date&order=desc`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
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
  const cacheKey = `search-${query}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/posts?_embed&search=${encodeURIComponent(query)}&per_page=30`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn("Error searching posts:", error);
    return mockPosts.filter(post => 
      post.title.rendered.toLowerCase().includes(query.toLowerCase()) ||
      post.content.rendered.toLowerCase().includes(query.toLowerCase())
    );
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

export const fetchLatestComments = async (limit: number = 10): Promise<WordPressComment[]> => {
  const cacheKey = `latest-comments-${limit}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/comments?per_page=${limit}&orderby=date&order=desc`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn("Error fetching comments:", error);
    return mockComments.slice(0, limit);
  }
};

export const fetchAllComments = async (page: number = 1, perPage: number = 20): Promise<{
  comments: WordPressComment[];
  totalPages: number;
}> => {
  const cacheKey = `all-comments-${page}-${perPage}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/comments?page=${page}&per_page=${perPage}&orderby=date&order=desc`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
    const comments = await response.json();
    
    const result = {
      comments,
      totalPages
    };
    
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn("Error fetching comments:", error);
    return {
      comments: mockComments.slice((page - 1) * perPage, page * perPage),
      totalPages: Math.ceil(mockComments.length / perPage)
    };
  }
};

const mockComments = [
  {
    id: 1,
    date: "2024-02-15T10:00:00",
    content: {
      rendered: "J'adore votre émission matinale ! Continuez comme ça !"
    },
    author_name: "Marie K.",
    post: 1
  },
  {
    id: 2,
    date: "2024-02-14T09:00:00",
    content: {
      rendered: "La playlist d'hier était incroyable. Merci pour ces découvertes !"
    },
    author_name: "Jean P.",
    post: 2
  },
  {
    id: 3,
    date: "2024-02-13T08:00:00",
    content: {
      rendered: "Le débat sur la culture africaine était très enrichissant."
    },
    author_name: "Sophie M.",
    post: 3
  }
];
