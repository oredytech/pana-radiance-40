
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  children: React.ReactNode;
}

const CategoryTabs = ({
  categories,
  activeCategory,
  setActiveCategory,
  children,
}: CategoryTabsProps) => {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 justify-start md:justify-center">
        {categories.map((category) => (
          <Button 
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            variant={activeCategory === category.id ? "default" : "outline"}
            className={cn(
              "min-w-fit",
              activeCategory === category.id && "bg-pana-red hover:bg-pana-red/90"
            )}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default CategoryTabs;
