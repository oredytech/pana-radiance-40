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

export const fetchCategories = async (): Promise<WordPressCategory[]> => {
  try {
    const response = await fetch("https://totalementactus.net/wp-json/wp/v2/categories?per_page=100", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return mockCategories;
  }
};

export const fetchPosts = async (): Promise<WordPressPost[]> => {
  try {
    const response = await fetch("https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=100", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return mockPosts;
  }
};

export const fetchPostsByCategory = async (categoryId: number): Promise<WordPressPost[]> => {
  try {
    const response = await fetch(
      `https://totalementactus.net/wp-json/wp/v2/posts?_embed&categories=${categoryId}&per_page=100`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch posts by category");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return mockPosts.filter((_, index) => index % 5 === categoryId % 5);
  }
};

export const fetchPost = async (id: string): Promise<WordPressPost> => {
  try {
    const response = await fetch(
      `https://totalementactus.net/wp-json/wp/v2/posts/${id}?_embed`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    const mockPost = mockPosts.find(p => p.id === parseInt(id));
    if (!mockPost) {
      throw new Error("Post not found");
    }
    return mockPost;
  }
};

export const fetchLatestComments = async (limit: number = 10): Promise<WordPressComment[]> => {
  try {
    const response = await fetch(
      `https://totalementactus.net/wp-json/wp/v2/comments?per_page=${limit}&orderby=date&order=desc`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
    return mockComments.slice(0, limit);
  }
};

export const fetchAllComments = async (page: number = 1, perPage: number = 20): Promise<{
  comments: WordPressComment[];
  totalPages: number;
}> => {
  try {
    const response = await fetch(
      `https://totalementactus.net/wp-json/wp/v2/comments?page=${page}&per_page=${perPage}&orderby=date&order=desc`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
    const comments = await response.json();
    
    return {
      comments,
      totalPages
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
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
