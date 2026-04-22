import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-sand-600">Корзина</p>
        <h1 className="mt-2 font-heading text-4xl text-ink">Оформление заказа</h1>
      </div>

      <CheckoutClient />
    </div>
  );
}
