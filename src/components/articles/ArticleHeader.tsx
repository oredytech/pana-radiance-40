
import React from 'react';
import { type WordPressPost } from "@/services/wordpress";
import { getImageUrl, stripHtml } from "@/utils/textUtils";

interface ArticleHeaderProps {
  post: WordPressPost;
}

const ArticleHeader = ({ post }: ArticleHeaderProps) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      {/* Titre de l'article affiché avant l'image */}
      <div className="p-6 pb-4">
        <h1 
          className="text-3xl font-bold text-gray-900 leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
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
