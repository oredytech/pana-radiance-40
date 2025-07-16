import React, { useEffect, useState } from "react";

const WORDPRESS_API_BASE = "https://panaradio.net/wp-json";

type Props = {
  slug?: string;      // Si tu as le slug
  postId?: number;    // Ou directement l'ID WordPress
};

const OtViews: React.FC<Props> = ({ slug, postId }) => {
  const [resolvedId, setResolvedId] = useState<number | null>(postId || null);
  const [views, setViews] = useState<number | null>(null);

  // Résoudre l'ID si on a le slug
  useEffect(() => {
    if (postId) {
      setResolvedId(postId);
    } else if (slug) {
      fetch(`${WORDPRESS_API_BASE}/wp/v2/posts?slug=${encodeURIComponent(slug)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) setResolvedId(data[0].id);
        });
    }
  }, [slug, postId]);

  // Charger les vues et tracker
  useEffect(() => {
    if (!resolvedId) return;

    // 1. Afficher le nombre de vues personnalisées (ou par défaut)
    fetch(`${WORDPRESS_API_BASE}/otstats/v1/display-views/${resolvedId}`)
      .then(res => res.json())
      .then(data => setViews(data.views));

    // 2. Tracker la vue réelle (non personnalisée)
    fetch(`${WORDPRESS_API_BASE}/otstats/v1/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: resolvedId })
    }).catch(() => {});
  }, [resolvedId]);

  if (!resolvedId) return <span>Chargement…</span>;
  if (views === null) return <span>Chargement des vues…</span>;

  return (
    <div className="ot-views">
      <strong>Vues :</strong> {views}
    </div>
  );
};

export default OtViews;
