"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { CategoryPath } from "@/types/category";
import { getCategoryPath } from "@/lib/categories";

interface CategoryBreadcrumbsProps {
  categoryId?: string;
  className?: string;
}

export function CategoryBreadcrumbs({ categoryId, className = "" }: CategoryBreadcrumbsProps) {
  if (!categoryId) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Link href="/catalog" className="flex items-center gap-1 text-slate-600 hover:text-ink transition-colors">
          <Home size={14} />
          <span>Каталог</span>
        </Link>
        <ChevronRight size={14} className="text-slate-400" />
        <span className="text-ink font-medium">Все товары</span>
      </div>
    );
  }

  const path = getCategoryPath(categoryId);

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <Link href="/catalog" className="flex items-center gap-1 text-slate-600 hover:text-ink transition-colors">
        <Home size={14} />
        <span>Каталог</span>
      </Link>
      
      {path.map((category, index) => (
        <div key={category.id} className="flex items-center gap-2">
          <ChevronRight size={14} className="text-slate-400" />
          {index === path.length - 1 ? (
            <span className="text-ink font-medium">{category.name}</span>
          ) : (
            <Link 
              href={`/catalog/${category.slug}`}
              className="text-slate-600 hover:text-ink transition-colors"
            >
              {category.name}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}