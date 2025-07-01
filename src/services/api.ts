
export const fetchWithTimeout = async (url: string, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      signal: controller.signal
    });
    clearTimeout(id);
    console.log(`Response status: ${response.status} for ${url}`);
    return response;
  } catch (error) {
    clearTimeout(id);
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

// Nouvelle fonction pour les requêtes rapides avec timeout réduit
export const fetchFast = async (url: string, timeout = 5000) => {
  return fetchWithTimeout(url, timeout);
};
