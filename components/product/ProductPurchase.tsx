"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { formatPrice } from "@/lib/products";
import { useBasketStore } from "@/store/basket";
import { Product } from "@/types/product";
import { SizeSelector } from "@/components/product/SizeSelector";

interface ProductPurchaseProps {
  product: Product;
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export function ProductPurchase({ product, selectedSize, onSizeChange }: ProductPurchaseProps) {
  const addItem = useBasketStore((state) => state.addItem);
  const [sizeError, setSizeError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!isAdded) {
      return;
    }

    const timeoutId = setTimeout(() => setIsAdded(false), 1300);
    return () => clearTimeout(timeoutId);
  }, [isAdded]);

  return (
    <div className="space-y-6">
      <SizeSelector
        sizes={product.sizes}
        selectedSize={selectedSize}
        onSelect={(size) => {
          onSizeChange(size);
          setSizeError(false);
        }}
        hasError={sizeError}
        errorText="Пожалуйста, выберите размер"
      />

       <button
         type="button"
         onClick={() => {
           if (!selectedSize) {
             setSizeError(true);
             return;
           }

   addItem(product, selectedSize);
   setIsAdded(true);
         }}
         className={`
           inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition
           ${isAdded ? "bg-green-600 hover:bg-green-700" : "bg-ink hover:opacity-90"}
         `}
       >
         <ShoppingBag size={16} />
         {isAdded ? "Добавлено в корзину" : "В корзину"}
       </button>

      <div className="rounded-2xl border border-sand-100 bg-white px-5">
        <Accordion title="Описание" content={product.description} defaultOpen />
        <Accordion title="Состав" content={product.composition} />
      </div>
    </div>
  );
}
