export interface WordPressPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

export interface WordPressComment {
  id: number;
  date: string;
  content: {
    rendered: string;
  };
  author_name: string;
  post: number;
  post_title?: string;
}