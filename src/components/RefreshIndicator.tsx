
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshIndicatorProps {
  isRefreshing: boolean;
  onRefresh?: () => void;
}

const RefreshIndicator = ({ isRefreshing, onRefresh }: RefreshIndicatorProps) => {
  if (!isRefreshing) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div className="bg-white shadow-lg rounded-full px-4 py-2 border border-gray-200">
        <div className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 text-pana-red ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm text-gray-700">
            Mise à jour des articles...
          </span>
        </div>
      </div>
    </div>
  );
};

export default RefreshIndicator;
