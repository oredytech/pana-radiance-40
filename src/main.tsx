
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Déclarer la variable globale pour TypeScript
declare global {
  interface Window {
    globalAudio?: HTMLAudioElement;
    isGlobalPlaying?: boolean;
  }
}

// Assurer que DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById("root")!).render(<App />);
});
