
import React from 'react';
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Share, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ArticleShareButtonsProps {
  title: string;
  url: string;
}

const ArticleShareButtons = ({ title, url }: ArticleShareButtonsProps) => {
  const { toast } = useToast();
  
  // Construire l'URL avec le domaine panaradio.net
  const getShareUrl = () => {
    // Extraire le slug de l'URL actuelle
    const currentPath = window.location.pathname;
    let slug = '';
    
    if (currentPath.startsWith('/article/')) {
      slug = currentPath.replace('/article/', '');
    } else if (currentPath.startsWith('/')) {
      // Si on est déjà sur une URL sans /article, utiliser le path directement
      slug = currentPath.slice(1);
    }
    
    // Retourner l'URL avec le domaine panaradio.net
    return `https://panaradio.net/${slug}`;
  };
  
  const shareUrl = getShareUrl();
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Lien copié !",
        description: "Le lien de l'article a été copié dans le presse-papier.",
      });
    });
  };

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3">Partager cet article</h3>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full bg-[#25D366] hover:bg-[#25D366]/80 text-white border-none"
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(title + ' - ' + shareUrl)}`, '_blank')}
        >
          <MessageCircle />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full bg-[#1877F2] hover:bg-[#1877F2]/80 text-white border-none"
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
        >
          <Facebook />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full bg-[#E4405F] hover:bg-[#E4405F]/80 text-white border-none"
          onClick={() => window.open(`https://www.instagram.com/`, '_blank')}
        >
          <Instagram />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full bg-[#0077B5] hover:bg-[#0077B5]/80 text-white border-none"
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
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
              }).catch(err => console.error("Error sharing:", err));
            } else {
              handleCopyLink();
            }
          }}
        >
          <Share />
        </Button>
        <Button 
          variant="outline"
          size="sm"
          className="text-gray-700 hover:bg-gray-100 ml-auto"
          onClick={handleCopyLink}
        >
          Copier le lien
        </Button>
      </div>
    </div>
  );
};

export default ArticleShareButtons;
