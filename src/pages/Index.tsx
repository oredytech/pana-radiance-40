import Header from "@/components/Header";
import RadioPlayer from "@/components/RadioPlayer";
import FeaturedContent from "@/components/FeaturedContent";
import ProgramSchedule from "@/components/ProgramSchedule";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, type WordPressPost } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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

  const getImageUrl = (post: WordPressPost) => {
    return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
      "https://source.unsplash.com/random/800x600/?african-music";
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Radio Player */}
      <section className="py-12 px-4 bg-gradient-to-br from-pana-red to-pana-purple">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              PANA RADIO
            </h1>
            <p className="text-xl text-white/90">
              La voix de l'Afrique, en direct et en podcast
            </p>
          </div>
          <RadioPlayer />
        </div>
      </section>

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
              {isLoading ? (
                <div>Chargement des articles...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {posts?.slice(5, 20).map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <a href={`/article/${post.id}`}>
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={getImageUrl(post)}
                            alt={stripHtml(post.title.rendered)}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                        </div>
                        <CardHeader>
                          <h3 className="font-semibold text-lg line-clamp-2 hover:text-pana-purple transition-colors">
                            {truncateText(stripHtml(post.title.rendered), 20)}
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 text-sm line-clamp-4">
                            {truncateText(stripHtml(post.excerpt.rendered), 100)}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full hover:bg-pana-purple hover:text-white transition-colors"
                          >
                            Lire plus
                          </Button>
                        </CardFooter>
                      </a>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Nos Programmes
          </h2>
          <FeaturedContent />
        </div>
      </section>

      {/* Program Schedule Section */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="container mx-auto">
          <ProgramSchedule />
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
