
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingCircle from "@/components/LoadingCircle";

const ArticleLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Indicateur de chargement principal */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6">
              <LoadingCircle size={48} className="text-pana-red" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Chargement de l'article...
            </h2>
            <p className="text-gray-500 text-center max-w-md">
              Nous récupérons le contenu de l'article pour vous. Cela ne prendra qu'un instant.
            </p>
          </div>
          
          {/* Skeleton de l'article pendant le chargement */}
          <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
            {/* Titre skeleton */}
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            
            {/* Image skeleton */}
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            
            {/* Contenu skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleLoading;
