
import React from 'react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold text-pana-red mb-4">Page non trouvée</h1>
          <p className="text-gray-600 mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div className="space-y-4">
            <Link to="/">
              <Button className="bg-pana-red hover:bg-pana-red/90 text-white w-full">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retourner à l'accueil
              </Button>
            </Link>
            <Link to="/articles">
              <Button variant="outline" className="w-full">
                Découvrir nos articles
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
