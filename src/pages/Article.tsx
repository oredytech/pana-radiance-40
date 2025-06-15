
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
    
    console.log("Comparaison détaillée:", { 
      postSlug, 
      currentSlug, 
      title: p.title.rendered,
      postSlugLength: postSlug.length,
      currentSlugLength: currentSlug.length
    });
    
    // 1. Comparaison exacte d'abord
    if (postSlug === currentSlug) {
      console.log("Correspondance exacte trouvée");
      return true;
    }
    
    // 2. Comparaison avec normalisation des deux côtés
    const normalizedPostSlug = normalizeSlug(postSlug);
    const normalizedCurrentSlug = normalizeSlug(currentSlug);
    
    if (normalizedPostSlug === normalizedCurrentSlug) {
      console.log("Correspondance normalisée trouvée");
      return true;
    }
    
    // 3. Correspondance partielle améliorée pour les slugs longs
    // Prendre les 60 premiers caractères pour la comparaison
    const truncatedPostSlug = postSlug.substring(0, 60);
    const truncatedCurrentSlug = currentSlug.substring(0, 60);
    
    if (truncatedPostSlug === truncatedCurrentSlug) {
      console.log("Correspondance tronquée trouvée");
      return true;
    }
    
    // 4. Correspondance par inclusion - vérifier si le slug actuel contient le slug de l'article ou vice versa
    if (currentSlug.length > 40 && postSlug.includes(currentSlug.substring(0, 40))) {
      console.log("Correspondance par inclusion (current dans post) trouvée");
      return true;
    }
    
    if (postSlug.length > 40 && currentSlug.includes(postSlug.substring(0, 40))) {
      console.log("Correspondance par inclusion (post dans current) trouvée");
      return true;
    }
    
    // 5. Correspondance flexible - enlever les mots courts et comparer
    const cleanPostSlug = postSlug.replace(/\b(le|la|les|de|du|des|et|ou|a|au|aux|ce|ces|un|une)\b/g, '').replace(/-+/g, '-');
    const cleanCurrentSlug = currentSlug.replace(/\b(le|la|les|de|du|des|et|ou|a|au|aux|ce|ces|un|une)\b/g, '').replace(/-+/g, '-');
    
    if (cleanPostSlug === cleanCurrentSlug) {
      console.log("Correspondance flexible trouvée");
      return true;
    }
    
    return false;
  });

  if (!post) {
    console.log("Article non trouvé pour le slug:", slug);
    console.log("Articles disponibles:", posts?.map(p => ({
      id: p.id,
      slug: getSlug(p.title.rendered),
      title: p.title.rendered,
      slugLength: getSlug(p.title.rendered).length
    })));
    
    return <ArticleNotFound />;
  }

  console.log("Article trouvé:", {
    id: post.id,
    title: post.title.rendered,
    generatedSlug: getSlug(post.title.rendered)
  });

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
