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
  return <div>
      <div className="flex overflow-x-auto whitespace-nowrap px-2 border-t border-b border-gray-200 bg-gray-50 py-0">
        {categories.map(category => <Button key={category.id} onClick={() => setActiveCategory(category.id)} variant="ghost" className={cn("min-w-fit rounded-none border-b-2 mx-1 px-3", activeCategory === category.id ? "border-pana-red text-pana-red font-medium" : "border-transparent hover:border-gray-300")}>
            {category.name}
            {category.count !== undefined && <span className="ml-2 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs font-medium">
                {category.count}
              </span>}
          </Button>)}
      </div>
      {children && <div className="mt-6">{children}</div>}
    </div>;
};
export default CategoryTabs;