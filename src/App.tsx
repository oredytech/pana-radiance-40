import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Article from "./pages/Article";
import Programs from "./pages/Programs";
import PersistentRadioPlayer from "./components/PersistentRadioPlayer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/article/:slug" element={<Article />} />
        <Route path="/programs" element={<Programs />} />
      </Routes>
      <PersistentRadioPlayer />
    </Router>
  );
}

export default App;