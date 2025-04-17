
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { type WordPressPost } from "@/services/wordpress";
import { getImageUrl, stripHtml, getSlug } from "@/utils/textUtils";

interface RecentArticlesSidebarProps {
  posts: WordPressPost[];
}

const RecentArticlesSidebar = ({ posts }: RecentArticlesSidebarProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Articles récents</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="overflow-hidden">
            <div className="h-36 bg-gray-200 relative">
              <img 
                src={getImageUrl(post)} 
                alt={stripHtml(post.title.rendered)} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-3">
              <a 
                href={`/article/${getSlug(post.title.rendered)}`}
                className="font-medium hover:text-pana-red transition-colors line-clamp-2"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentArticlesSidebar;
