
import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentPosts } from "@/services/posts";
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
  
  // Utilisation de fetchRecentPosts plus rapide au lieu de fetchPosts
  const { data: posts, isLoading: isLoadingPosts, error } = useQuery({
    queryKey: ["recent-posts-for-article"],
    queryFn: () => fetchRecentPosts(50), // Limité à 50 articles pour plus de rapidité
    staleTime: 0,
    gcTime: 0,
    retry: 2, // Augmenté à 2 tentatives
    retryDelay: 1000, // Délai réduit à 1 seconde
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
    // Au lieu de retourner ArticleNotFound, essayons de rediriger
    setTimeout(() => navigate('/'), 3000);
    return <ArticleLoading />;
  }

  if (!posts || posts.length === 0) {
    console.log("Aucun article trouvé, redirection vers l'accueil");
    setTimeout(() => navigate('/'), 2000);
    return <ArticleLoading />;
  }

  // Logique simplifiée et plus permissive de recherche d'article
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
    
    // Comparaison partielle si pas de correspondance exacte
    if (normalizedCurrentSlug.includes(normalizedPostSlug.substring(0, 10)) || 
        normalizedPostSlug.includes(normalizedCurrentSlug.substring(0, 10))) {
      console.log("✓ Correspondance partielle trouvée");
      return true;
    }
    
    return false;
  });

  if (!post) {
    console.log("❌ Article non trouvé pour le slug:", slug);
    // Essayons de prendre le premier article disponible comme fallback
    const fallbackPost = posts[0];
    if (fallbackPost) {
      console.log("🔄 Utilisation de l'article de fallback:", fallbackPost.title.rendered);
      const correctSlug = getSlug(fallbackPost.title.rendered);
      navigate(`/${correctSlug}`, { replace: true });
      return <ArticleLoading />;
    }
    
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
