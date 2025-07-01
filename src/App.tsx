import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Article from "./pages/Article";
import Programs from "./pages/Programs";
import Podcasts from "./pages/Podcasts";
import PodcastEpisodePage from "./pages/PodcastEpisode";
import Direct from "./pages/Direct";
import Comments from "./pages/Comments";
import Articles from "./pages/Articles";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import PersistentRadioPlayer from "./components/PersistentRadioPlayer";
import PodcastPlayer from "./components/PodcastPlayer";
import LoadingOverlay from "./components/LoadingOverlay";
import { PodcastPlayerProvider } from "./context/PodcastPlayerContext";

// Configuration optimisée pour des chargements rapides
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: 2, // 2 tentatives au lieu de 1
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // Délai progressif mais limité
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PodcastPlayerProvider>
          <Toaster />
          <Sonner />
          {isLoading && <LoadingOverlay onLoadComplete={() => setIsLoading(false)} />}
          <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* Nouvelle route pour les articles sans préfixe /article */}
                <Route path="/:slug" element={<Article />} />
                {/* Ancienne route avec préfixe /article pour la rétrocompatibilité */}
                <Route path="/article/:slug" element={<Article />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/podcasts" element={<Podcasts />} />
                <Route path="/podcast/:slug" element={<PodcastEpisodePage />} />
                <Route path="/direct" element={<Direct />} />
                <Route path="/comments" element={<Comments />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/search" element={<Search />} />
                
                {/* Redirections pour les liens partagés */}
                <Route path="/actualites" element={<Navigate to="/articles" replace />} />
                <Route path="/musique" element={<Navigate to="/podcasts" replace />} />
                <Route path="/emission" element={<Navigate to="/programs" replace />} />
                <Route path="/direct-radio" element={<Navigate to="/direct" replace />} />
                
                {/* Wildcard route pour capturer toutes les autres URL */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <PodcastPlayer />
              <PersistentRadioPlayer />
            </Router>
          </div>
        </PodcastPlayerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
