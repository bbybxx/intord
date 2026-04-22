"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchase } from "./ProductPurchase";
import { MobileProductStickyBar } from "./MobileProductStickyBar";

interface ProductPageContentProps {
  product: Product;
}

export function ProductPageContent({ product }: ProductPageContentProps) {
  const [selectedSize, setSelectedSize] = useState("");

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 overflow-x-hidden">
        {/* Хлебные крошки для мобильных */}
        <div className="mb-4 lg:hidden">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <a href="/catalog/categories" className="hover:text-ink">Каталог</a>
            <span>/</span>
            {product.categoryPath && product.categoryPath.length > 0 && (
              <>
                <a 
                  href={`/catalog?category=${product.categoryPath[0].id}`}
                  className="hover:text-ink"
                >
                  {product.categoryPath[0].name}
                </a>
                {product.categoryPath.length > 1 && (
                  <>
                    <span>/</span>
                    <span className="text-ink font-medium">{product.categoryPath[product.categoryPath.length - 1].name}</span>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Галерея товара */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ProductGallery images={product.imagePaths} title={product.name} />
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-sand-600">
                {product.categoryPath && product.categoryPath.length > 0 
                  ? product.categoryPath.map(c => c.name).join(' › ')
                  : product.categoryId
                }
              </p>
              <h1 className="mt-2 font-heading text-2xl text-ink sm:text-3xl lg:text-4xl">{product.name}</h1>
              <p className="mt-3 text-2xl font-semibold text-ink">{product.price.toLocaleString('ru-RU')} RUB</p>
              
              {/* Артикул и статус для мобильных */}
              <div className="mt-4 flex flex-wrap gap-3 lg:hidden">
                <div className="rounded-full bg-sand-100 px-3 py-1.5 text-xs text-slate-600">
                  Артикул: {product.article}
                </div>
                {product.isNew && (
                  <div className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800">
                    Новинка
                  </div>
                )}
              </div>
            </div>

            <ProductPurchase 
              product={product} 
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />

            {/* Дополнительная информация для десктопа */}
            <div className="hidden lg:block rounded-2xl border border-sand-100 bg-white p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-ink mb-2">Детали товара</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Артикул</p>
                      <p className="font-medium">{product.article}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Дата добавления</p>
                      <p className="font-medium">{product.createdAt}</p>
                    </div>
                    {product.isNew && (
                      <div>
                        <p className="text-slate-500">Статус</p>
                        <p className="font-medium text-green-600">Новинка</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-sand-100">
                  <h3 className="font-medium text-ink mb-2">Категории</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.categoryPath?.map((category, index) => (
                      <a
                        key={category.id}
                        href={`/catalog?category=${category.id}`}
                        className="inline-flex items-center gap-1 rounded-full border border-sand-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-all hover:border-sand-300 hover:bg-sand-50 hover:shadow-sm"
                      >
                        {category.name}
                        {index < product.categoryPath.length - 1 && (
                          <span className="text-xs text-slate-400">›</span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная информация для мобильных */}
        <div className="mt-8 lg:hidden">
          <div className="rounded-2xl border border-sand-100 bg-white p-5">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-ink mb-3">Детали товара</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Артикул</p>
                    <p className="font-medium">{product.article}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Дата добавления</p>
                    <p className="font-medium">{product.createdAt}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-sand-100">
                <h3 className="font-medium text-ink mb-3">Категории</h3>
                <div className="flex flex-wrap gap-2">
                  {product.categoryPath?.map((category) => (
                    <a
                      key={category.id}
                      href={`/catalog?category=${category.id}`}
                      className="inline-flex items-center rounded-full border border-sand-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-all hover:border-sand-300 hover:bg-sand-50"
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Липкая панель для мобильных */}
      <MobileProductStickyBar 
        product={product} 
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
      />
    </>
  );
}