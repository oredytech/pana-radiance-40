
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { type WordPressPost } from "@/services/wordpress";
import { getImageUrl, stripHtml, getSlug } from "@/utils/textUtils";

interface RelatedArticlesProps {
  posts: WordPressPost[];
  title?: string;
}

const RelatedArticles = ({ posts, title = "Lire aussi" }: RelatedArticlesProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <Card key={post.id} className="overflow-hidden">
            <a href={`/article/${getSlug(post.title.rendered)}`} className="block">
              <div className="h-40 overflow-hidden">
                <img 
                  src={getImageUrl(post)} 
                  alt={stripHtml(post.title.rendered)} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 
                  className="font-semibold text-sm line-clamp-2 hover:text-pana-red transition-colors"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
              </CardContent>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
