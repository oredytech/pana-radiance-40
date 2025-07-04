
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
  
  // Stratégie agressive : charger beaucoup plus d'articles pour éviter "Article non trouvé"
  const { data: posts, isLoading: isLoadingPosts, error } = useQuery({
    queryKey: ["article-posts", slug],
    queryFn: async () => {
      console.log("🔍 Recherche d'article pour le slug:", slug);
      
      // Commencer par 200 articles pour maximiser les chances de trouver l'article
      let articles = await fetchRecentPosts(200);
      
      if (articles.length > 0) {
        const currentSlug = slug || '';
        const foundArticle = findArticleBySlug(articles, currentSlug);
        
        // Si toujours pas trouvé, essayer avec encore plus d'articles
        if (!foundArticle) {
          console.log("⚡ Article non trouvé dans les 200 premiers, chargement maximal...");
          articles = await fetchRecentPosts(500); // Augmenter drastiquement
        }
      }
      
      return articles;
    },
    staleTime: 30 * 1000, // 30 secondes seulement
    gcTime: 2 * 60 * 1000, // 2 minutes en mémoire
    retry: 3, // Plus de tentatives
    meta: {
      onError: (error: any) => {
        console.error("❌ Erreur lors du chargement des articles:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'article",
          variant: "destructive",
        });
      },
    },
  });

  // Fonction ultra-agressive de recherche d'article
  const findArticleBySlug = (articles: any[], searchSlug: string) => {
    if (!articles || articles.length === 0) return null;
    
    console.log("🔎 Recherche ultra pour le slug:", searchSlug);
    console.log("📚 Nombre d'articles à analyser:", articles.length);
    
    // 1. Recherche exacte (case insensitive)
    let found = articles.find(p => {
      const postSlug = getSlug(p.title.rendered);
      return searchSlug.toLowerCase() === postSlug.toLowerCase();
    });
    
    if (found) {
      console.log("✅ Correspondance exacte trouvée:", found.title.rendered);
      return found;
    }
    
    // 2. Recherche avec normalisation avancée
    found = articles.find(p => {
      const postSlug = normalizeSlug(getSlug(p.title.rendered));
      const normalizedSearch = normalizeSlug(searchSlug);
      const match = normalizedSearch === postSlug || postSlug.includes(normalizedSearch) || normalizedSearch.includes(postSlug);
      return match;
    });
    
    if (found) {
      console.log("✅ Correspondance normalisée trouvée:", found.title.rendered);
      return found;
    }
    
    // 3. Recherche par mots-clés du slug dans le titre
    const slugKeywords = searchSlug.toLowerCase()
      .split('-')
      .filter(word => word.length > 2);
    
    found = articles.find(p => {
      const title = p.title.rendered.toLowerCase();
      const matchCount = slugKeywords.filter(keyword => 
        title.includes(keyword) || 
        keyword.includes(title.substring(0, Math.min(title.length, 10)))
      ).length;
      
      return matchCount >= Math.max(1, Math.floor(slugKeywords.length * 0.4)); // 40% des mots-clés
    });
    
    if (found) {
      console.log("✅ Correspondance par mots-clés trouvée:", found.title.rendered);
      return found;
    }
    
    // 4. Recherche fuzzy ultra-permissive
    found = articles.find(p => {
      const postSlug = getSlug(p.title.rendered);
      const similarity = calculateSimilarity(searchSlug, postSlug);
      return similarity > 0.3; // Seuil très bas pour être permissif
    });
    
    if (found) {
      console.log("✅ Correspondance fuzzy trouvée:", found.title.rendered);
      return found;
    }
    
    // 5. Recherche dans le contenu et l'extrait
    const searchTerms = searchSlug.split('-').filter(term => term.length > 2);
    found = articles.find(p => {
      const fullText = (
        p.title.rendered + ' ' + 
        p.content.rendered + ' ' + 
        (p.excerpt?.rendered || '')
      ).toLowerCase();
      
      return searchTerms.some(term => fullText.includes(term.toLowerCase()));
    });
    
    if (found) {
      console.log("✅ Trouvé dans le contenu:", found.title.rendered);
      return found;
    }
    
    // 6. Dernier recours : recherche par ID si le slug contient des chiffres
    const numbersInSlug = searchSlug.match(/\d+/g);
    if (numbersInSlug) {
      found = articles.find(p => 
        numbersInSlug.some(num => p.id.toString().includes(num))
      );
      
      if (found) {
        console.log("✅ Trouvé par ID:", found.title.rendered);
        return found;
      }
    }
    
    console.log("❌ Aucune correspondance trouvée après recherche exhaustive");
    return null;
  };

  // Fonction de calcul de similarité améliorée
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  };

  // Fonction pour calculer la distance de Levenshtein optimisée
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1,     // deletion
          matrix[j - 1][i - 1] + cost // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  if (isLoadingPosts) {
    return <ArticleLoading />;
  }

  if (error) {
    console.error("❌ Erreur de récupération des articles:", error);
    return <ArticleNotFound />;
  }

  if (!posts || posts.length === 0) {
    console.log("📭 Aucun article trouvé dans la base");
    return <ArticleNotFound />;
  }

  const currentSlug = slug || '';
  const post = findArticleBySlug(posts, currentSlug);

  if (!post) {
    console.log("💥 ÉCHEC TOTAL - Aucun article trouvé pour le slug:", currentSlug);
    console.log("📊 Statistiques de recherche:");
    console.log("- Articles analysés:", posts.length);
    console.log("- Premiers 5 articles:", posts.slice(0, 5).map(p => ({
      id: p.id,
      title: p.title.rendered.substring(0, 60) + "...",
      slugFromTitle: getSlug(p.title.rendered)
    })));
    
    return <ArticleNotFound />;
  }

  console.log("🎉 SUCCÈS - Article trouvé:", {
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
