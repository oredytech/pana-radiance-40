
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
}

const ArticlesGrid = ({
  posts,
  isLoading,
  getImageUrl,
  stripHtml,
  getSlug,
  truncateText,
}: ArticlesGridProps) => {
  if (isLoading) {
    return <div>Chargement des articles...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts?.slice(0, 20).map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <Link to={`/article/${getSlug(post.title.rendered)}`} className="block">
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
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default ArticlesGrid;
