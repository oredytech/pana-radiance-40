import type { WordPressPost } from '@/types/wordpress';
import { fetchWithTimeout, fetchFast } from './api';

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

export const fetchPosts = async (): Promise<WordPressPost[]> => {
  try {
    console.log('Fetching recent posts with fast loading...');
    
    // Chargement rapide des premiers articles seulement
    const response = await fetchFast(
      `https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=50&orderby=date&order=desc`,
      8000 // Timeout réduit à 8 secondes
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Fast load completed: ${data.length} posts`);
    return data;
  } catch (error) {
    console.error("Error fetching posts, using mock data:", error);
    return mockPosts;
  }
};

export const fetchRecentPosts = async (limit: number = 30): Promise<WordPressPost[]> => {
  try {
    console.log(`Fetching ${limit} recent posts with optimized loading`);
    const response = await fetchFast(
      `https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${limit}&orderby=date&order=desc`,
      6000 // Timeout réduit à 6 secondes
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Loaded ${data.length} recent posts quickly`);
    return data;
  } catch (error) {
    console.error("Error fetching recent posts, using mock data:", error);
    return mockPosts.slice(0, limit);
  }
};

export const fetchOlderPosts = async (page: number = 2, perPage: number = 20): Promise<WordPressPost[]> => {
  try {
    console.log(`Fetching older posts page ${page} from API`);
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}&orderby=date&order=desc`,
      20000
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
      20000
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
    const response = await fetchWithTimeout(searchUrl, 20000);
    
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

export const fetchPost = async (id: string): Promise<WordPressPost> => {
  try {
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/posts/${id}?_embed`,
      20000
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching post:", error);
    const mockPost = mockPosts.find(p => p.id === parseInt(id));
    if (!mockPost) {
      throw new Error("Post not found");
    }
    return mockPost;
  }
};

// Fonction de rafraîchissement optimisée
export const refreshPostsInBackground = async (
  onUpdate: (newPosts: WordPressPost[]) => void,
  limit: number = 30
): Promise<void> => {
  try {
    console.log('Quick refresh in background...');
    const newPosts = await fetchRecentPosts(limit);
    onUpdate(newPosts);
    console.log('Quick refresh completed');
  } catch (error) {
    console.warn("Error in quick refresh:", error);
  }
};
