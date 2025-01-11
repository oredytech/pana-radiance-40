import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, type WordPressPost } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";

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
        <h2 className="text-2xl font-bold text-pana-purple">Chargement des articles...</h2>
      </div>
    );
  }

  if (!posts) {
    return null;
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 5);

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pana-purple">Derniers Articles</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Featured Post */}
        <Card className="lg:col-span-3 overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <img
            src={getImageUrl(featuredPost)}
            alt={stripHtml(featuredPost.title.rendered)}
            className="w-full h-[400px] object-cover"
          />
          <CardHeader>
            <CardTitle className="text-2xl">
              {stripHtml(featuredPost.title.rendered)}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {new Date(featuredPost.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {stripHtml(featuredPost.excerpt.rendered)}
            </p>
            <Button
              variant="outline"
              className="w-full hover:bg-pana-red hover:text-white transition-colors"
            >
              Lire la suite
            </Button>
          </CardContent>
        </Card>

        {/* Other Posts Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          {otherPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <img
                src={getImageUrl(post)}
                alt={stripHtml(post.title.rendered)}
                className="w-full h-32 object-cover"
              />
              <CardHeader className="p-4">
                <CardTitle className="text-sm">
                  {stripHtml(post.title.rendered)}
                </CardTitle>
                <p className="text-xs text-gray-500">
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;