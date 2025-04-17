
import React from 'react';
import { type WordPressPost } from "@/services/wordpress";

interface ArticleContentProps {
  post: WordPressPost;
}

const ArticleContent = ({ post }: ArticleContentProps) => {
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
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
