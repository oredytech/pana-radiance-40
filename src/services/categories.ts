
import { fetchWithTimeout } from './api';
import { getCache, setCache, LONG_CACHE_DURATION } from './cache';

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

const mockCategories: WordPressCategory[] = [
  { id: 1, name: "Actualités", slug: "actualites", count: 10 },
  { id: 2, name: "Musique", slug: "musique", count: 8 },
  { id: 3, name: "Culture", slug: "culture", count: 5 },
  { id: 4, name: "Société", slug: "societe", count: 7 }
];

export const fetchCategories = async (): Promise<WordPressCategory[]> => {
  const cacheKey = 'categories';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(`https://panaradio.net/wp-json/wp/v2/categories?per_page=100`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data, LONG_CACHE_DURATION);
    return data;
  } catch (error) {
    console.warn("Fallback to mock categories:", error);
    return mockCategories;
  }
};
