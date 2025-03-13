
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type WordPressPost } from "@/services/wordpress";
import { Link } from "react-router-dom";

interface ArticlesGridProps {
  posts: WordPressPost[];
  isLoading: boolean;
  getImageUrl: (post: WordPressPost) => string;
  stripHtml: (html: string) => string;
  getSlug: (title: string) => string;
  truncateText: (text: string, wordLimit: number) => string;
  displayCount?: number;
}

const ArticlesGrid = ({
  posts,
  isLoading,
  getImageUrl,
  stripHtml,
  getSlug,
  truncateText,
  displayCount = 20,
}: ArticlesGridProps) => {
  if (isLoading) {
    return (
      <div className="h-60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pana-red mx-auto mb-4"></div>
          <p>Chargement des articles...</p>
        </div>
      </div>
    );
  }

  // Make sure we don't try to display more posts than we have
  const postsToDisplay = posts?.slice(0, displayCount) || [];

  if (postsToDisplay.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun article disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {postsToDisplay.map((post) => (
        <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
          <Link to={`/article/${getSlug(post.title.rendered)}`} className="block">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={getImageUrl(post)}
                alt={stripHtml(post.title.rendered)}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <CardHeader className="pb-2">
              {/* Simulated category - would come from WordPress in real implementation */}
              <div className="mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {post.id % 5 === 0 ? "Actualités" : 
                   post.id % 5 === 1 ? "Musique" : 
                   post.id % 5 === 2 ? "Culture" : "Société"}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(post.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
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
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default ArticlesGrid;
