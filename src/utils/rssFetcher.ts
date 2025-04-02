
import { XMLParser } from 'fast-xml-parser';

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  audioUrl: string;
  imageUrl?: string;
}

// Fonction pour nettoyer les balises HTML dans les descriptions
const cleanHtmlTags = (html: string): string => {
  if (!html) return '';
  
  // Crée un élément DOM temporaire
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  
  // Récupère uniquement le texte
  return tempElement.textContent || tempElement.innerText || '';
};

export async function fetchRssFeed(feedUrl: string): Promise<PodcastEpisode[]> {
  try {
    const response = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
    
    const result = parser.parse(data);
    const items = result.rss.channel.item;
    
    return items.map((item: any) => {
      const enclosure = item.enclosure || {};
      const duration = item['itunes:duration'] || '';
      const imageUrl = item['itunes:image']?.['@_href'] || result.rss.channel['itunes:image']?.['@_href'] || '';
      
      return {
        id: item.guid['#text'] || item.guid,
        title: item.title,
        description: cleanHtmlTags(item.description || item['itunes:summary'] || ''),
        duration: typeof duration === 'string' ? duration : '00:00',
        date: new Date(item.pubDate).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        audioUrl: enclosure['@_url'] || '',
        imageUrl
      };
    });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
}
