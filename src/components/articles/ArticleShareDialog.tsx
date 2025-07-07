
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Share, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ArticleShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArticle: { title: string; slug: string } | null;
}

const ArticleShareDialog = ({ isOpen, onClose, selectedArticle }: ArticleShareDialogProps) => {
  const { toast } = useToast();

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
      onClose();
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
      onClose();
    }
  };

  if (!selectedArticle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                const shareUrl = getShareUrl(selectedArticle.slug);
                window.open(`https://wa.me/?text=${encodeURIComponent(selectedArticle.title + ' - ' + shareUrl)}`, '_blank');
                onClose();
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
                onClose();
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
                onClose();
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
                onClose();
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
                  }).then(() => onClose())
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
  );
};

export default ArticleShareDialog;
