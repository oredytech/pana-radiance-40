
import React from 'react';

const CategoriesSidebar = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Catégories</h2>
      <ul className="space-y-2">
        <li>
          <a href="#" className="text-gray-700 hover:text-pana-red transition-colors">
            Actualités
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-700 hover:text-pana-red transition-colors">
            Culture
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-700 hover:text-pana-red transition-colors">
            Musique
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-700 hover:text-pana-red transition-colors">
            Politique
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-700 hover:text-pana-red transition-colors">
            Sport
          </a>
        </li>
      </ul>
    </div>
  );
};

export default CategoriesSidebar;
