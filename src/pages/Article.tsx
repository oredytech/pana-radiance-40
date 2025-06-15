
import React, { useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/services/wordpress";
import { useToast } from "@/hooks/use-toast";
import { getSlug, stripHtml, normalizeSlug } from "@/utils/textUtils";
import ArticleLayout from "@/components/articles/ArticleLayout";
import ArticleHeader from "@/components/articles/ArticleHeader";
import ArticleMain from "@/components/articles/ArticleMain";
import ArticleSidebar from "@/components/articles/ArticleSidebar";
import ArticleLoading from "@/components/articles/ArticleLoading";
import ArticleNotFound from "@/components/articles/ArticleNotFound";

const Article = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    meta: {
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'article",
          variant: "destructive",
        });
      },
    },
  });

  if (isLoadingPosts) {
    return <ArticleLoading />;
  }

  // Rechercher l'article avec une logique de correspondance améliorée
  const post = posts?.find(p => {
    const postSlug = getSlug(p.title.rendered);
    const currentSlug = slug || '';
    
    console.log("Comparaison:", { postSlug, currentSlug, title: p.title.rendered });
    
    // Comparaison exacte d'abord
    if (postSlug === currentSlug) {
      return true;
    }
    
    // Comparaison avec normalisation
    const normalizedPostSlug = normalizeSlug(postSlug);
    const normalizedCurrentSlug = normalizeSlug(currentSlug);
    
    if (normalizedPostSlug === normalizedCurrentSlug) {
      return true;
    }
    
    // Comparaison partielle pour les slugs tronqués
    if (currentSlug.length > 50 && postSlug.startsWith(currentSlug.substring(0, 50))) {
      return true;
    }
    
    if (postSlug.length > 50 && currentSlug.startsWith(postSlug.substring(0, 50))) {
      return true;
    }
    
    return false;
  });

  if (!post) {
    console.log("Article non trouvé:", slug);
    console.log("Articles disponibles:", posts?.map(p => ({
      slug: getSlug(p.title.rendered),
      title: p.title.rendered
    })));
    
    return <ArticleNotFound />;
  }

  console.log("Article trouvé:", post.title.rendered);

  const recentPosts = posts?.filter(p => p.id !== post.id).slice(0, 5) || [];
  const similarPosts = posts?.filter(p => p.id !== post.id).slice(0, 4) || [];

  return (
    <ArticleLayout>
      <ArticleHeader post={post} />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <ArticleMain post={post} similarPosts={similarPosts} />
        <ArticleSidebar recentPosts={recentPosts} />
      </div>
    </ArticleLayout>
  );
};

export default Article;
