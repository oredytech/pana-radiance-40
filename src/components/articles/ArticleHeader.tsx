
import React from 'react';
import { type WordPressPost } from "@/services/wordpress";
import { getImageUrl, stripHtml } from "@/utils/textUtils";

interface ArticleHeaderProps {
  post: WordPressPost;
}

const ArticleHeader = ({ post }: ArticleHeaderProps) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      <img
        src={getImageUrl(post)}
        alt={stripHtml(post.title.rendered)}
        className="w-full h-[400px] object-cover"
      />
    </div>
  );
};

export default ArticleHeader;
