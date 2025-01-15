import type { WordPressPost } from "@/types/wordpress";

export const fetchPosts = async (): Promise<WordPressPost[]> => {
  const response = await fetch("https://panaradio.org/wp-json/wp/v2/posts?_embed");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
};

export const fetchPost = async (id: string): Promise<WordPressPost> => {
  const response = await fetch(
    `https://panaradio.org/wp-json/wp/v2/posts/${id}?_embed`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  return response.json();
};
