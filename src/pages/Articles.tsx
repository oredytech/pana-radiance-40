import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchCategories, fetchPostsByCategory } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { getImageUrl, stripHtml, getSlug, truncateText } from "@/utils/textUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticlesHeader from "@/components/articles/ArticlesHeader";
import CategoryTabs from "@/components/articles/CategoryTabs";
import ArticlesContent from "@/components/articles/ArticlesContent";
const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const {
    toast
  } = useToast();
  const postsPerPage = 12;
  const {
    data: wpCategories,
    isLoading: isCategoriesLoading
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    meta: {
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger les catégories",
          variant: "destructive"
        });
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
  const {
    data: posts,
    isLoading,
    error
  } = useQuery({
    queryKey: ["posts", activeCategory],
    queryFn: async () => {
      if (activeCategory === "all") {
        return fetchPosts();
      } else {
        return fetchPostsByCategory(parseInt(activeCategory));
      }
    },
    meta: {
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger les articles",
          variant: "destructive"
        });
      }
    }
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);
  if (error) {
    return <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Erreur de chargement</h2>
          <p>Impossible de charger les articles. Veuillez réessayer plus tard.</p>
        </div>
        <Footer />
      </div>;
  }
  const filteredPosts = posts || [];
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
    return <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pana-red mx-auto mb-4"></div>
          <p>Chargement des catégories...</p>
        </div>
        <Footer />
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="pt-[104px] py-[65px]">
        <ArticlesHeader />
        <CategoryTabs categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        
        <div className="container mx-auto px-0 sm:px-4 py-8">
          <div className="bg-white p-2 sm:p-6 rounded-lg shadow-sm">
            <ArticlesContent filteredPosts={filteredPosts} currentPosts={currentPosts} isLoading={isLoading} currentPage={currentPage} totalPages={totalPages} paginate={paginate} getImageUrl={getImageUrl} stripHtml={stripHtml} getSlug={getSlug} truncateText={truncateText} />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default Articles;