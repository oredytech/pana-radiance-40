import { useState } from "react";
import { type WordPressPost } from "@/services/wordpress";
import { getSlug, stripHtml } from "@/utils/textUtils";
import ArticleCard from "@/components/articles/ArticleCard";
import ArticleShareDialog from "@/components/articles/ArticleShareDialog";

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
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<{ title: string; slug: string } | null>(null);

  const handleTitleRightClick = (e: React.MouseEvent, post: WordPressPost) => {
    e.preventDefault();
    const articleSlug = post.slug || getSlug(post.title.rendered);
    setSelectedArticle({
      title: stripHtml(post.title.rendered),
      slug: articleSlug
    });
    setShowShareDialog(true);
  };

  const handleImageRightClick = (e: React.MouseEvent, post: WordPressPost) => {
    e.preventDefault();
    const articleSlug = post.slug || getSlug(post.title.rendered);
    setSelectedArticle({
      title: stripHtml(post.title.rendered),
      slug: articleSlug
    });
    setShowShareDialog(true);
  };

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

  const postsToDisplay = posts?.slice(0, displayCount) || [];

  if (postsToDisplay.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun article disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {postsToDisplay.map((post) => (
          <ArticleCard
            key={post.id}
            post={post}
            getImageUrl={getImageUrl}
            stripHtml={stripHtml}
            getSlug={getSlug}
            truncateText={truncateText}
            onTitleRightClick={handleTitleRightClick}
            onImageRightClick={handleImageRightClick}
          />
        ))}
      </div>

      <ArticleShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        selectedArticle={selectedArticle}
      />
    </>
  );
};

export default ArticlesGrid;
