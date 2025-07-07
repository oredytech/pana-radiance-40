
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
};

export const getSlug = (title: string): string => {
  return stripHtml(title)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retire les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garde seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplace espaces par tirets
    .replace(/-+/g, '-') // Évite les tirets multiples
    .replace(/^-+|-+$/g, ''); // Retire tirets en début/fin
};

export const truncateText = (text: string, wordLimit: number): string => {
  const words = stripHtml(text).split(' ');
  if (words.length <= wordLimit) return stripHtml(text);
  return words.slice(0, wordLimit).join(' ') + '...';
};

export const getImageUrl = (post: any): string => {
  // Vérifier d'abord si l'image est dans _embedded
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
    const media = post._embedded['wp:featuredmedia'][0];
    if (media.media_details && media.media_details.sizes) {
      // Essayer d'obtenir une taille appropriée
      if (media.media_details.sizes.medium_large) {
        return media.media_details.sizes.medium_large.source_url;
      }
      if (media.media_details.sizes.large) {
        return media.media_details.sizes.large.source_url;
      }
      if (media.media_details.sizes.medium) {
        return media.media_details.sizes.medium.source_url;
      }
      if (media.media_details.sizes.full) {
        return media.media_details.sizes.full.source_url;
      }
    }
    // Fallback vers l'URL source si pas de tailles spécifiques
    if (media.source_url) {
      return media.source_url;
    }
  }
  
  // Fallback vers une image par défaut
  return '/placeholder.svg';
};
