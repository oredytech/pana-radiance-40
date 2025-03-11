
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Assurer que DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById("root")!).render(<App />);
});
