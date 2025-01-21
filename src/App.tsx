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
import PersistentRadioPlayer from "./components/PersistentRadioPlayer";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/direct" element={<Direct />} />
          </Routes>
          <PersistentRadioPlayer />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;