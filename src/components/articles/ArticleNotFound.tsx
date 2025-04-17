
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticleNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Article non trouvé</h1>
          <p className="text-gray-600">Désolé, l'article que vous recherchez n'existe pas ou a été déplacé.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleNotFound;
