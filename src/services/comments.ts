
import type { WordPressComment } from '@/types/wordpress';
import { fetchWithTimeout } from './api';

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

export const fetchLatestComments = async (limit: number = 10): Promise<WordPressComment[]> => {
  try {
    const response = await fetchWithTimeout(
      `https://panaradio.net/wp-json/wp/v2/comments?per_page=${limit}&orderby=date&order=desc`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
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
    
    return result;
  } catch (error) {
    console.warn("Error fetching comments:", error);
    return {
      comments: mockComments.slice((page - 1) * perPage, page * perPage),
      totalPages: Math.ceil(mockComments.length / perPage)
    };
  }
};
