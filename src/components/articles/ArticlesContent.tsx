
import React from "react";
import { type WordPressPost } from "@/services/wordpress";
import ArticlesGrid from "@/components/ArticlesGrid";
import ArticlesPagination from "@/components/articles/ArticlesPagination";

interface ArticlesContentProps {
  filteredPosts: WordPressPost[];
  currentPosts: WordPressPost[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
  getImageUrl: (post: WordPressPost) => string;
  stripHtml: (html: string) => string;
  getSlug: (title: string) => string;
  truncateText: (text: string, wordLimit: number) => string;
}

const ArticlesContent = ({
  filteredPosts,
  currentPosts,
  isLoading,
  currentPage,
  totalPages,
  paginate,
  getImageUrl,
  stripHtml,
  getSlug,
  truncateText,
}: ArticlesContentProps) => {
  return (
    <>
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pana-red mx-auto mb-4"></div>
            <p>Chargement des articles...</p>
          </div>
        </div>
      ) : (
        <>
          <ArticlesGrid 
            posts={currentPosts}
            isLoading={isLoading}
            getImageUrl={getImageUrl}
            stripHtml={stripHtml}
            getSlug={getSlug}
            truncateText={truncateText}
            displayCount={12}
          />
          
          {filteredPosts.length > 0 ? (
            <ArticlesPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          ) : (
            <div className="text-center py-12">
              <p>Aucun article trouvé dans cette catégorie.</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ArticlesContent;
