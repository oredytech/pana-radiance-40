// 📁 src/utils/otSiteStats.tsx
import { useEffect, useState } from "react";

// 🛠️ CONFIG : ici, mets l'URL de ton site WordPress
const WORDPRESS_API_BASE = "https://panaradio.net/wp-json/otstats/v1";

// 🔁 Fonction pour enregistrer une vue
export const useTrackArticleView = (postId: number) => {
  useEffect(() => {
    if (!postId) return;
    fetch(`${WORDPRESS_API_BASE}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.warn("Échec du tracking :", data);
        }
      })
      .catch((err) => console.error("Erreur tracking vue :", err));
  }, [postId]);
};

// 👁️ Fonction pour récupérer le nombre de vues
export const useArticleViews = (postId: number): number | null => {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (!postId) return;
    fetch(`${WORDPRESS_API_BASE}/views/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.views === "number") {
          setViews(data.views);
        }
      })
      .catch((err) => console.error("Erreur récupération vues :", err));
  }, [postId]);

  return views;
};
