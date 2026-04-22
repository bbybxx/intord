"use client";

import { useState } from "react";
import { ShoppingBag, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useBasketStore } from "@/store/basket";
import { Product } from "@/types/product";
import { SizeSelector } from "./SizeSelector";

interface MobileProductStickyBarProps {
  product: Product;
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export function MobileProductStickyBar({ product, selectedSize, onSizeChange }: MobileProductStickyBarProps) {
  const addItem = useBasketStore((state) => state.addItem);
  const [sizeError, setSizeError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      toast.error("Пожалуйста, выберите размер");
      return;
    }

    addItem(product, selectedSize);
    setIsAdded(true);
    toast.success(`Товар ${product.name} добавлен в корзину`);
    
    // Сбрасываем состояние через 2 секунды
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-safe">
      {/* Основная панель */}
      <div className="border-t border-sand-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {/* Кнопка развернуть/свернуть */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-center gap-2 border-b border-sand-100 bg-white py-3 text-sm font-medium text-slate-700"
        >
          {isExpanded ? (
            <>
              <ChevronDown size={16} />
              Скрыть
            </>
          ) : (
            <>
              <ChevronUp size={16} />
              Выбрать размер
            </>
          )}
        </button>

        {/* Расширенная панель с выбором размера */}
        {isExpanded && (
          <div className="border-b border-sand-100 bg-white p-4">
            <div className="mb-4">
              <h3 className="font-medium text-ink mb-3">Выберите размер</h3>
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelect={(size) => {
                  onSizeChange(size);
                  setSizeError(false);
                }}
                hasError={sizeError}
                errorText="Выберите размер перед добавлением в корзину"
              />
            </div>
          </div>
        )}

        {/* Панель с ценой и кнопкой */}
        <div className="flex items-center justify-between p-4">
          <div>
            <div className="text-lg font-semibold text-ink">{product.price.toLocaleString('ru-RU')} RUB</div>
            {selectedSize && (
              <div className="text-xs text-slate-500 mt-1">
                Выбран размер: <span className="font-medium">{selectedSize}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`
              flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition-all
              md:px-6
              ${isAdded 
                ? "bg-green-600" 
                : "bg-ink hover:opacity-90 active:scale-95"
              }
            `}
          >
            <ShoppingBag size={16} />
            {isAdded ? "Добавлено!" : "В корзину"}
          </button>
        </div>
      </div>

      {/* Индикатор добавления в корзину */}
      {isAdded && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
          Товар добавлен в корзину!
        </div>
      )}
    </div>
  );
}