
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshIndicatorProps {
  isRefreshing: boolean;
  onRefresh?: () => void;
  onComplete?: () => void;
}

type RefreshPhase = 'hidden' | 'searching' | 'loading' | 'ready' | 'countdown';

const RefreshIndicator = ({ isRefreshing, onRefresh, onComplete }: RefreshIndicatorProps) => {
  const [phase, setPhase] = useState<RefreshPhase>('hidden');
  const [countdown, setCountdown] = useState(5);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (isRefreshing) {
      // Démarrer le processus de recherche
      setPhase('searching');
      setIsBlinking(true);
      
      // Passer à la phase de chargement après 2 secondes
      const searchTimeout = setTimeout(() => {
        setPhase('loading');
      }, 2000);

      return () => clearTimeout(searchTimeout);
    }
  }, [isRefreshing]);

  useEffect(() => {
    // Quand le rafraîchissement se termine, passer à la phase "ready"
    if (!isRefreshing && (phase === 'searching' || phase === 'loading')) {
      setPhase('ready');
      setIsBlinking(false);
      
      // Démarrer le compte à rebours après 1 seconde
      const readyTimeout = setTimeout(() => {
        setPhase('countdown');
        setCountdown(5);
      }, 1000);

      return () => clearTimeout(readyTimeout);
    }
  }, [isRefreshing, phase]);

  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Fin du compte à rebours
            setPhase('hidden');
            onComplete?.();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [phase, countdown, onComplete]);

  if (phase === 'hidden') return null;

  const getButtonText = () => {
    switch (phase) {
      case 'searching':
        return 'Recherche...';
      case 'loading':
        return 'Chargement...';
      case 'ready':
        return 'Prêt !';
      case 'countdown':
        return `Mise à jour dans ${countdown}s`;
      default:
        return '';
    }
  };

  const getButtonColor = () => {
    switch (phase) {
      case 'searching':
      case 'loading':
        return 'bg-pana-red';
      case 'ready':
      case 'countdown':
        return 'bg-green-500';
      default:
        return 'bg-pana-red';
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-right">
      <button
        onClick={onRefresh}
        className={`
          ${getButtonColor()} 
          text-white px-6 py-3 rounded-full shadow-lg border-2 border-white
          transition-all duration-300 hover:scale-105
          ${isBlinking ? 'animate-pulse' : ''}
          ${phase === 'countdown' ? 'animate-bounce' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <RefreshCw className={`w-5 h-5 ${(phase === 'searching' || phase === 'loading') ? 'animate-spin' : ''}`} />
          <span className="font-semibold text-sm">
            {getButtonText()}
          </span>
        </div>
      </button>
    </div>
  );
};

export default RefreshIndicator;
