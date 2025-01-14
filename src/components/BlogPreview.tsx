import { useQuery } from "@tanstack/react-query";
import { fetchPosts, type WordPressPost } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";

const BlogPreview = () => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>Chargement des articles...</div>
      </div>
    );
  }

  if (!posts) {
    return null;
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 7);

  const getImageUrl = (post: WordPressPost) => {
    return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
      "https://source.unsplash.com/random/800x600/?african-music";
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2.5">
        {/* Featured Post */}
        <a 
          href="#" 
          className="lg:col-span-3 relative group aspect-[16/9] overflow-hidden rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            console.log(`Clicked featured article ${featuredPost.id}`);
          }}
        >
          <img
            src={getImageUrl(featuredPost)}
            alt={stripHtml(featuredPost.title.rendered)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h3 className="text-2xl font-bold mb-2 group-hover:underline">
              {stripHtml(featuredPost.title.rendered)}
            </h3>
            <p className="text-sm text-white/90">
              {new Date(featuredPost.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </a>

        {/* Other Posts Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-2.5">
          {otherPosts.map((post) => (
            <a
              key={post.id}
              href="#"
              className="relative group aspect-[4/3] overflow-hidden rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                console.log(`Clicked article ${post.id}`);
              }}
            >
              <img
                src={getImageUrl(post)}
                alt={stripHtml(post.title.rendered)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
              <h3 className="absolute bottom-4 left-4 right-4 text-white font-semibold text-sm line-clamp-2 group-hover:underline">
                {stripHtml(post.title.rendered)}
              </h3>
            </a>
          ))}
        </div>
      </div>

      {/* Advertisement Banner */}
      <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Publicité
            </h3>
            <p className="text-gray-600">
              Espace réservé pour votre publicité
            </p>
          </div>
          <Button 
            onClick={() => console.log("Clicked advertisement CTA")}
            className="bg-pana-purple hover:bg-pana-purple/90 text-white"
          >
            En savoir plus
          </Button>
        </div>
      </div>

      {/* Podcast Banner */}
      <div className="mt-8 rounded-lg bg-gradient-to-r from-pana-purple to-pana-red p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Headphones className="w-12 h-12" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Découvrez nos podcasts</h3>
              <p className="text-white/90">Restez à l'écoute de l'actualité africaine en podcast</p>
            </div>
          </div>
          <Button 
            onClick={() => console.log("Clicked podcast CTA")}
            className="bg-white text-pana-purple hover:bg-white/90 transition-colors"
          >
            Écouter maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;