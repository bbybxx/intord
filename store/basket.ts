"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Product } from "@/types/product";

interface BasketItem {
  productId: string;
  article: string;
  name: string;
  price: number;
  imagePath: string;
  selectedSize: string;
  quantity: number;
}

interface BasketStore {
  items: BasketItem[];
  discount: number;
  promoCode: string | null;
  addItem: (product: Product, selectedSize: string) => void;
  removeItem: (productId: string, selectedSize: string) => void;
  changeQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  clearPromoCode: () => void;
  clear: () => void;
  totalItems: () => number;
  subtotalPrice: () => number;
  discountAmount: () => number;
  totalPrice: () => number;
}

export const useBasketStore = create<BasketStore>()(
  persist(
    (set, get) => ({
      items: [],
      discount: 0,
      promoCode: null,
      addItem: (product, selectedSize) => {
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.productId === product.id && item.selectedSize === selectedSize
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id && item.selectedSize === selectedSize
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                article: product.article,
                name: product.name,
                price: product.price,
                imagePath: product.imagePaths[0] || "/images/placeholder.jpg",
                selectedSize,
                quantity: 1
              }
            ]
          };
        });
      },
      removeItem: (productId, selectedSize) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.selectedSize === selectedSize)
          )
        }));
      },
      changeQuantity: (productId, selectedSize, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId && item.selectedSize === selectedSize
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
            )
            .filter((item) => item.quantity > 0)
        }));
      },
      applyPromoCode: (code) => {
        const normalized = code.trim().toUpperCase();

        // Все промокоды отключены, поле остается но не работает
        set({ promoCode: null, discount: 0 });
        return { success: false, message: "Промокоды временно не работают" };
      },
      clearPromoCode: () => set({ promoCode: null, discount: 0 }),
      clear: () => set({ items: [], promoCode: null, discount: 0 }),
      totalItems: () =>
        get().items.reduce((acc, item) => {
          return acc + item.quantity;
        }, 0),
      subtotalPrice: () =>
        get().items.reduce((acc, item) => {
          return acc + item.quantity * item.price;
        }, 0),
      discountAmount: () => {
        // Промокоды отключены, всегда возвращаем 0
        return 0;
      },
      totalPrice: () => {
        const { subtotalPrice, discountAmount } = get();
        const subtotal = subtotalPrice();
        const discountValue = discountAmount();
        return Math.max(0, subtotal - discountValue);
      }
    }),
    {
      name: "intermag-basket",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return () => {
          if (typeof window === "undefined") {
            return;
          }

          // Add event listener for storage changes (sync between tabs)
          const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "intermag-basket") {
              try {
                const newState = JSON.parse(event.newValue || "{}");
                if (newState.state?.items) {
                  useBasketStore.setState(newState.state);
                }
              } catch (error) {
                console.error("Failed to parse basket storage change:", error);
              }
            }
          };

          window.addEventListener("storage", handleStorageChange);

          // Cleanup function
          return () => {
            window.removeEventListener("storage", handleStorageChange);
          };
        };
      }
    }
  )
);
