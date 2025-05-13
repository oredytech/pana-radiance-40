
import { type WordPressPost } from "@/services/wordpress";

export const getImageUrl = (post: WordPressPost) => {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
    "https://source.unsplash.com/random/800x600/?african-music";
};

export const stripHtml = (html: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const getSlug = (title: string) => {
  // Convertit d'abord le HTML en texte simple
  const plainText = stripHtml(title);
  
  // Normalise le texte en supprimant les accents et caractères spéciaux
  return plainText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-')     // Remplace les caractères non alphanumériques par des tirets
    .replace(/(^-|-$)/g, '')         // Supprime les tirets au début et à la fin
    .replace(/-+/g, '-');            // Remplace les séquences de tirets par un seul tiret
};

export const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

// Fonction pour normaliser et valider les slugs d'URL
export const normalizeSlug = (slug: string | undefined): string => {
  if (!slug) return '';
  
  // Applique les mêmes règles que getSlug pour normaliser un slug existant
  return slug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-+/g, '-');
};
