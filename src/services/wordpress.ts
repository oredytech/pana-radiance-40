
// Service principal WordPress - point d'entrée pour tous les services
export type { WordPressPost, WordPressComment } from '@/types/wordpress';
export type { WordPressCategory } from './categories';

// Réexporter tous les services
export {
  fetchCategories
} from './categories';

export {
  fetchRecentPosts,
  fetchOlderPosts,
  fetchPosts,
  fetchPostsByCategory,
  searchPosts,
  fetchPost,
  refreshPostsInBackground,
  invalidateRecentPostsCache
} from './posts';

export {
  fetchLatestComments,
  fetchAllComments
} from './comments';
