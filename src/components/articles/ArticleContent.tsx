
import React from 'react';
import { useParams } from 'react-router-dom';
import { type WordPressPost } from "@/services/wordpress";
import { usePostIdFromSlug, useTrackArticleView, useArticleViews } from "@/utils/otSiteStats";
import { getSlug } from "@/utils/textUtils";

interface ArticleContentProps {
  post: WordPressPost;
}

const ArticleContent = ({ post }: ArticleContentProps) => {
  const { slug } = useParams();
  
  // Générer le slug à partir du titre si pas de slug dans l'URL
  const articleSlug = slug || getSlug(post.title.rendered);
  
  // Utiliser les hooks pour les statistiques
  const postId = usePostIdFromSlug(articleSlug);
  useTrackArticleView(postId);
  const views = useArticleViews(postId);

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
        {/* Affichage du nombre de vues */}
        {views !== null ? (
          <p className="text-gray-600 mb-4 font-medium">
            👁️ Lecteurs : {views.toLocaleString()} vue{views > 1 ? 's' : ''}
          </p>
        ) : (
          <p className="text-gray-400 mb-4">Chargement des vues...</p>
        )}
        
        <h1 
          className="text-3xl font-bold mb-6"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
        />
        <div 
          className="prose max-w-none space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>
    </article>
  );
};

export default ArticleContent;
