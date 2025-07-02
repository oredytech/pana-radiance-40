
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
  
  // Charger plus d'articles pour augmenter les chances de trouver l'article
  const { data: posts, isLoading: isLoadingPosts, error } = useQuery({
    queryKey: ["article-posts", slug],
    queryFn: () => fetchRecentPosts(100), // Augmenté à 100 articles
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
    gcTime: 10 * 60 * 1000, // Garde en mémoire 10 minutes
    retry: 2, // Augmenté à 2 tentatives
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

  // Améliorer la logique de recherche d'article
  const currentSlug = slug || '';
  console.log("Recherche pour le slug:", currentSlug);

  const post = posts.find(p => {
    const postSlugFromTitle = getSlug(p.title.rendered);
    
    // Comparaison exacte
    if (currentSlug === postSlugFromTitle) {
      console.log("✓ Correspondance exacte trouvée:", p.title.rendered);
      return true;
    }
    
    // Comparaison normalisée
    const normalizedCurrentSlug = normalizeSlug(currentSlug);
    const normalizedPostSlug = normalizeSlug(postSlugFromTitle);
    
    if (normalizedCurrentSlug === normalizedPostSlug) {
      console.log("✓ Correspondance normalisée trouvée:", p.title.rendered);
      return true;
    }
    
    // Recherche partielle - si le slug contient une partie du titre
    const titleWords = p.title.rendered.toLowerCase().split(' ');
    const slugWords = currentSlug.toLowerCase().split('-');
    
    const matchCount = slugWords.filter(word => 
      titleWords.some(titleWord => 
        titleWord.includes(word) || word.includes(titleWord)
      )
    ).length;
    
    // Si au moins 60% des mots correspondent
    if (matchCount >= Math.ceil(slugWords.length * 0.6) && slugWords.length > 2) {
      console.log("✓ Correspondance partielle trouvée:", p.title.rendered, `(${matchCount}/${slugWords.length} mots)`);
      return true;
    }
    
    return false;
  });

  if (!post) {
    console.log("❌ Aucun article trouvé pour le slug:", currentSlug);
    console.log("Articles disponibles (premiers 10):", posts.slice(0, 10).map(p => ({
      id: p.id,
      slugFromTitle: getSlug(p.title.rendered),
      title: p.title.rendered.substring(0, 50) + "..."
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
