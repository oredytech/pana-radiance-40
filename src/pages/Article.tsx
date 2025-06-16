
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
  
  const { data: posts, isLoading: isLoadingPosts, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 30 * 1000, // 30 secondes pour forcer des mises à jour plus fréquentes
    gcTime: 2 * 60 * 1000, // 2 minutes en cache
    refetchOnWindowFocus: true,
    retry: 3, // Augmenter les tentatives
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

  // Refetch automatiquement toutes les 1 minute pour s'assurer d'avoir les derniers articles
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refetch des articles pour Article.tsx');
      refetch();
    }, 60 * 1000); // 1 minute

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoadingPosts) {
    return <ArticleLoading />;
  }

  // Rechercher l'article avec une logique de correspondance améliorée
  const post = posts?.find(p => {
    const currentSlug = slug || '';
    
    console.log("Recherche article pour slug:", currentSlug);
    console.log("Total articles disponibles:", posts?.length);
    
    // Le slug peut être directement le titre de l'article
    // Donc on compare le slug de l'URL avec le slug généré depuis le titre
    const postSlugFromTitle = getSlug(p.title.rendered);
    
    console.log("Comparaison:", { 
      currentSlug, 
      postSlugFromTitle,
      title: p.title.rendered
    });
    
    // 1. Comparaison exacte entre le slug URL et le slug généré du titre
    if (currentSlug === postSlugFromTitle) {
      console.log("✓ Correspondance exacte slug-titre trouvée");
      return true;
    }
    
    // 2. Comparaison avec normalisation des deux côtés
    const normalizedCurrentSlug = normalizeSlug(currentSlug);
    const normalizedPostSlug = normalizeSlug(postSlugFromTitle);
    
    if (normalizedCurrentSlug === normalizedPostSlug) {
      console.log("✓ Correspondance normalisée slug-titre trouvée");
      return true;
    }
    
    // 3. Comparaison partielle pour les slugs très longs (WordPress peut tronquer)
    if (currentSlug.length > 30 && postSlugFromTitle.length > 30) {
      const truncatedCurrentSlug = currentSlug.substring(0, 50);
      const truncatedPostSlug = postSlugFromTitle.substring(0, 50);
      
      if (truncatedCurrentSlug === truncatedPostSlug) {
        console.log("✓ Correspondance tronquée slug-titre trouvée");
        return true;
      }
    }
    
    // 4. Correspondance flexible - vérifier si l'un contient l'autre (pour les variations)
    if (currentSlug.length > 15 && postSlugFromTitle.includes(currentSlug)) {
      console.log("✓ Correspondance inclusion (current dans post) trouvée");
      return true;
    }
    
    if (postSlugFromTitle.length > 15 && currentSlug.includes(postSlugFromTitle)) {
      console.log("✓ Correspondance inclusion (post dans current) trouvée");
      return true;
    }
    
    return false;
  });

  if (!post) {
    console.log("❌ Article non trouvé pour le slug:", slug);
    console.log("Total articles disponibles:", posts?.length);
    console.log("Articles disponibles:", posts?.slice(0, 20).map(p => ({
      id: p.id,
      slugFromTitle: getSlug(p.title.rendered),
      title: p.title.rendered.substring(0, 50) + "..."
    })));
    
    // Tenter un refetch immédiat avant d'afficher l'erreur
    setTimeout(() => {
      console.log("Tentative de refetch immédiat pour trouver l'article...");
      refetch();
    }, 500);
    
    return <ArticleNotFound />;
  }

  console.log("✓ Article trouvé:", {
    id: post.id,
    title: post.title.rendered,
    slugFromTitle: getSlug(post.title.rendered)
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

// 📁 src/pages/ArticlePage.tsx
import React from "react";
import {
  usePostIdFromSlug,
  useTrackArticleView,
  useArticleViews,
} from "@/utils/otSiteStats";

interface ArticlePageProps {
  slug: string;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ slug }) => {
  const postId = usePostIdFromSlug(slug);

  useTrackArticleView(postId);
  const views = useArticleViews(postId);

  return (
    <div className="article-container">
      <h1>Article : {slug}</h1>

      {views !== null ? (
        <p style={{ fontWeight: "bold", fontSize: "18px" }}>
          👁️ {views} vue{views > 1 ? "s" : ""}
        </p>
      ) : (
        <p>Chargement des vues...</p>
      )}
    </div>
  );
};

export default Article;


