
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
    const currentSlug = slug || '';
    
    // Le slug peut être directement le titre de l'article
    // Donc on compare le slug de l'URL avec le slug généré depuis le titre
    const postSlugFromTitle = getSlug(p.title.rendered);
    
    console.log("Comparaison slug-titre:", { 
      currentSlug, 
      postSlugFromTitle,
      title: p.title.rendered,
      currentSlugLength: currentSlug.length,
      postSlugLength: postSlugFromTitle.length
    });
    
    // 1. Comparaison exacte entre le slug URL et le slug généré du titre
    if (currentSlug === postSlugFromTitle) {
      console.log("Correspondance exacte slug-titre trouvée");
      return true;
    }
    
    // 2. Comparaison avec normalisation des deux côtés
    const normalizedCurrentSlug = normalizeSlug(currentSlug);
    const normalizedPostSlug = normalizeSlug(postSlugFromTitle);
    
    if (normalizedCurrentSlug === normalizedPostSlug) {
      console.log("Correspondance normalisée slug-titre trouvée");
      return true;
    }
    
    // 3. Comparaison partielle pour les slugs très longs (WordPress peut tronquer)
    // Comparer les 60 premiers caractères
    const truncatedCurrentSlug = currentSlug.substring(0, 60);
    const truncatedPostSlug = postSlugFromTitle.substring(0, 60);
    
    if (truncatedCurrentSlug === truncatedPostSlug && truncatedCurrentSlug.length > 30) {
      console.log("Correspondance tronquée slug-titre trouvée");
      return true;
    }
    
    // 4. Correspondance flexible - le slug de l'URL contient le slug du titre ou vice versa
    if (currentSlug.length > 20 && postSlugFromTitle.includes(currentSlug)) {
      console.log("Correspondance inclusion (current dans post) trouvée");
      return true;
    }
    
    if (postSlugFromTitle.length > 20 && currentSlug.includes(postSlugFromTitle)) {
      console.log("Correspondance inclusion (post dans current) trouvée");
      return true;
    }
    
    return false;
  });

  if (!post) {
    console.log("Article non trouvé pour le slug:", slug);
    console.log("Articles disponibles:", posts?.map(p => ({
      id: p.id,
      slugFromTitle: getSlug(p.title.rendered),
      title: p.title.rendered,
      slugLength: getSlug(p.title.rendered).length
    })));
    
    return <ArticleNotFound />;
  }

  console.log("Article trouvé:", {
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

export default Article;
