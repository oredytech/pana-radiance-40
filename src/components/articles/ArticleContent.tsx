
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { type WordPressPost } from "@/services/wordpress";
import { usePostIdFromSlug, useTrackArticleView, useArticleViews } from "@/utils/otSiteStats";
import { getSlug } from "@/utils/textUtils";
import { useTranslation } from "@/hooks/useTranslation";
import ArticleAudioPlayer from './ArticleAudioPlayer';

interface ArticleContentProps {
  post: WordPressPost;
}

const ArticleContent = ({ post }: ArticleContentProps) => {
  const { slug } = useParams();
  const { retranslateContent } = useTranslation();
  
  // Générer le slug à partir du titre si pas de slug dans l'URL
  const articleSlug = slug || getSlug(post.title.rendered);
  
  // Utiliser les hooks pour les statistiques
  const postId = usePostIdFromSlug(articleSlug);
  useTrackArticleView(postId);
  const views = useArticleViews(postId);

  // Déclencher la retraduction quand le contenu de l'article change
  useEffect(() => {
    if (post && post.content) {
      const timer = setTimeout(() => {
        retranslateContent();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [post.id, retranslateContent]);

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
        {/* Affichage du nombre de vues et lecteur audio */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {views !== null ? (
              <p className="text-gray-600 font-medium">
                👁️ : {views.toLocaleString()} vue{views > 1 ? 's' : ''}
              </p>
            ) : (
              <p className="text-gray-400">Chargement des vues...</p>
            )}
          </div>
          
          <div className="relative">
            <ArticleAudioPlayer 
              title={post.title.rendered}
              content={post.content.rendered}
            />
          </div>
        </div>
        
        {/* Contenu de l'article sans le titre */}
        <div 
          className="prose max-w-none space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>
    </article>
  );
};

export default ArticleContent;
