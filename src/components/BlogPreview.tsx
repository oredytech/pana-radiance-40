import { useQuery } from "@tanstack/react-query";
import { fetchCategories, type WordPressPost } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl, stripHtml, getSlug } from "@/utils/textUtils";

const BlogPreview = () => {
  const { toast } = useToast();
  
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Properly typed query for blog preview posts
  const { data: blogPosts } = useQuery<WordPressPost[]>({
    queryKey: ["blog-preview-posts"],
    staleTime: 0,
    gcTime: 0,
  });

  if (!blogPosts || blogPosts.length === 0) {
    return null; // Ne rien afficher si pas d'articles
  }

  const mainArticle = blogPosts[0];
  const otherArticles = blogPosts.slice(1, 5); // Get only 4 more articles for a total of 5

  const getArticleCategory = (post: WordPressPost) => {
    if (!post._embedded?.["wp:term"]?.[0] || !categories) {
      return "ACTUALITÉS";
    }
    
    const postCategories = post._embedded["wp:term"][0];
    if (postCategories.length > 0) {
      const categoryName = postCategories[0].name.toUpperCase();
      return categoryName;
    }
    
    return "ACTUALITÉS";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        {/* Main Article - Takes the left side on desktop, full width on mobile */}
        <div className="lg:col-span-4 h-full flex">
          <Link
            to={`/${getSlug(mainArticle.title.rendered)}`}
            className="relative group aspect-video lg:aspect-auto lg:h-full w-full overflow-hidden rounded-lg block"
          >
            <img
              src={getImageUrl(mainArticle)}
              alt={stripHtml(mainArticle.title.rendered)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
            
            <div className="absolute top-3 left-3 bg-pana-red px-2 py-0.5 text-white text-xs font-bold">
              {getArticleCategory(mainArticle)}
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:underline">
                {stripHtml(mainArticle.title.rendered)}
              </h3>
              <div className="flex items-center text-xs text-white/80 mt-2">
                <span>{formatDate(mainArticle.date)}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right side with 4 articles in a 2x2 grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {otherArticles.map((post) => (
            <Link
              key={post.id}
              to={`/${getSlug(post.title.rendered)}`}
              className="relative group aspect-video md:aspect-[4/3] overflow-hidden rounded-lg"
            >
              <img
                src={getImageUrl(post)}
                alt={stripHtml(post.title.rendered)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
              
              <div className="absolute top-3 left-3 bg-pana-red px-2 py-0.5 text-white text-xs font-bold">
                {getArticleCategory(post)}
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-base md:text-lg font-bold line-clamp-2 group-hover:underline">
                  {stripHtml(post.title.rendered)}
                </h3>
                <div className="flex items-center text-xs text-white/80 mt-2">
                  <span>{formatDate(post.date)}</span>
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
          <Link to="/podcasts">
            <Button 
              className="bg-white text-pana-purple hover:bg-white/90 transition-colors"
            >
              Écouter maintenant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
