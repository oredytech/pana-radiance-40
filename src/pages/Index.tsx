
import Header from "@/components/Header";
import RadioPlayer from "@/components/RadioPlayer";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ArticlesGrid from "@/components/ArticlesGrid";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { getImageUrl, stripHtml, getSlug, truncateText } from "@/utils/textUtils";
import AdvertisementSection from "@/components/AdvertisementSection";
import YouTubeVideoSection from "@/components/YouTubeVideoSection";

const Index = () => {
  const { toast } = useToast();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Latest Articles Section */}
      <section className="pt-[104px] pb-12 px-4">
        <div className="container mx-auto">
          <BlogPreview />
        </div>
      </section>

      {/* More Articles Section */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="container mx-auto">
          {/* Articles Grid - Full width with no title or sidebar */}
          <div className="w-full">
            <ArticlesGrid
              posts={posts || []}
              isLoading={isLoading}
              getImageUrl={getImageUrl}
              stripHtml={stripHtml}
              getSlug={getSlug}
              truncateText={truncateText}
              displayCount={9}
            />
          </div>
        </div>
      </section>

      {/* Advertisement Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <AdvertisementSection />
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <YouTubeVideoSection />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Contact />
        </div>
      </section>

      <div className="pb-[70px]">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
