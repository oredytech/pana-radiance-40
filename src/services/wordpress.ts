import type { WordPressPost } from '@/types/wordpress';

export type { WordPressPost };

export const fetchPosts = async (): Promise<WordPressPost[]> => {
  try {
    const response = await fetch("https://panaradio.org/wp-json/wp/v2/posts?_embed", {
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
    return [];
  }
};

export const fetchPost = async (id: string): Promise<WordPressPost> => {
  try {
    const response = await fetch(
      `https://panaradio.org/wp-json/wp/v2/posts/${id}?_embed`,
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
    throw error;
  }
};