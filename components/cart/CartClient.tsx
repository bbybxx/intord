"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Ticket, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBasketStore } from "@/store/basket";
import { formatPrice } from "@/lib/products";

export function CartClient() {
  const items = useBasketStore((state) => state.items);
  const changeQuantity = useBasketStore((state) => state.changeQuantity);
  const removeItem = useBasketStore((state) => state.removeItem);
  const applyPromoCode = useBasketStore((state) => state.applyPromoCode);
  const promoCode = useBasketStore((state) => state.promoCode);
  const subtotalPrice = useBasketStore((state) => state.subtotalPrice());
  const discountAmount = useBasketStore((state) => state.discountAmount());
  const totalPrice = useBasketStore((state) => state.totalPrice());

  const [promoInput, setPromoInput] = useState("");

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4 rounded-2xl border border-sand-100 bg-white p-4 shadow-card sm:p-6">
        <h2 className="font-heading text-2xl text-ink">Товары в корзине</h2>

        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-sand-300 p-5 text-sm text-slate-500">
            Корзина пустая. Добавьте товары в каталоге.
          </p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.selectedSize}`}
                className="flex gap-3 rounded-xl border border-sand-100 p-3"
              >
                <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-sand-50">
                  <Image
                    src={item.imagePath}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500">Размер: {item.selectedSize}</p>
                  <p className="mt-2 text-sm text-ink">
                    {formatPrice(item.price * item.quantity)} RUB
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(item.productId, item.selectedSize, item.quantity - 1)
                      }
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-sand-200"
                      aria-label="Уменьшить"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-7 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(item.productId, item.selectedSize, item.quantity + 1)
                      }
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-sand-200"
                      aria-label="Увеличить"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.selectedSize)}
                      className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-200 text-red-600"
                      aria-label="Удалить"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-sand-100 bg-white p-4 shadow-card sm:p-6">
        <h2 className="font-heading text-2xl text-ink">Итог</h2>

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Ticket
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={promoInput}
              onChange={(event) => setPromoInput(event.target.value)}
              placeholder="Введите промокод"
              className="h-11 w-full rounded-xl border border-sand-200 pl-9 pr-3 text-sm outline-none transition focus:border-sand-400"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const result = applyPromoCode(promoInput);
              if (result.success) {
                toast.success(result.message);
              } else {
                toast.error(result.message);
              }
            }}
            className="rounded-xl border border-sand-200 px-4 text-sm font-medium text-ink transition hover:bg-sand-50"
          >
            Применить
          </button>
        </div>

        <div className="mt-5 space-y-1 text-sm text-slate-600">
          <p>Сумма: {formatPrice(subtotalPrice)} RUB</p>
          <p>Скидка: -{formatPrice(discountAmount)} RUB</p>
          <p className="font-semibold text-ink">Итого: {formatPrice(totalPrice)} RUB</p>
          {promoCode ? <p>Промокод: {promoCode}</p> : null}
        </div>

        <Link
          href="/checkout"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Перейти к оформлению
        </Link>
      </section>
    </div>
  );
}
