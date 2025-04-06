
import { WordPressPost, WordPressCategory, WordPressComment } from './types';

// Mock posts for fallback when API fails
export const mockPosts: WordPressPost[] = [
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

// Mock categories for fallback when API fails
export const mockCategories: WordPressCategory[] = [
  { id: 1, name: "Actualités", slug: "actualites", count: 10 },
  { id: 2, name: "Musique", slug: "musique", count: 8 },
  { id: 3, name: "Culture", slug: "culture", count: 5 },
  { id: 4, name: "Société", slug: "societe", count: 7 }
];

// Mock comments for fallback when API fails
export const mockComments: WordPressComment[] = [
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
