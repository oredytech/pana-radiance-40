
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { getImageUrl, stripHtml, getSlug, truncateText } from "@/utils/textUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticlesHeader from "@/components/articles/ArticlesHeader";
import CategoryTabs from "@/components/articles/CategoryTabs";
import ArticlesContent from "@/components/articles/ArticlesContent";

// Mock categories for now - in a real app, these would come from WordPress
const categories = [
  { id: "all", name: "Tous les articles" },
  { id: "actualites", name: "Actualités" },
  { id: "musique", name: "Musique" },
  { id: "culture", name: "Culture" },
  { id: "societe", name: "Société" }
];

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();
  const postsPerPage = 12;

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    meta: {
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger les articles",
          variant: "destructive",
        });
      },
    },
  });

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

  // Filter posts by category (in a real app, this would use WordPress category IDs)
  // For now, we'll just simulate categories by dividing the posts
  const getFilteredPosts = () => {
    if (!posts) return [];
    
    if (activeCategory === "all") return posts;
    
    // Mock category filtering (in a real app, posts would have category data)
    switch (activeCategory) {
      case "actualites":
        return posts.filter((_, index) => index % 5 === 0);
      case "musique":
        return posts.filter((_, index) => index % 5 === 1);
      case "culture":
        return posts.filter((_, index) => index % 5 === 2);
      case "societe":
        return posts.filter((_, index) => index % 5 === 3 || index % 5 === 4);
      default:
        return posts;
    }
  };

  const filteredPosts = getFilteredPosts();
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  // Get current page posts
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="pt-[104px] pb-12 px-4">
        <ArticlesHeader />
        
        <div className="container mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            >
              <ArticlesContent
                filteredPosts={filteredPosts}
                currentPosts={currentPosts}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
                getImageUrl={getImageUrl}
                stripHtml={stripHtml}
                getSlug={getSlug}
                truncateText={truncateText}
              />
            </CategoryTabs>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Articles;
