
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
  
  // Utiliser les hooks optimisés avec délais échelonnés
  const postId = usePostIdFromSlug(articleSlug);
  
  // Tracking différé de 1.5 secondes après le chargement du contenu
  useTrackArticleView(postId, 1500);
  
  // Chargement des vues différé de 3 secondes pour éviter la concurrence
  const views = useArticleViews(postId, 3000);

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
        
        {/* Contenu de l'article avec styles personnalisés pour les titres */}
        <div 
          className="prose max-w-none space-y-6 
            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:border-b [&_h1]:border-gray-200 [&_h1]:pb-2
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-800 [&_h2]:mt-6 [&_h2]:mb-3
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-5 [&_h3]:mb-3
            [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-gray-700 [&_h4]:mt-4 [&_h4]:mb-2
            [&_h5]:text-base [&_h5]:font-medium [&_h5]:text-gray-700 [&_h5]:mt-3 [&_h5]:mb-2
            [&_h6]:text-sm [&_h6]:font-medium [&_h6]:text-gray-600 [&_h6]:mt-3 [&_h6]:mb-2
            [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:ml-6 [&_ul]:mb-4 [&_li]:mb-2
            [&_ol]:ml-6 [&_ol]:mb-4
            [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600
            [&_strong]:font-semibold [&_strong]:text-gray-900
            [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>
    </article>
  );
};

export default ArticleContent;
