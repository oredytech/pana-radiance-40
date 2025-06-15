
import Header from "@/components/Header";
import RadioPlayer from "@/components/RadioPlayer";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ArticlesGrid from "@/components/ArticlesGrid";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentPosts, fetchOlderPosts, fetchCategories } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { getImageUrl, stripHtml, getSlug, truncateText } from "@/utils/textUtils";
import AdvertisementSection from "@/components/AdvertisementSection";
import YouTubeSubscriptionCTA from "@/components/YouTubeVideoSection";
import PodcastSection from "@/components/PodcastSection";
import { useState, useEffect } from "react";
import CategoryTabs from "@/components/articles/CategoryTabs";
import ArticleLoadingSkeleton from "@/components/articles/ArticleLoadingSkeleton";

const Index = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  const { data: wpCategories } = useQuery({
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
  const { data: recentPosts, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recent-posts"],
    queryFn: () => fetchRecentPosts(20),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    meta: {
      onError: () => {
        console.warn("Impossible de charger les articles récents");
      }
    }
  });

  // Charger les articles plus anciens en arrière-plan de manière optimisée
  useEffect(() => {
    if (recentPosts && recentPosts.length > 0) {
      setAllPosts(recentPosts);

      // Réduire le délai et optimiser le chargement des articles plus anciens
      const timeoutId = setTimeout(async () => {
        setIsLoadingOlder(true);
        try {
          const olderPosts = await fetchOlderPosts(2, 40); // Réduire le nombre d'articles à charger
          setAllPosts(prev => [...prev, ...olderPosts]);
        } catch (error) {
          console.warn("Erreur lors du chargement des articles plus anciens:", error);
        } finally {
          setIsLoadingOlder(false);
        }
      }, 500); // Réduire le délai à 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [recentPosts]);

  const articlesForGrid = allPosts ? allPosts.slice(5, 17) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-[80px] py-[20px]">
      <Header />

      <section className="pt-[95px] pb-5 px-4 py-[95px]">
        <div className="container mx-auto px-0">
          <BlogPreview />
        </div>
      </section>

      <section className="px-4 bg-gray-100 py-[3px]">
        <div className="container mx-auto px-0">
          <div className="w-full">
            <CategoryTabs 
              categories={categories.slice(0, 5)} 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory}
            >
              {isLoadingRecent ? (
                <div className="mt-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pana-red"></div>
                      <span className="text-sm text-gray-600">Chargement des articles récents...</span>
                    </div>
                  </div>
                  <ArticleLoadingSkeleton />
                </div>
              ) : (
                <div className="mt-6">
                  <ArticlesGrid 
                    posts={articlesForGrid} 
                    isLoading={false} 
                    getImageUrl={getImageUrl} 
                    stripHtml={stripHtml} 
                    getSlug={getSlug} 
                    truncateText={truncateText} 
                    displayCount={12} 
                  />
                  {isLoadingOlder && (
                    <div className="text-center mt-6">
                      <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pana-red"></div>
                        <span className="text-sm text-gray-600">Chargement d'articles supplémentaires...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CategoryTabs>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto px-0">
          <AdvertisementSection />
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto px-0">
          <YouTubeSubscriptionCTA />
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto px-0">
          <PodcastSection />
        </div>
      </section>

      <section id="contact" className="py-12 px-4">
        <div className="container mx-auto px-0">
          <Contact />
        </div>
      </section>

      <div className="pb-4 py-0">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
