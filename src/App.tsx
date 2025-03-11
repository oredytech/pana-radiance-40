
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Article from "./pages/Article";
import Programs from "./pages/Programs";
import Podcasts from "./pages/Podcasts";
import Direct from "./pages/Direct";
import Comments from "./pages/Comments";
import PersistentRadioPlayer from "./components/PersistentRadioPlayer";
import LoadingOverlay from "./components/LoadingOverlay";

const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isLoading && <LoadingOverlay onLoadComplete={() => setIsLoading(false)} />}
        <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/article/:slug" element={<Article />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/direct" element={<Direct />} />
              <Route path="/comments" element={<Comments />} />
            </Routes>
            <PersistentRadioPlayer />
          </Router>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
