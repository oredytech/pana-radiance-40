
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type WordPressPost } from "@/services/wordpress";
import { Link } from "react-router-dom";
import { usePosts } from '@/hooks/usePosts';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Instagram, Linkedin, Share, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<{ title: string; slug: string } | null>(null);

  const handleTitleRightClick = (e: React.MouseEvent, post: WordPressPost) => {
    e.preventDefault();
    setSelectedArticle({
      title: stripHtml(post.title.rendered),
      slug: getSlug(post.title.rendered)
    });
    setShowShareDialog(true);
  };

  const getShareUrl = (slug: string) => {
    return `https://panaradio.net/${slug}`;
  };

  const handleCopyLink = async () => {
    if (!selectedArticle) return;
    
    const shareUrl = getShareUrl(selectedArticle.slug);
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien de l'article a été copié dans le presse-papier.",
      });
      setShowShareDialog(false);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Lien copié !",
        description: "Le lien de l'article a été copié dans le presse-papier.",
      });
      setShowShareDialog(false);
    }
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

  // Make sure we don't try to display more posts than we have
  const postsToDisplay = posts?.slice(0, displayCount) || [];

  if (postsToDisplay.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun article disponible pour le moment.</p>
      </div>
    );
  }

  const getCategoryName = (post: WordPressPost): string => {
    if (post._embedded && post._embedded['wp:term']) {
      const categories = post._embedded['wp:term'].find(
        terms => terms.length > 0 && terms[0].taxonomy === 'category'
      );
      if (categories && categories.length > 0) {
        return categories[0].name;
      }
    }
    
    // Fallback to mock categories if real ones aren't available
    return post.id % 5 === 0 ? "Actualités" : 
           post.id % 5 === 1 ? "Musique" : 
           post.id % 5 === 2 ? "Culture" : "Société";
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {postsToDisplay.map((post) => {
          const articleSlug = getSlug(post.title.rendered);
          // Nouveau format de lien sans le préfixe /article
          const articleLink = `/${articleSlug}`;
          
          return (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <Link to={articleLink} className="block">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={getImageUrl(post)}
                    alt={stripHtml(post.title.rendered)}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
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
                    onContextMenu={(e) => handleTitleRightClick(e, post)}
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
        })}
      </div>

      {/* Dialog de partage */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Partage de l'article</DialogTitle>
            <DialogDescription>
              Vous n'êtes pas autorisé à copier le contenu de l'article, mais à partager son lien.
            </DialogDescription>
          </DialogHeader>
          
          {selectedArticle && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <Button 
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-[#25D366] hover:bg-[#25D366]/80 text-white border-none"
                  onClick={() => {
                    const shareUrl = getShareUrl(selectedArticle.slug);
                    window.open(`https://wa.me/?text=${encodeURIComponent(selectedArticle.title + ' - ' + shareUrl)}`, '_blank');
                    setShowShareDialog(false);
                  }}
                >
                  <MessageCircle />
                </Button>
                
                <Button 
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-[#1877F2] hover:bg-[#1877F2]/80 text-white border-none"
                  onClick={() => {
                    const shareUrl = getShareUrl(selectedArticle.slug);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                    setShowShareDialog(false);
                  }}
                >
                  <Facebook />
                </Button>
                
                <Button 
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-[#E4405F] hover:bg-[#E4405F]/80 text-white border-none"
                  onClick={() => {
                    window.open(`https://www.instagram.com/`, '_blank');
                    setShowShareDialog(false);
                  }}
                >
                  <Instagram />
                </Button>
                
                <Button 
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-[#0077B5] hover:bg-[#0077B5]/80 text-white border-none"
                  onClick={() => {
                    const shareUrl = getShareUrl(selectedArticle.slug);
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
                    setShowShareDialog(false);
                  }}
                >
                  <Linkedin />
                </Button>
                
                <Button 
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gray-700 hover:bg-gray-700/80 text-white border-none"
                  onClick={() => {
                    const shareUrl = getShareUrl(selectedArticle.slug);
                    if (navigator.share) {
                      navigator.share({
                        title: selectedArticle.title,
                        url: shareUrl
                      }).then(() => setShowShareDialog(false))
                      .catch(err => console.error("Error sharing:", err));
                    } else {
                      handleCopyLink();
                    }
                  }}
                >
                  <Share />
                </Button>
              </div>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleCopyLink}
              >
                Copier le lien
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArticlesGrid;
