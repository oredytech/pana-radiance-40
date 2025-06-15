
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchRecentPosts, fetchOlderPosts, fetchPostsByCategory } from "@/services/wordpress";
import CategoryTabs from "./CategoryTabs";
import ArticlesContent from "./ArticlesContent";
import ArticleLoadingSkeleton from "./ArticleLoadingSkeleton";
import { getImageUrl, stripHtml, getSlug, truncateText } from "@/utils/textUtils";

interface ArticlesContainerProps {
  categories: any[];
}

const ArticlesContainer = ({ categories }: ArticlesContainerProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || "all");
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const postsPerPage = 12;

  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);
  
  const { data: recentPosts, isLoading: isLoadingRecent, error } = useQuery({
    queryKey: ["recent-posts", activeCategory],
    queryFn: async () => {
      if (activeCategory === "all") {
        return fetchRecentPosts(20);
      } else {
        return fetchPostsByCategory(parseInt(activeCategory));
      }
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    meta: {
      onError: () => {
        console.warn("Impossible de charger les articles");
      }
    }
  });

  useEffect(() => {
    if (recentPosts && recentPosts.length > 0) {
      setAllPosts(recentPosts);
      
      if (activeCategory === "all") {
        const olderTimeout = setTimeout(async () => {
          setIsLoadingOlder(true);
          try {
            const olderPosts = await fetchOlderPosts(2, 40);
            setAllPosts(prev => [...prev, ...olderPosts]);
          } catch (error) {
            console.warn("Erreur lors du chargement des articles plus anciens:", error);
          } finally {
            setIsLoadingOlder(false);
          }
        }, 500);

        return () => clearTimeout(olderTimeout);
      }
    }
  }, [recentPosts, activeCategory]);
  
  useEffect(() => {
    setCurrentPage(1);
    setAllPosts([]);
  }, [activeCategory]);
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Erreur de chargement</h2>
        <p>Impossible de charger les articles. Veuillez réessayer plus tard.</p>
      </div>
    );
  }
  
  const filteredPosts = allPosts || [];
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <>
      <CategoryTabs 
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
      
      <div className="container mx-auto px-0 sm:px-4 py-8">
        <div className="bg-white p-2 sm:p-6 rounded-lg shadow-sm">
          {isLoadingRecent ? (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pana-red"></div>
                  <span className="text-sm text-gray-600">Chargement des articles récents...</span>
                </div>
              </div>
              <ArticleLoadingSkeleton />
            </div>
          ) : (
            <div>
              <ArticlesContent 
                filteredPosts={filteredPosts} 
                currentPosts={currentPosts} 
                isLoading={false} 
                currentPage={currentPage} 
                totalPages={totalPages} 
                paginate={paginate} 
                getImageUrl={getImageUrl} 
                stripHtml={stripHtml} 
                getSlug={getSlug} 
                truncateText={truncateText} 
              />
              {isLoadingOlder && (
                <div className="text-center mt-6">
                  <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pana-red"></div>
                    <span className="text-sm text-gray-600">Chargement d'articles supplémentaires...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArticlesContainer;
