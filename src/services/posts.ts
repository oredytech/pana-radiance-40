
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

export const refreshPostsInBackground = async (
  onUpdate: (newPosts: WordPressPost[]) => void,
  limit: number = 60
): Promise<void> => {
  try {
    console.log('Rechargement des articles en arrière-plan...');
    const response = await fetchWithTimeout(`https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=${limit}&orderby=date&order=desc`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const newPosts = await response.json();
    onUpdate(newPosts);
    console.log('Articles mis à jour en arrière-plan');
  } catch (error) {
    console.warn("Erreur lors du rechargement en arrière-plan:", error);
  }
};

export const fetchRecentPosts = async (limit: number = 50): Promise<WordPressPost[]> => {
  try {
    console.log(`Fetching ${limit} recent posts from API`);
    const actualLimit = Math.min(limit, 100);
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${actualLimit}&orderby=date&order=desc`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Fallback to mock posts:", error);
    return mockPosts.slice(0, limit);
  }
};

export const fetchOlderPosts = async (page: number = 2, perPage: number = 20): Promise<WordPressPost[]> => {
  try {
    console.log(`Fetching older posts page ${page} from API`);
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}&orderby=date&order=desc`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Error fetching older posts:", error);
    return [];
  }
};

export const fetchPosts = async (): Promise<WordPressPost[]> => {
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
    return allPosts;
  } catch (error) {
    console.warn("Fallback to mock posts:", error);
    return mockPosts;
  }
};

export const fetchPostsByCategory = async (categoryId: number): Promise<WordPressPost[]> => {
  try {
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/posts?_embed&categories=${categoryId}&per_page=50`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
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

  try {
    console.log(`Searching for: "${trimmedQuery}"`);
    
    const searchUrl = `https://panaradio.net/wp-json/wp/v2/posts?_embed&search=${encodeURIComponent(trimmedQuery)}&per_page=50&orderby=relevance`;
    console.log(`Search URL: ${searchUrl}`);
    
    const response = await fetchWithTimeout(searchUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Search API returned ${data.length} results for "${trimmedQuery}"`);
    
    return data;
  } catch (error) {
    console.warn("Error in search, trying fallback:", error);
    
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
      `https://panaradio.net/wp-json/wp/v2/posts/${id}?_embed`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
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

// Fonction vide pour compatibilité
export const invalidateRecentPostsCache = () => {
  console.log("Cache invalidation called but no cache system active");
};
