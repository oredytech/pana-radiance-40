
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
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Fetch categories
  const { data: wpCategories } = useQuery({
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
  
  // Create categories array with "all" category
  const categories = [
    { id: "all", name: "Tous les articles", count: 0 },
    ...(wpCategories?.map(cat => ({ 
      id: cat.id.toString(), 
      name: cat.name,
      count: cat.count 
    })) || [])
  ];

  // Update the "all" category count
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

  // Get articles from index 5 to 17 (12 articles after the first 5)
  const articlesForGrid = posts ? posts.slice(5, 17) : [];
  
  return <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Latest Articles Section */}
      <section className="pt-[104px] pb-12 px-4">
        <div className="container mx-auto px-0">
          <BlogPreview />
        </div>
      </section>

      {/* More Articles Section */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="container mx-auto px-0">
          <h2 className="text-2xl font-bold mb-8">Plus d'actualités</h2>
          <div className="w-full">
            <CategoryTabs
              categories={categories.slice(0, 5)} // Only show first 5 categories to keep it clean
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            >
              <ArticlesGrid posts={articlesForGrid} isLoading={isLoading} getImageUrl={getImageUrl} stripHtml={stripHtml} getSlug={getSlug} truncateText={truncateText} displayCount={12} />
            </CategoryTabs>
          </div>
        </div>
      </section>

      {/* Advertisement Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto px-0">
          <AdvertisementSection />
        </div>
      </section>

      {/* YouTube Subscription CTA Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto px-0">
          <YouTubeSubscriptionCTA />
        </div>
      </section>

      {/* Podcasts Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto px-0">
          <PodcastSection />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
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
