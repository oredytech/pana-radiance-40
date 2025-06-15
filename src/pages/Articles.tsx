
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchRecentPosts, fetchOlderPosts, fetchCategories, fetchPostsByCategory } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { getImageUrl, stripHtml, getSlug, truncateText } from "@/utils/textUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticlesHeader from "@/components/articles/ArticlesHeader";
import CategoryTabs from "@/components/articles/CategoryTabs";
import ArticlesContent from "@/components/articles/ArticlesContent";
import ArticleLoadingSkeleton from "@/components/articles/ArticleLoadingSkeleton";

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || "all");
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const { toast } = useToast();
  const postsPerPage = 12;

  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);
  
  const { data: wpCategories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    meta: {
      onError: () => {
        console.warn("Impossible de charger les catégories");
      }
    }
  });
  
  const categories = [{
    id: "all",
    name: "Tous les articles",
    count: 0
  }, ...(wpCategories?.map(cat => ({
    id: cat.id.toString(),
    name: cat.name,
    count: cat.count
  })) || [])];
  
  if (categories.length > 1 && wpCategories) {
    categories[0].count = wpCategories.reduce((total, cat) => total + cat.count, 0);
  }
  
  // Charger d'abord les articles récents avec une stratégie de cache optimisée
  const { data: recentPosts, isLoading: isLoadingRecent, error } = useQuery({
    queryKey: ["recent-posts", activeCategory],
    queryFn: async () => {
      if (activeCategory === "all") {
        return fetchRecentPosts(20);
      } else {
        return fetchPostsByCategory(parseInt(activeCategory));
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    meta: {
      onError: () => {
        console.warn("Impossible de charger les articles");
      }
    }
  });

  // Charger les articles plus anciens en arrière-plan de manière optimisée
  useEffect(() => {
    if (recentPosts && recentPosts.length > 0 && activeCategory === "all") {
      setAllPosts(recentPosts);
      
      const timeoutId = setTimeout(async () => {
        setIsLoadingOlder(true);
        try {
          const olderPosts = await fetchOlderPosts(2, 40); // Réduire le nombre d'articles
          setAllPosts(prev => [...prev, ...olderPosts]);
        } catch (error) {
          console.warn("Erreur lors du chargement des articles plus anciens:", error);
        } finally {
          setIsLoadingOlder(false);
        }
      }, 500); // Réduire le délai

      return () => clearTimeout(timeoutId);
    } else if (recentPosts) {
      setAllPosts(recentPosts);
    }
  }, [recentPosts, activeCategory]);
  
  useEffect(() => {
    setCurrentPage(1);
    setAllPosts([]);
  }, [activeCategory]);
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Erreur de chargement</h2>
          <p>Impossible de charger les articles. Veuillez réessayer plus tard.</p>
        </div>
        <Footer />
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
  
  if (isCategoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pana-red mx-auto mb-4"></div>
          <p>Chargement des catégories...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="pt-[104px] py-[64px]">
        <ArticlesHeader />
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
      </section>
      
      <Footer />
    </div>
  );
};

export default Articles;
