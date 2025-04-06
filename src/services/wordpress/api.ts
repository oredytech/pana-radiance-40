
// Common API utilities and mock data generators

// Base URL for WordPress API
export const WP_API_BASE = "https://totalementactus.net/wp-json/wp/v2";

// Common headers for API requests
export const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
});

// Function to handle API requests
export async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${WP_API_BASE}${endpoint}`, {
    headers: getHeaders(),
    mode: 'cors'
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Function to extract total pages from API response
export function getApiTotalPages(response: Response): number {
  return parseInt(response.headers.get('X-WP-TotalPages') || '1');
}

// Advanced fetch function that returns both data and pagination info
export async function fetchWithPagination<T>(endpoint: string): Promise<{
  data: T[];
  totalPages: number;
}> {
  const response = await fetch(`${WP_API_BASE}${endpoint}`, {
    headers: getHeaders(),
    mode: 'cors'
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  const totalPages = getApiTotalPages(response);
  const data = await response.json();
  
  return {
    data,
    totalPages
  };
}
