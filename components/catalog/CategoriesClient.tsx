"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, ArrowRight } from "lucide-react";
import { CategoryTree } from "@/types/category";

interface CategoriesClientProps {
  categoryTree: CategoryTree[];
}

export function CategoriesClient({ categoryTree }: CategoriesClientProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategoryCard = (category: CategoryTree, level = 0) => {
    const hasChildren = category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    
    // Специальная логика для категории "Аксессуары"
    const isAccessoriesCategory = category.id === "aksessuary";
    const isCareProductsCategory = category.id === "sredstva-uhoda";
    
    // Для аксессуаров и средств ухода считаем их листовыми для отображения кнопки
    const isLeafCategory = !hasChildren || category.children.every(child => child.children.length === 0) || isCareProductsCategory;
    // Для аксессуаров показываем кнопку "Смотреть товары" как для листовой категории
    const showViewProductsButton = (isLeafCategory && category.productCount > 0) || isAccessoriesCategory;
    
    // Определяем, какие дети показывать при разворачивании
    // Для аксессуаров показываем только "Средства ухода" и "Стельки"
    const childrenToShow = isAccessoriesCategory 
      ? category.children.filter(child => child.id === "sredstva-uhoda" || child.id === "stelki")
      : category.children;

    return (
      <div key={category.id} className="space-y-3">
        <div
          className={`
            group relative overflow-hidden rounded-2xl border transition-all duration-300
            ${hasChildren 
              ? 'border-sand-200 bg-white hover:border-sand-300 hover:shadow-lg' 
              : 'border-sand-100 bg-sand-50 hover:border-sand-200 hover:bg-white'
            }
          `}
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {hasChildren && !isCareProductsCategory && (
                    <button
                      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-sand-100 transition-colors"
                      onClick={() => toggleCategory(category.id)}
                      aria-label={isExpanded ? "Свернуть" : "Развернуть"}
                    >
                      {isExpanded ? (
                        <ChevronDown size={18} className="text-slate-600" />
                      ) : (
                        <ChevronRight size={18} className="text-slate-600" />
                      )}
                    </button>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium text-ink">{category.name}</h3>
                    {category.productCount > 0 && (
                      <p className="mt-1 text-sm text-slate-500">
                        {category.productCount} товар{category.productCount % 10 === 1 && category.productCount !== 11 ? '' : 'ов'}
                      </p>
                    )}
                  </div>
                </div>

                {category.path && category.path.length > 1 && (
                  <p className="mt-2 text-xs text-slate-400">
                    {category.path.slice(0, -1).join(' › ')}
                  </p>
                )}
              </div>

              {showViewProductsButton && (
                <Link
                  href={`/catalog?category=${category.id}`}
                  className="ml-4 flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-all hover:bg-sand-800 hover:shadow-md"
                >
                  Смотреть товары
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {hasChildren && isExpanded && !isCareProductsCategory && (
              <div className="mt-6 pt-6 border-t border-sand-100">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {childrenToShow.map(child => renderCategoryCard(child, level + 1))}
                </div>
              </div>
            )}
          </div>
        </div>

        {hasChildren && !isExpanded && !isCareProductsCategory && (
          <div className="flex flex-wrap gap-2 ml-11">
            {childrenToShow.slice(0, 3).map(child => (
              <Link
                key={child.id}
                href={`/catalog?category=${child.id}`}
                className="inline-flex items-center gap-1 rounded-full border border-sand-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-all hover:border-sand-300 hover:bg-sand-50 hover:shadow-sm"
              >
                {child.name}
                {child.productCount > 0 && (
                  <span className="text-xs text-slate-500">({child.productCount})</span>
                )}
              </Link>
            ))}
            {childrenToShow.length > 3 && (
              <button
                onClick={() => toggleCategory(category.id)}
                className="inline-flex items-center gap-1 rounded-full border border-sand-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-all hover:border-sand-300 hover:bg-sand-50 hover:shadow-sm"
              >
                +{childrenToShow.length - 3} ещё
                <ChevronRight size={12} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Детализированный список категорий */}
      <div className="rounded-2xl border border-sand-100 bg-white p-6">
        <div className="mb-6">
          <h3 className="text-xl font-medium text-ink">Все категории</h3>
          <p className="mt-1 text-sm text-slate-600">
            Разверните категории для просмотра подкатегорий или нажмите для перехода к товарам
          </p>
        </div>

        <div className="space-y-6">
          {categoryTree.map(category => renderCategoryCard(category))}
        </div>
      </div>
    </div>
  );
}