import Header from "@/components/Header";
import RadioPlayer from "@/components/RadioPlayer";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ArticlesGrid from "@/components/ArticlesGrid";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchCategories } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { getImageUrl, stripHtml, getSlug, truncateText } from "@/utils/textUtils";
import AdvertisementSection from "@/components/AdvertisementSection";
import YouTubeSubscriptionCTA from "@/components/YouTubeVideoSection";
import PodcastSection from "@/components/PodcastSection";
import { useState } from "react";
import CategoryTabs from "@/components/articles/CategoryTabs";

const Index = () => {
  const {
    toast
  } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");

  const {
    data: wpCategories
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
    queryKey: ["posts"],
    queryFn: fetchPosts,
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

  const articlesForGrid = posts ? posts.slice(5, 17) : [];

  return <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="pt-[104px] pb-12 px-4">
        <div className="container mx-auto px-0">
          <BlogPreview />
        </div>
      </section>

      <section className="px-4 bg-gray-100 py-0">
        <div className="container mx-auto px-0">
          
          <div className="w-full">
            <CategoryTabs categories={categories.slice(0, 5)} activeCategory={activeCategory} setActiveCategory={setActiveCategory}>
              <ArticlesGrid posts={articlesForGrid} isLoading={isLoading} getImageUrl={getImageUrl} stripHtml={stripHtml} getSlug={getSlug} truncateText={truncateText} displayCount={12} />
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

      <div className="pb-[70px]">
        <Footer />
      </div>
    </div>;
};

export default Index;
