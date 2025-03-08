
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, type WordPressPost } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl, stripHtml, getSlug } from "@/utils/textUtils";

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

  const mainArticle = posts[0];
  const otherArticles = posts.slice(1, 5); // Get only 4 more articles for a total of 5

  const getCategory = (index: number) => {
    const categories = ['TOTALEMENT SPORT', 'TOTALEMENT POLITIQUE', 'BREAKING NEWS', 'TOTALEMENT SPORT', 'TOTALEMENT CULTURE'];
    return categories[index];
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        {/* Main Article - Takes the left side on desktop, full width on mobile */}
        <div className="lg:col-span-4 h-full flex">
          <Link
            to={`/article/${getSlug(mainArticle.title.rendered)}`}
            className="relative group aspect-video lg:aspect-auto lg:h-full w-full overflow-hidden rounded-lg block"
          >
            <img
              src={getImageUrl(mainArticle)}
              alt={stripHtml(mainArticle.title.rendered)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
            
            <div className="absolute top-3 left-3 bg-pana-red px-2 py-0.5 text-white text-xs font-bold">
              {getCategory(0)}
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:underline">
                {stripHtml(mainArticle.title.rendered)}
              </h3>
              <div className="flex items-center text-xs text-white/80 mt-2">
                <span>7 mars 2025</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right side with 4 articles in a 2x2 grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {otherArticles.map((post, index) => (
            <Link
              key={post.id}
              to={`/article/${getSlug(post.title.rendered)}`}
              className="relative group aspect-video md:aspect-[4/3] overflow-hidden rounded-lg"
            >
              <img
                src={getImageUrl(post)}
                alt={stripHtml(post.title.rendered)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
              
              <div className="absolute top-3 left-3 bg-pana-red px-2 py-0.5 text-white text-xs font-bold">
                {getCategory(index + 1)}
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-base md:text-lg font-bold line-clamp-2 group-hover:underline">
                  {stripHtml(post.title.rendered)}
                </h3>
                <div className="flex items-center text-xs text-white/80 mt-2">
                  <span>{index === 0 ? '6 mars 2025' : index === 1 ? '5 mars 2025' : index === 2 ? '4 mars 2025' : '28 février 2025'}</span>
                </div>
              </div>
            </Link>
          ))}
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
