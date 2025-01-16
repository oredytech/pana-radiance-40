import type { WordPressPost } from '@/types/wordpress';

export type { WordPressPost };

export const fetchPosts = async (): Promise<WordPressPost[]> => {
  try {
    const response = await fetch("https://totalementactus.net/wp-json/wp/v2/posts?_embed", {
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
    // Return mock data as fallback in case of error
    return mockPosts;
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

// Keep mock data as fallback
const mockPosts: WordPressPost[] = [
  {
    id: 1,
    date: "2024-01-16T10:00:00",
    title: {
      rendered: "L'actualité africaine en direct"
    },
    content: {
      rendered: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    excerpt: {
      rendered: "Lorem ipsum dolor sit amet..."
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: "https://source.unsplash.com/random/800x600/?african-news"
      }]
    }
  },
  {
    id: 2,
    date: "2024-01-16T09:00:00",
    title: {
      rendered: "Culture et traditions"
    },
    content: {
      rendered: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    excerpt: {
      rendered: "Sed do eiusmod tempor..."
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: "https://source.unsplash.com/random/800x600/?african-culture"
      }]
    }
  },
  // Add more mock posts to fill the grid
  {
    id: 3,
    date: "2024-01-16T08:00:00",
    title: {
      rendered: "Économie africaine"
    },
    content: {
      rendered: "Ut enim ad minim veniam, quis nostrud exercitation ullamco."
    },
    excerpt: {
      rendered: "Ut enim ad minim..."
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: "https://source.unsplash.com/random/800x600/?african-business"
      }]
    }
  },
  {
    id: 4,
    date: "2024-01-16T07:00:00",
    title: {
      rendered: "Sport et jeunesse"
    },
    content: {
      rendered: "Duis aute irure dolor in reprehenderit in voluptate velit."
    },
    excerpt: {
      rendered: "Duis aute irure..."
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: "https://source.unsplash.com/random/800x600/?african-sports"
      }]
    }
  },
  {
    id: 5,
    date: "2024-01-16T06:00:00",
    title: {
      rendered: "Innovation technologique"
    },
    content: {
      rendered: "Excepteur sint occaecat cupidatat non proident."
    },
    excerpt: {
      rendered: "Excepteur sint occaecat..."
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: "https://source.unsplash.com/random/800x600/?african-tech"
      }]
    }
  },
  {
    id: 6,
    date: "2024-01-16T05:00:00",
    title: {
      rendered: "Musique et arts"
    },
    content: {
      rendered: "Sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    excerpt: {
      rendered: "Sunt in culpa qui..."
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: "https://source.unsplash.com/random/800x600/?african-music"
      }]
    }
  },
  {
    id: 7,
    date: "2024-01-16T04:00:00",
    title: {
      rendered: "Environnement"
    },
    content: {
      rendered: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
    },
    excerpt: {
      rendered: "Sed ut perspiciatis..."
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: "https://source.unsplash.com/random/800x600/?african-nature"
      }]
    }
  }
];
