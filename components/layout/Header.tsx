"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useBasketStore } from "@/store/basket";

export function Header() {
  const totalItems = useBasketStore((state) => state.totalItems());

  return (
    <header className="sticky top-0 z-50 border-b border-sand-100 bg-white/90 backdrop-blur">
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-2xl tracking-wide text-ink">
          ИНТЕРМАГ
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-ink hover:text-sand-800">
            Главная
          </Link>
          <Link
            href="/catalog/categories"
            className="text-sm font-medium text-ink hover:text-sand-800"
          >
            Каталог
          </Link>
          <Link
            href="/cart"
            className="text-sm font-medium text-ink hover:text-sand-800"
          >
            Корзина
          </Link>
          <Link
            href="/checkout"
            className="text-sm font-medium text-ink hover:text-sand-800"
          >
            Оформление
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Link
              href="/cart"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand-200"
              aria-label="Корзина"
            >
              <ShoppingBag size={18} />
            </Link>
            {totalItems > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-xs text-white">
                {totalItems}
              </span>
            ) : null}
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
