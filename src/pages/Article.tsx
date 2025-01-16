import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, type WordPressPost } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Article = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
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

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getSlug = (title: string) => {
    return stripHtml(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (isLoadingPosts) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            Chargement...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const post = posts?.find(p => getSlug(p.title.rendered) === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Article non trouvé</h1>
            <p className="text-gray-600">Désolé, l'article que vous recherchez n'existe pas ou a été déplacé.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
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
            alt={stripHtml(post.title.rendered)}
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