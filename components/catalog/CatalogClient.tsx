"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { filterAndSortProducts, ProductFilters, SortOption } from "@/lib/products";
import { Product } from "@/types/product";
import { CategoryTreeComponent } from "./CategoryTree";
import { CategoryBreadcrumbs } from "./CategoryBreadcrumbs";
import { SortDropdown } from "./SortDropdown";
import { getLeafCategories, getCategoryBySlug } from "@/lib/categories";

interface CatalogClientProps {
  products: Product[];
}

export function CatalogClient({ products }: CatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const leafCategories = useMemo(() => getLeafCategories(), []);
  
  const currentSearch = searchParams.get("search") ?? "";
  const categorySlug = searchParams.get("category") ?? "";
  const rawSort = searchParams.get("sort") ?? "price-asc";
  const currentSort: SortOption = rawSort === "price-desc" ? "price-desc" : "price-asc";

  const selectedCategory = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  const filters: ProductFilters = {
    query: currentSearch,
    categoryFilter: {
      categoryId: selectedCategory?.id,
      includeSubcategories: true
    },
    sort: currentSort
  };

  const updateParam = (key: "search" | "category" | "sort", value: string) => {
    const next = new URLSearchParams(searchParams.toString());

    const isDefaultSort = key === "sort" && value === "price-asc";

    if (!value || isDefaultSort) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleCategorySelect = (categoryId: string | null) => {
    if (categoryId) {
      const category = getCategoryBySlug(categoryId) || { slug: categoryId };
      updateParam("category", category.slug);
    } else {
      updateParam("category", "");
    }
  };

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, filters);
  }, [products, filters]);

  return (
    <section className="space-y-8">
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 w-full justify-center py-3 rounded-xl border border-sand-200 bg-white text-sm font-medium"
        >
          <Filter size={16} />
          {showMobileFilters ? "Скрыть фильтры" : "Показать фильтры"}
        </button>
        
        {showMobileFilters && (
          <div className="mt-4">
            <CategoryTreeComponent
              onSelectCategory={handleCategorySelect}
              selectedCategoryId={selectedCategory?.id}
            />
          </div>
        )}
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <CategoryTreeComponent
            onSelectCategory={handleCategorySelect}
            selectedCategoryId={selectedCategory?.id}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-4">
            <CategoryBreadcrumbs categoryId={selectedCategory?.id} />
            
            <div className="grid gap-4 rounded-2xl border border-sand-100 bg-white p-4 shadow-card md:grid-cols-[1.4fr_auto]">
              <label className="relative block">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={filters.query}
                  onChange={(event) => updateParam("search", event.target.value)}
                  placeholder="Поиск по названию"
                  className="h-12 w-full rounded-xl border border-sand-200 pl-9 pr-3 text-sm outline-none transition focus:border-sand-400"
                />
              </label>

              <SortDropdown
                value={filters.sort}
                onChange={(value) => updateParam("sort", value)}
              />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Найдено товаров: <span className="font-medium">{filteredProducts.length}</span>
                </p>
                {selectedCategory && (
                  <p className="text-sm text-slate-600">
                    Категория: <span className="font-medium">{selectedCategory.name}</span>
                  </p>
                )}
              </div>
              
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-sand-300 bg-white p-8 text-center text-slate-500">
              <p className="text-lg font-medium mb-2">По вашему запросу ничего не найдено</p>
              <p className="text-sm">Попробуйте изменить параметры поиска или выбрать другую категорию</p>
            </div>
          )}
        </div>
      </div>

      {/* Мобильная версия (без сайдбара) */}
      <div className="lg:hidden space-y-6">
        <CategoryBreadcrumbs categoryId={selectedCategory?.id} />
        
        <div className="grid gap-4 rounded-2xl border border-sand-100 bg-white p-4 shadow-card">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={filters.query}
              onChange={(event) => updateParam("search", event.target.value)}
              placeholder="Поиск по названию"
              className="h-12 w-full rounded-xl border border-sand-200 pl-9 pr-3 text-sm outline-none transition focus:border-sand-400"
            />
          </label>

          <SortDropdown
            value={filters.sort}
            onChange={(value) => updateParam("sort", value)}
          />
        </div>

        {filteredProducts.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Найдено товаров: <span className="font-medium">{filteredProducts.length}</span>
              </p>
              {selectedCategory && (
                <p className="text-sm text-slate-600">
                  Категория: <span className="font-medium">{selectedCategory.name}</span>
                </p>
              )}
            </div>
            
            <div className="grid gap-5 sm:grid-cols-2">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-sand-300 bg-white p-8 text-center text-slate-500">
            <p className="text-lg font-medium mb-2">По вашему запросу ничего не найдено</p>
            <p className="text-sm">Попробуйте изменить параметры поиска или выбрать другую категорию</p>
          </div>
        )}
      </div>
    </section>
  );
}