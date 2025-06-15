
import React from "react";
import { Radio } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Programs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20 flex-grow">
        <div className="flex items-center gap-3 mb-8">
          <Radio className="h-8 w-8 text-pana-purple" />
          <h1 className="text-3xl font-bold text-pana-purple">Grille des Programmes</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <iframe
            src="https://www.canva.com/design/DAFULbORj0M/view?embed"
            allowFullScreen
            className="w-full h-[800px] border-0"
            title="Grille des programmes PANA RADIO"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Programs;
