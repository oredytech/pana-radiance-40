
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const ArticleLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Article principal */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="animate-pulse space-y-4">
                  {/* En-tête avec vues et lecteur audio */}
                  <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                  
                  {/* Titre */}
                  <Skeleton className="h-8 w-3/4 mb-6" />
                  <Skeleton className="h-8 w-1/2 mb-6" />
                  
                  {/* Contenu */}
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  
                  {/* Image de l'article */}
                  <Skeleton className="h-64 w-full mt-6" />
                  
                  {/* Plus de contenu */}
                  <div className="space-y-3 mt-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="space-y-6">
                {/* Articles récents */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-16 w-16 rounded" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleLoading;
