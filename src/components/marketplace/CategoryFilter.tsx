import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryProps {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: CategoryProps[];
  selectedCategory: string;
  onChange: (categoryId: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onChange }: CategoryFilterProps) => {
  return (
    <div className="space-y-1">
      {categories.map(category => (
        <button
          key={category.id}
          className={cn(
            "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
            selectedCategory === category.id 
              ? "bg-emerald-50 text-emerald-600" 
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;