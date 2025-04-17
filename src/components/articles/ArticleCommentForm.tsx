
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ArticleCommentForm = () => {
  const { toast } = useToast();

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Commentaire envoyé",
      description: "Votre commentaire a été envoyé avec succès et est en attente de modération.",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Laisser un commentaire</h2>
      <form onSubmit={handleCommentSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Nom</label>
          <Input id="name" placeholder="Votre nom" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <Input id="email" type="email" placeholder="Votre email" required />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-1">Commentaire</label>
          <Textarea id="comment" placeholder="Écrivez votre commentaire ici..." rows={4} required />
        </div>
        <Button type="submit" className="bg-pana-red hover:bg-pana-red/80">
          Envoyer le commentaire
        </Button>
      </form>
    </div>
  );
};

export default ArticleCommentForm;
