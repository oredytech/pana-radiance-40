
import { useQuery } from "@tanstack/react-query";
import { fetchRecentPosts } from "@/services/wordpress";
import { stripHtml, getSlug, getImageUrl } from "@/utils/textUtils";
import { Link } from "react-router-dom";
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
import { Button } from "@/components/ui/button";

const ScrollingNewsBanner = () => {
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<{ title: string; slug: string } | null>(null);
  
  const {
    data: recentPosts
  } = useQuery({
    queryKey: ["recent-posts-banner"],
    queryFn: () => fetchRecentPosts(10),
    staleTime: 5 * 60 * 1000,
    // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  const handleTitleRightClick = (e: React.MouseEvent, post: any) => {
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

  if (!recentPosts || recentPosts.length === 0) {
    return null;
  }

  // Créer plusieurs copies pour un défilement vraiment infini
  const repeatedPosts = Array(5).fill(recentPosts).flat();
  
  return (
    <>
      <div className="bg-pana-red text-white py-1 overflow-hidden relative h-[20px]">
        <div className="flex items-center h-full">
          {/* Titre fixe à gauche avec un style amélioré */}
          <div className="bg-gradient-to-r from-white to-gray-100 text-pana-red py-0.5 font-bold text-xs whitespace-nowrap mr-3 z-10 rounded-r-lg shadow-md border-l-4 border-yellow-400 px-[32px]">
            À LA UNE
          </div>
          
          {/* Contenu défilant */}
          <div className="flex animate-scroll whitespace-nowrap h-full items-center">
            {repeatedPosts.map((post, index) => (
              <Link 
                key={`${post.id}-${index}`} 
                to={`/${getSlug(post.title.rendered)}`} 
                className="inline-flex items-center mx-4 hover:text-gray-200 transition-colors duration-200 h-full"
              >
                <img src={getImageUrl(post)} alt="" className="w-4 h-4 rounded object-cover mr-2 flex-shrink-0" />
                <span 
                  className="text-xs font-medium truncate cursor-pointer select-none"
                  onContextMenu={(e) => handleTitleRightClick(e, post)}
                  title="Clic droit pour partager l'article"
                >
                  {stripHtml(post.title.rendered)}
                </span>
              </Link>
            ))}
          </div>
        </div>
        
        <style>
          {`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.33%);
              }
            }
            .animate-scroll {
              animation: scroll 120s linear infinite;
            }
          `}
        </style>
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

export default ScrollingNewsBanner;
