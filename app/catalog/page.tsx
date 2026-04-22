import { CatalogClient } from "@/components/catalog/CatalogClient";
import { getAllProducts } from "@/lib/products";

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

      <CatalogClient products={products} />
    </div>
  );
}
