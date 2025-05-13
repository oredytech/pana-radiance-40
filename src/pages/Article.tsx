
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

  // Normalise le slug courant
  const normalizedCurrentSlug = normalizeSlug(slug);
  
  useEffect(() => {
    // Si le slug n'est pas normalisé, rediriger vers la version normalisée
    if (slug && normalizedCurrentSlug !== slug) {
      navigate(`/article/${normalizedCurrentSlug}`, { replace: true });
    }
  }, [slug, normalizedCurrentSlug, navigate]);

  if (isLoadingPosts) {
    return <ArticleLoading />;
  }

  const post = posts?.find(p => {
    const postSlug = getSlug(p.title.rendered);
    return postSlug === normalizedCurrentSlug;
  });

  if (!post) {
    console.log("Article non trouvé:", slug);
    console.log("Articles disponibles:", posts?.map(p => getSlug(p.title.rendered)));
    
    return <ArticleNotFound />;
  }

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
