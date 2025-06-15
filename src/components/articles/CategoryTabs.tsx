
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  name: string;
  count?: number;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  children?: ReactNode;
}

const CategoryTabs = ({
  categories,
  activeCategory,
  setActiveCategory,
  children
}: CategoryTabsProps) => {
  // Sort categories by count (descending) while keeping "all" first
  const sortedCategories = [...categories].sort((a, b) => {
    // Keep "all" category first
    if (a.id === "all") return -1;
    if (b.id === "all") return 1;
    // Sort others by count (descending) - categories with more articles come first
    return (b.count || 0) - (a.count || 0);
  });

  const handleCategoryClick = (categoryId: string) => {
    console.log(`Switching to category: ${categoryId}`);
    setActiveCategory(categoryId);
  };

  return (
    <div>
      <div className="flex overflow-x-auto whitespace-nowrap px-2 border-t border-b border-gray-200 bg-gray-50 py-0 my-0">
        {sortedCategories.map(category => (
          <Button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            variant="ghost"
            className={cn(
              "min-w-fit rounded-none border-b-2 mx-1 px-3",
              activeCategory === category.id
                ? "border-pana-red text-pana-red font-medium"
                : "border-transparent hover:border-gray-300"
            )}
          >
            {category.name}
            {category.count !== undefined && (
              <span className="ml-2 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs font-medium">
                {category.count}
              </span>
            )}
          </Button>
        ))}
      </div>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default CategoryTabs;
