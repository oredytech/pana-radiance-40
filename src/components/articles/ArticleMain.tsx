
import React from 'react';
import { type WordPressPost } from "@/services/wordpress";
import { stripHtml } from "@/utils/textUtils";
import ArticleContent from "./ArticleContent";
import ArticleShareButtons from "./ArticleShareButtons";
import ArticleCommentForm from "./ArticleCommentForm";
import RelatedArticles from "./RelatedArticles";

interface ArticleMainProps {
  post: WordPressPost;
  similarPosts: WordPressPost[];
}

const ArticleMain = ({ post, similarPosts }: ArticleMainProps) => {
  return (
    <div className="w-full lg:w-2/3">
      <ArticleContent post={post} />
      
      <ArticleShareButtons 
        title={stripHtml(post.title.rendered)} 
        url={window.location.href} 
      />
      
      <ArticleCommentForm />
      
      <RelatedArticles posts={similarPosts} />
    </div>
  );
};

export default ArticleMain;
