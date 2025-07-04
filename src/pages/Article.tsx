
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
  
  // Stratégie optimisée : charger d'abord 20 articles, puis étendre si nécessaire
  const { data: posts, isLoading: isLoadingPosts, error } = useQuery({
    queryKey: ["article-posts", slug],
    queryFn: async () => {
      // Essayer d'abord avec 30 articles pour une réponse rapide
      let articles = await fetchRecentPosts(30);
      
      if (articles.length > 0) {
        const currentSlug = slug || '';
        const foundArticle = findArticleBySlug(articles, currentSlug);
        
        // Si on ne trouve pas l'article, charger plus d'articles
        if (!foundArticle) {
          console.log("Article non trouvé dans les 30 premiers, chargement de plus d'articles...");
          articles = await fetchRecentPosts(80);
        }
      }
      
      return articles;
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 8 * 60 * 1000,
    retry: 1, // Une seule tentative pour éviter les délais
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

  // Fonction améliorée de recherche d'article
  const findArticleBySlug = (articles: any[], searchSlug: string) => {
    if (!articles || articles.length === 0) return null;
    
    console.log("Recherche pour le slug:", searchSlug);
    
    // 1. Recherche exacte
    let found = articles.find(p => {
      const postSlug = getSlug(p.title.rendered);
      return searchSlug === postSlug;
    });
    
    if (found) {
      console.log("✓ Correspondance exacte:", found.title.rendered);
      return found;
    }
    
    // 2. Recherche avec normalisation
    found = articles.find(p => {
      const postSlug = normalizeSlug(getSlug(p.title.rendered));
      const normalizedSearch = normalizeSlug(searchSlug);
      return normalizedSearch === postSlug;
    });
    
    if (found) {
      console.log("✓ Correspondance normalisée:", found.title.rendered);
      return found;
    }
    
    // 3. Recherche par inclusion (slug contient des mots du titre)
    found = articles.find(p => {
      const titleWords = p.title.rendered.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Supprimer la ponctuation
        .split(/[\s-]+/)
        .filter(word => word.length > 2); // Mots de plus de 2 caractères
        
      const slugWords = searchSlug.toLowerCase()
        .split('-')
        .filter(word => word.length > 2);
      
      if (slugWords.length === 0 || titleWords.length === 0) return false;
      
      // Compter les correspondances
      const matches = slugWords.filter(slugWord => 
        titleWords.some(titleWord => 
          titleWord.includes(slugWord) || 
          slugWord.includes(titleWord) ||
          levenshteinDistance(slugWord, titleWord) <= 1 // Tolérance d'une lettre
        )
      );
      
      const matchRatio = matches.length / slugWords.length;
      return matchRatio >= 0.5; // Au moins 50% de correspondance
    });
    
    if (found) {
      console.log("✓ Correspondance partielle:", found.title.rendered);
      return found;
    }
    
    // 4. Recherche dans le contenu de l'article
    const searchTerms = searchSlug.split('-').filter(term => term.length > 3);
    found = articles.find(p => {
      const content = (p.title.rendered + ' ' + p.content.rendered).toLowerCase();
      return searchTerms.some(term => content.includes(term.toLowerCase()));
    });
    
    if (found) {
      console.log("✓ Trouvé dans le contenu:", found.title.rendered);
      return found;
    }
    
    return null;
  };

  // Fonction pour calculer la distance de Levenshtein (similarité entre mots)
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

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

  const currentSlug = slug || '';
  const post = findArticleBySlug(posts, currentSlug);

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
