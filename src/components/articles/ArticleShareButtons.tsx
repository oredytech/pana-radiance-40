
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
  
  // S'assurer que l'URL est complète avec le domaine
  const getFullUrl = () => {
    // Si l'URL contient déjà http/https, on la retourne telle quelle
    if (url.startsWith('http')) {
      return url;
    }
    // Sinon, on ajoute le domaine actuel
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  
  const fullUrl = getFullUrl();
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
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
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(title + ' - ' + fullUrl)}`, '_blank')}
        >
          <MessageCircle />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full bg-[#1877F2] hover:bg-[#1877F2]/80 text-white border-none"
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank')}
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
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`, '_blank')}
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
                url: fullUrl
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
