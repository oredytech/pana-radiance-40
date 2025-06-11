
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/wordpress";
import { Link } from "react-router-dom";

const CategoriesSidebar = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Sort categories by count (descending) - most articles first
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Catégories</h2>
      <ul className="space-y-2">
        {sortedCategories.map((category) => (
          <li key={category.id}>
            <Link 
              to={`/articles?category=${category.id}`} 
              className="text-gray-700 hover:text-pana-red transition-colors flex justify-between items-center"
            >
              <span>{category.name}</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                {category.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesSidebar;
