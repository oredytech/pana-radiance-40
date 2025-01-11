const WP_API_URL = "https://totalementactus.net/wp-json/wp/v2";

export interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
}

export const fetchPosts = async (): Promise<WordPressPost[]> => {
  const response = await fetch(
    `${WP_API_URL}/posts?_embed=wp:featuredmedia&per_page=5`
  );
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des articles");
  }
  return response.json();
};