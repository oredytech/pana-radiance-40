
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

// Cache simple en mémoire
const cache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

const getCacheKey = (url: string) => url;

const setCache = (key: string, data: any) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const getCache = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const fetchWithTimeout = async (url: string, timeout = 5000) => {
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
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn("Fallback to mock categories:", error);
    return mockCategories;
  }
};

export const fetchRecentPosts = async (limit: number = 20): Promise<WordPressPost[]> => {
  const cacheKey = `recent-posts-${limit}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${limit}&orderby=date&order=desc`);
    
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
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}&orderby=date&order=desc`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn("Error fetching older posts:", error);
    return [];
  }
};

export const fetchPosts = async (): Promise<WordPressPost[]> => {
  const cacheKey = 'all-posts';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=50`);
    
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
