"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { CategoryTree } from "@/types/category";
import { getCategoryTree } from "@/lib/categories";

interface CategoryTreeProps {
  onSelectCategory?: (categoryId: string | null) => void;
  selectedCategoryId?: string | null;
  className?: string;
}

export function CategoryTreeComponent({ 
  onSelectCategory, 
  selectedCategoryId,
  className = "" 
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const categoryTree = getCategoryTree();

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (categoryId: string | null) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
  };

  const renderCategory = (category: CategoryTree, level = 0) => {
    const hasChildren = category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategoryId === category.id;

    return (
      <div key={category.id} className="select-none">
        <div
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer
            ${isSelected 
              ? "bg-sand-100 text-ink font-medium" 
              : "hover:bg-sand-50 text-slate-700"
            }
          `}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleCategory(category.id);
            }
            handleCategoryClick(category.id);
          }}
        >
          {hasChildren ? (
            <button
              className="flex items-center justify-center w-5 h-5 rounded hover:bg-sand-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(category.id);
              }}
              aria-label={isExpanded ? "Свернуть" : "Развернуть"}
            >
              {isExpanded ? (
                <ChevronDown size={14} className="text-slate-500" />
              ) : (
                <ChevronRight size={14} className="text-slate-500" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          
          <span className="flex-1 truncate">{category.name}</span>
          
          {category.productCount > 0 && (
            <span className="text-xs text-slate-500 bg-sand-100 px-2 py-0.5 rounded-full">
              {category.productCount}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-5">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-2xl border border-sand-100 p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="font-medium text-ink">Категории</h3>
        <p className="text-sm text-slate-500 mt-1">Выберите категорию для фильтрации</p>
      </div>

      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        <div
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer
            ${!selectedCategoryId 
              ? "bg-sand-100 text-ink font-medium" 
              : "hover:bg-sand-50 text-slate-700"
            }
          `}
          onClick={() => handleCategoryClick(null)}
        >
          <div className="w-5" />
          <span className="flex-1">Все товары</span>
          <span className="text-xs text-slate-500 bg-sand-100 px-2 py-0.5 rounded-full">
            {categoryTree.reduce((sum, cat) => sum + cat.productCount, 0)}
          </span>
        </div>

        {categoryTree.map(category => renderCategory(category))}
      </div>
    </div>
  );
}