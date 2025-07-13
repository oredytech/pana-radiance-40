
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type WordPressPost } from "@/services/wordpress";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  post: WordPressPost;
  getImageUrl: (post: WordPressPost) => string;
  stripHtml: (html: string) => string;
  getSlug: (title: string) => string;
  truncateText: (text: string, wordLimit: number) => string;
  onTitleRightClick: (e: React.MouseEvent, post: WordPressPost) => void;
  onImageRightClick: (e: React.MouseEvent, post: WordPressPost) => void;
}

const ArticleCard = ({
  post,
  getImageUrl,
  stripHtml,
  getSlug,
  truncateText,
  onTitleRightClick,
  onImageRightClick,
}: ArticleCardProps) => {
  const getCategoryName = (post: WordPressPost): string => {
    if (post._embedded && post._embedded['wp:term']) {
      const categories = post._embedded['wp:term'].find(
        terms => terms.length > 0 && terms[0].taxonomy === 'category'
      );
      if (categories && categories.length > 0) {
        return categories[0].name;
      }
    }
    
    return post.id % 5 === 0 ? "Actualités" : 
           post.id % 5 === 1 ? "Musique" : 
           post.id % 5 === 2 ? "Culture" : "Société";
  };

  // Utiliser le vrai slug WordPress si disponible, sinon générer un slug
  const articleSlug = post.slug || getSlug(post.title.rendered);
  const articleLink = `/${articleSlug}`;
  
  console.log('Article Card mapping:', {
    id: post.id,
    title: stripHtml(post.title.rendered),
    originalSlug: post.slug,
    generatedSlug: getSlug(post.title.rendered),
    finalSlug: articleSlug,
    link: articleLink
  });

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link to={articleLink} className="block">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={getImageUrl(post)}
            alt={stripHtml(post.title.rendered)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 cursor-pointer select-none"
            onContextMenu={(e) => onImageRightClick(e, post)}
            title="Clic droit pour partager l'article"
          />
        </div>
        <CardHeader className="pb-2">
          <div className="mb-2">
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {getCategoryName(post)}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {new Date(post.date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <h3 
            className="font-semibold text-lg line-clamp-2 hover:text-pana-purple transition-colors cursor-pointer select-none"
            onContextMenu={(e) => onTitleRightClick(e, post)}
            title="Clic droit pour partager l'article"
          >
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
  );
};

export default ArticleCard;
