// 📁 src/utils/otSiteStats.tsx
import { useEffect, useState } from "react";

// 🛠️ Ton domaine WordPress ici
const WORDPRESS_API_BASE = "https://panaradio.net/wp-json";

// 🔁 Récupérer le post ID depuis un slug
export const usePostIdFromSlug = (slug: string): number | null => {
  const [postId, setPostId] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetch(`${WORDPRESS_API_BASE}/wp/v2/posts?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPostId(data[0].id);
        } else {
          console.warn("Aucun article trouvé pour le slug :", slug);
        }
      })
      .catch(err => console.error("Erreur récupération ID par slug :", err));
  }, [slug]);

  return postId;
};

// 🔁 Envoie une vue
export const useTrackArticleView = (postId: number | null) => {
  useEffect(() => {
    if (!postId) return;

    fetch(`${WORDPRESS_API_BASE}/otstats/v1/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId }),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          console.warn("Tracking échoué :", data);
        }
      })
      .catch(err => console.error("Erreur tracking :", err));
  }, [postId]);
};

// 👁️ Obtenir le nombre de vues
export const useArticleViews = (postId: number | null): number | null => {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (!postId) return;

    fetch(`${WORDPRESS_API_BASE}/otstats/v1/views/${postId}`)
      .then(res => res.json())
      .then(data => {
        if (typeof data.views === "number") {
          setViews(data.views);
        }
      })
      .catch(err => console.error("Erreur chargement vues :", err));
  }, [postId]);

  return views;
};
