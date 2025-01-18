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
  return stripHtml(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};