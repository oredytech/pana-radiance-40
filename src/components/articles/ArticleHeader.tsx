
import React, { useState } from 'react';
import { type WordPressPost } from "@/services/wordpress";
import { getImageUrl, stripHtml } from "@/utils/textUtils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Share, MessageCircle } from "lucide-react";

interface ArticleHeaderProps {
  post: WordPressPost;
}

const ArticleHeader = ({ post }: ArticleHeaderProps) => {
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleTitleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowShareDialog(true);
  };

  const getShareUrl = () => {
    const currentPath = window.location.pathname;
    let slug = '';
    
    if (currentPath.startsWith('/article/')) {
      slug = currentPath.replace('/article/', '');
    } else if (currentPath.startsWith('/')) {
      slug = currentPath.slice(1);
    }
    
    return `https://panaradio.net/${slug}`;
  };

  const shareUrl = getShareUrl();
  const title = stripHtml(post.title.rendered);

  const handleCopyLink = async () => {
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

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        {/* Titre de l'article affiché avant l'image */}
        <div className="p-6 pb-4">
          <h1 
            className="text-3xl font-bold text-gray-900 leading-tight cursor-pointer hover:text-pana-purple transition-colors select-none"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
            onContextMenu={handleTitleRightClick}
            title="Clic droit pour partager l'article"
          />
        </div>
        
        {/* Image mise en avant */}
        <img
          src={getImageUrl(post)}
          alt={stripHtml(post.title.rendered)}
          className="w-full h-[400px] object-cover"
        />
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
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button 
                variant="outline"
                size="icon"
                className="rounded-full bg-[#25D366] hover:bg-[#25D366]/80 text-white border-none"
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(title + ' - ' + shareUrl)}`, '_blank');
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
                  if (navigator.share) {
                    navigator.share({
                      title: title,
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArticleHeader;
