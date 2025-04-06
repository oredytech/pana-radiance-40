
import { WordPressComment } from './types';
import { fetchFromApi, fetchWithPagination } from './api';
import { mockComments } from './mockData';

// Fetch latest comments with a limit
export async function fetchLatestComments(limit: number = 10): Promise<WordPressComment[]> {
  try {
    return await fetchFromApi<WordPressComment[]>(`/comments?per_page=${limit}&orderby=date&order=desc`);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return mockComments.slice(0, limit);
  }
}

// Fetch all comments with pagination
export async function fetchAllComments(page: number = 1, perPage: number = 20): Promise<{
  comments: WordPressComment[];
  totalPages: number;
}> {
  try {
    const { data, totalPages } = await fetchWithPagination<WordPressComment>(`/comments?page=${page}&per_page=${perPage}&orderby=date&order=desc`);
    
    return {
      comments: data,
      totalPages
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      comments: mockComments.slice((page - 1) * perPage, page * perPage),
      totalPages: Math.ceil(mockComments.length / perPage)
    };
  }
}
