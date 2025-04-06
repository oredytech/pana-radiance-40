
import { WordPressCategory } from './types';
import { fetchFromApi } from './api';
import { mockCategories } from './mockData';

// Fetch all categories
export async function fetchCategories(): Promise<WordPressCategory[]> {
  try {
    return await fetchFromApi<WordPressCategory[]>("/categories?per_page=100");
  } catch (error) {
    console.error("Error fetching categories:", error);
    return mockCategories;
  }
}
