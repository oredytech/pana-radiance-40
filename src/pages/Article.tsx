import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPost, type WordPressPost } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Article = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id as string),
    meta: {
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'article",
          variant: "destructive",
        });
      },
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!post) {
    return <div>Article non trouvé</div>;
  }

  const getImageUrl = (post: WordPressPost) => {
    return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
      "https://source.unsplash.com/random/800x600/?african-music";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={getImageUrl(post)}
            alt={post.title.rendered}
            className="w-full h-[400px] object-cover"
          />
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4" 
              dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
            />
            <div className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>
        </article>
      </main>
      <div className="pb-[70px]">
        <Footer />
      </div>
    </div>
  );
};

export default Article;