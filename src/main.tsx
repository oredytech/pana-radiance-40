
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Déclarer la variable globale pour TypeScript
declare global {
  interface Window {
    globalAudio: HTMLAudioElement;
    isGlobalPlaying: boolean;
  }
}

// Initialiser l'audio global une seule fois
if (!window.globalAudio) {
  window.globalAudio = new Audio("https://stream.zeno.fm/dnw3x5tqpc9uv");
  window.globalAudio.preload = "none";
  window.globalAudio.volume = 0.5;
  window.isGlobalPlaying = false;
}

// Assurer que DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById("root")!).render(<App />);
});
