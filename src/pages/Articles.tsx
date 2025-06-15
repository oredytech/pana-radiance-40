
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RefreshIndicator from "@/components/RefreshIndicator";
import ArticlesHeader from "@/components/articles/ArticlesHeader";
import ArticlesContainer from "@/components/articles/ArticlesContainer";
import { useGlobalRefresh } from "@/hooks/useGlobalRefresh";

const Articles = () => {
  // Utiliser le nouveau système de rafraîchissement global
  const { isRefreshing, hasNewContent, startRefresh, applyUpdates } = useGlobalRefresh();

  const { data: wpCategories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
      <RefreshIndicator 
        isRefreshing={isRefreshing} 
        onRefresh={startRefresh}
        onComplete={applyUpdates}
      />
      
      <section className="pt-[104px] py-[64px]">
        <ArticlesHeader />
        <ArticlesContainer categories={categories} />
      </section>
      
      <Footer />
    </div>
  );
};

export default Articles;
