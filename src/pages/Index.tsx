import Header from "@/components/Header";
import RadioPlayer from "@/components/RadioPlayer";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import ArticlesGrid from "@/components/ArticlesGrid";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { getImageUrl, stripHtml, getSlug, truncateText } from "@/utils/textUtils";

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
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <BlogPreview />
        </div>
      </section>

      {/* More Articles Section */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Articles Grid */}
            <div className="lg:w-3/4">
              <ArticlesGrid
                posts={posts || []}
                isLoading={isLoading}
                getImageUrl={getImageUrl}
                stripHtml={stripHtml}
                getSlug={getSlug}
                truncateText={truncateText}
              />
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <Sidebar />
            </div>
          </div>
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