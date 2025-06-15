
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchPosts } from "@/services/wordpress";
import { useToast } from "@/components/ui/use-toast";
import { getImageUrl, stripHtml, getSlug, truncateText } from "@/utils/textUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticlesGrid from "@/components/ArticlesGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const { data: searchResults, isLoading, refetch, error } = useQuery({
    queryKey: ["search", searchQuery.trim()],
    queryFn: () => {
      console.log(`Executing search query: "${searchQuery.trim()}"`);
      return searchPosts(searchQuery.trim());
    },
    enabled: false, // Ne pas exécuter automatiquement
    retry: 1,
    meta: {
      onError: (error: any) => {
        console.error("Search error:", error);
        toast({
          title: "Erreur de recherche",
          description: `Impossible d'effectuer la recherche: ${error.message || 'Erreur inconnue'}`,
          variant: "destructive",
        });
      },
    },
  });

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query.trim()) {
      setSearchQuery(query);
      setHasSearched(true);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    console.log(`Starting search for: "${searchTerm}"`);
    
    if (!searchTerm.trim()) {
      toast({
        title: "Recherche vide",
        description: "Veuillez saisir un terme de recherche",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSearchParams({ q: searchTerm.trim() });
    
    try {
      console.log("Triggering search refetch...");
      const result = await refetch();
      console.log("Search completed, results:", result.data?.length || 0);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const currentQuery = searchParams.get('q') || '';
  const isActivelyLoading = isSearching || isLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="pt-[104px] py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl font-bold text-center mb-8">Rechercher des articles</h1>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Rechercher des articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isActivelyLoading}
                className="bg-pana-red hover:bg-pana-purple"
              >
                {isActivelyLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <SearchIcon className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            {hasSearched && currentQuery && (
              <div className="mb-4">
                <p className="text-gray-600">
                  {isActivelyLoading 
                    ? `Recherche en cours pour "${currentQuery}"...`
                    : searchResults 
                      ? `${searchResults.length} résultat${searchResults.length > 1 ? 's' : ''} trouvé${searchResults.length > 1 ? 's' : ''} pour "${currentQuery}"`
                      : `Recherche pour "${currentQuery}"`
                  }
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">
                  Erreur lors de la recherche: {error.message || 'Erreur inconnue'}
                </p>
              </div>
            )}

            {isActivelyLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pana-red mx-auto mb-4"></div>
                <p>Recherche en cours...</p>
              </div>
            ) : hasSearched ? (
              searchResults && searchResults.length > 0 ? (
                <ArticlesGrid 
                  posts={searchResults}
                  isLoading={false}
                  getImageUrl={getImageUrl}
                  stripHtml={stripHtml}
                  getSlug={getSlug}
                  truncateText={truncateText}
                  displayCount={50}
                />
              ) : currentQuery ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun article trouvé pour votre recherche.</p>
                  <p className="text-sm text-gray-400 mt-2">Essayez avec d'autres mots-clés.</p>
                </div>
              ) : null
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Utilisez la barre de recherche ci-dessus pour trouver des articles.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Search;
