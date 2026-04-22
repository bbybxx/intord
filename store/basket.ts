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
                imagePath: product.imagePaths[0],
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

        if (normalized === "INTERMAG10") {
          set({ promoCode: normalized, discount: 10 });
          return { success: true, message: "Промокод INTERMAG10 применен" };
        }

        if (normalized === "SALE500") {
          set({ promoCode: normalized, discount: 500 });
          return { success: true, message: "Промокод SALE500 применен" };
        }

        set({ promoCode: null, discount: 0 });
        return { success: false, message: "Промокод не найден" };
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
        const { promoCode, discount, subtotalPrice } = get();
        const subtotal = subtotalPrice();

        if (!promoCode || discount <= 0) {
          return 0;
        }

        if (promoCode === "INTERMAG10") {
          return Math.round((subtotal * discount) / 100);
        }

        if (promoCode === "SALE500") {
          return Math.min(discount, subtotal);
        }

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

          const current = window.localStorage.getItem("intermag-basket");
          const legacy = window.localStorage.getItem("intermag-basket");

          if (!current && legacy) {
            window.localStorage.setItem("intermag-basket", legacy);
          }

          if (legacy) {
            window.localStorage.removeItem("intermag-basket");
          }
        };
      }
    }
  )
);
