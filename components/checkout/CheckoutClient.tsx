"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useBasketStore } from "@/store/basket";
import { formatPrice } from "@/lib/products";

interface CheckoutFormValues {
  name: string;
  phone: string;
  address: string;
}

export function CheckoutClient() {
  const router = useRouter();
  const items = useBasketStore((state) => state.items);
  const subtotalPrice = useBasketStore((state) => state.subtotalPrice());
  const discountAmount = useBasketStore((state) => state.discountAmount());
  const totalPrice = useBasketStore((state) => state.totalPrice());
  const promoCode = useBasketStore((state) => state.promoCode);
  const clear = useBasketStore((state) => state.clear);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      address: ""
    }
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    const payload = {
      customer: values,
      order: {
        items,
        promoCode,
        subtotal: subtotalPrice,
        discount: discountAmount,
        total: totalPrice
      }
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      const data = (await response.json()) as { orderId?: string };
      const orderId = data.orderId;

      clear();
      router.push(orderId ? `/checkout/success?order=${orderId}` : "/checkout/success");
    } catch {
      toast.error("Не удалось оформить заказ. Попробуйте еще раз.");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4 rounded-2xl border border-sand-100 bg-white p-4 shadow-card sm:p-6">
        <h2 className="font-heading text-2xl text-ink">Ваш заказ</h2>

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
                  <p className="mt-1 text-xs text-slate-500">
                    Размер: {item.selectedSize} · Кол-во: {item.quantity}
                  </p>
                  <p className="mt-2 text-sm text-ink">
                    {formatPrice(item.price * item.quantity)} RUB
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-sand-100 bg-white p-4 shadow-card sm:p-6">
        <h2 className="font-heading text-2xl text-ink">Оформление</h2>
        <div className="mt-2 space-y-1 text-sm text-slate-600">
          <p>Сумма: {formatPrice(subtotalPrice)} RUB</p>
          <p>Скидка: -{formatPrice(discountAmount)} RUB</p>
          <p className="font-semibold text-ink">Итого: {formatPrice(totalPrice)} RUB</p>
          {promoCode ? <p>Промокод: {promoCode}</p> : null}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-ink">Имя</span>
            <input
              type="text"
              {...register("name", {
                required: "Введите имя",
                minLength: {
                  value: 2,
                  message: "Минимум 2 символа"
                }
              })}
              className="h-11 w-full rounded-xl border border-sand-200 px-3 text-sm outline-none focus:border-sand-400"
            />
            {errors.name ? (
              <span className="text-xs text-red-600">{errors.name.message}</span>
            ) : null}
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-ink">Телефон</span>
            <input
              type="tel"
              {...register("phone", {
                required: "Введите телефон",
                pattern: {
                  value: /^[+0-9()\-\s]{7,20}$/,
                  message: "Введите корректный телефон"
                }
              })}
              className="h-11 w-full rounded-xl border border-sand-200 px-3 text-sm outline-none focus:border-sand-400"
            />
            {errors.phone ? (
              <span className="text-xs text-red-600">{errors.phone.message}</span>
            ) : null}
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-ink">Адрес доставки</span>
            <textarea
              {...register("address", {
                required: "Введите адрес доставки",
                minLength: {
                  value: 8,
                  message: "Укажите более подробный адрес"
                }
              })}
              rows={4}
              className="w-full rounded-xl border border-sand-200 px-3 py-2 text-sm outline-none focus:border-sand-400"
            />
            {errors.address ? (
              <span className="text-xs text-red-600">{errors.address.message}</span>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={items.length === 0 || isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Отправляем заказ..." : "Подтвердить заказ"}
          </button>
        </form>
      </section>
    </div>
  );
}
