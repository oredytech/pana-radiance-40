
import React from 'react';
import { type WordPressPost } from "@/services/wordpress";
import AdvertisementSection from "@/components/AdvertisementSection";
import RecentArticlesSidebar from "./RecentArticlesSidebar";
import CategoriesSidebar from "./CategoriesSidebar";

interface ArticleSidebarProps {
  recentPosts: WordPressPost[];
}

const ArticleSidebar = ({ recentPosts }: ArticleSidebarProps) => {
  return (
    <div className="w-full lg:w-1/3">
      <div className="mb-6">
        <AdvertisementSection />
      </div>
      
      <RecentArticlesSidebar posts={recentPosts} />
      <CategoriesSidebar />
    </div>
  );
};

export default ArticleSidebar;
