
import React from 'react';
import { type WordPressPost } from "@/services/wordpress";
import { getImageUrl, stripHtml } from "@/utils/textUtils";
import { useToast } from "@/hooks/use-toast";

interface ArticleHeaderProps {
  post: WordPressPost;
}

const ArticleHeader = ({ post }: ArticleHeaderProps) => {
  const { toast } = useToast();

  const handleTitleRightClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Construire l'URL avec le domaine panaradio.net
    const currentPath = window.location.pathname;
    let slug = '';
    
    if (currentPath.startsWith('/article/')) {
      slug = currentPath.replace('/article/', '');
    } else if (currentPath.startsWith('/')) {
      slug = currentPath.slice(1);
    }
    
    const shareUrl = `https://panaradio.net/${slug}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien de l'article a été copié dans le presse-papier.",
      });
    } catch (error) {
      // Fallback pour les navigateurs qui ne supportent pas clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Lien copié !",
        description: "Le lien de l'article a été copié dans le presse-papier.",
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      {/* Titre de l'article affiché avant l'image */}
      <div className="p-6 pb-4">
        <h1 
          className="text-3xl font-bold text-gray-900 leading-tight cursor-pointer hover:text-pana-purple transition-colors"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
          onContextMenu={handleTitleRightClick}
          title="Clic droit pour copier le lien de l'article"
        />
      </div>
      
      {/* Image mise en avant */}
      <img
        src={getImageUrl(post)}
        alt={stripHtml(post.title.rendered)}
        className="w-full h-[400px] object-cover"
      />
    </div>
  );
};

export default ArticleHeader;
