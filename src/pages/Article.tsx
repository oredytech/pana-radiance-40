
import React from 'react';
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/services/wordpress";
import { useToast } from "@/hooks/use-toast";
import { getSlug, stripHtml } from "@/utils/textUtils";
import ArticleLayout from "@/components/articles/ArticleLayout";
import ArticleHeader from "@/components/articles/ArticleHeader";
import ArticleMain from "@/components/articles/ArticleMain";
import ArticleSidebar from "@/components/articles/ArticleSidebar";
import ArticleLoading from "@/components/articles/ArticleLoading";
import ArticleNotFound from "@/components/articles/ArticleNotFound";

const Article = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  
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

  const post = posts?.find(p => {
    const postSlug = getSlug(p.title.rendered);
    console.log(`Comparing: "${postSlug}" with "${slug}"`);
    return postSlug === slug;
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
