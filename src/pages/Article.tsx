
import React from 'react';
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
  
  const { data: posts, isLoading: isLoadingPosts, error } = useQuery({
    queryKey: ["posts", slug],
    queryFn: fetchPosts,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    meta: {
      onError: (error: any) => {
        console.error("Erreur lors du chargement des articles:", error);
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

  if (error) {
    console.error("Erreur de récupération des articles:", error);
    return <ArticleNotFound />;
  }

  if (!posts || posts.length === 0) {
    console.log("Aucun article trouvé");
    return <ArticleNotFound />;
  }

  // Logique simplifiée de recherche d'article
  const post = posts.find(p => {
    const currentSlug = slug || '';
    const postSlugFromTitle = getSlug(p.title.rendered);
    
    console.log("Recherche article:", { 
      currentSlug, 
      postSlugFromTitle,
      title: p.title.rendered.substring(0, 50)
    });
    
    // Comparaison exacte
    if (currentSlug === postSlugFromTitle) {
      console.log("✓ Correspondance exacte trouvée");
      return true;
    }
    
    // Comparaison normalisée
    const normalizedCurrentSlug = normalizeSlug(currentSlug);
    const normalizedPostSlug = normalizeSlug(postSlugFromTitle);
    
    if (normalizedCurrentSlug === normalizedPostSlug) {
      console.log("✓ Correspondance normalisée trouvée");
      return true;
    }
    
    return false;
  });

  if (!post) {
    console.log("❌ Article non trouvé pour le slug:", slug);
    console.log("Articles disponibles:", posts.slice(0, 5).map(p => ({
      id: p.id,
      slugFromTitle: getSlug(p.title.rendered),
      title: p.title.rendered.substring(0, 30) + "..."
    })));
    
    return <ArticleNotFound />;
  }

  console.log("✓ Article trouvé:", {
    id: post.id,
    title: post.title.rendered,
    slugFromTitle: getSlug(post.title.rendered)
  });

  const recentPosts = posts.filter(p => p.id !== post.id).slice(0, 5);
  const similarPosts = posts.filter(p => p.id !== post.id).slice(0, 4);

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
