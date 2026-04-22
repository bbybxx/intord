import { Suspense } from "react";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { getAllProducts } from "@/lib/products";

// Простой скелетон для загрузки
function CatalogSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="md:col-span-3">
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const products = getAllProducts();
  
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-sand-600">Каталог</p>
        <h1 className="mt-2 font-heading text-4xl text-ink">Все товары</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Выберите категорию для фильтрации товаров или воспользуйтесь поиском
        </p>
      </div>

      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogClient products={products} />
      </Suspense>
    </div>
  );
}