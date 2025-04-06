
import { WordPressPost } from './types';
import { fetchFromApi } from './api';
import { mockPosts } from './mockData';

// Fetch all posts
export async function fetchPosts(): Promise<WordPressPost[]> {
  try {
    return await fetchFromApi<WordPressPost[]>("/posts?_embed&per_page=100");
  } catch (error) {
    console.error("Error fetching posts:", error);
    return mockPosts;
  }
}

// Fetch posts by category ID
export async function fetchPostsByCategory(categoryId: number): Promise<WordPressPost[]> {
  try {
    return await fetchFromApi<WordPressPost[]>(`/posts?_embed&categories=${categoryId}&per_page=100`);
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return mockPosts.filter((_, index) => index % 5 === categoryId % 5);
  }
}

// Fetch a single post by ID
export async function fetchPost(id: string): Promise<WordPressPost> {
  try {
    return await fetchFromApi<WordPressPost>(`/posts/${id}?_embed`);
  } catch (error) {
    console.error("Error fetching post:", error);
    const mockPost = mockPosts.find(p => p.id === parseInt(id));
    if (!mockPost) {
      throw new Error("Post not found");
    }
    return mockPost;
  }
}
