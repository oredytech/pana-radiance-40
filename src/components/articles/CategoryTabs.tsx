
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
      <TabsList className="w-full flex overflow-x-auto pb-2 mb-6 justify-start md:justify-center">
        {categories.map((category) => (
          <TabsTrigger 
            key={category.id} 
            value={category.id}
            className="min-w-fit px-4 py-2 data-[state=active]:bg-pana-red data-[state=active]:text-white"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id} className="mt-4">
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CategoryTabs;
