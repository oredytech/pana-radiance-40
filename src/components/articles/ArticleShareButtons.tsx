
import React from 'react';
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Share, MessageCircle } from "lucide-react";

interface ArticleShareButtonsProps {
  title: string;
  url: string;
}

const ArticleShareButtons = ({ title, url }: ArticleShareButtonsProps) => {
  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3">Partager cet article</h3>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full bg-[#25D366] hover:bg-[#25D366]/80 text-white border-none"
          onClick={() => window.open(`https://wa.me/?text=${url}`, '_blank')}
        >
          <MessageCircle />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full bg-[#1877F2] hover:bg-[#1877F2]/80 text-white border-none"
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')}
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
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')}
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
                url: url
              })
            }
          }}
        >
          <Share />
        </Button>
      </div>
    </div>
  );
};

export default ArticleShareButtons;
