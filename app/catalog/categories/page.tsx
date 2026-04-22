import { Suspense } from "react";
import { CategoriesClient } from "@/components/catalog/CategoriesClient";
import { getCategoryTree } from "@/lib/categories";

export default function CategoriesPage() {
  const categoryTree = getCategoryTree();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-sand-600">Навигация</p>
        <h1 className="mt-2 font-heading text-4xl text-ink">Каталог категорий</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Выберите категорию для просмотра товаров. Нажмите на категорию, чтобы развернуть подкатегории.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-sand-100 bg-white p-8 text-sm text-slate-500">
            Загружаем категории...
          </div>
        }
      >
        <CategoriesClient categoryTree={categoryTree} />
      </Suspense>
    </div>
  );
}