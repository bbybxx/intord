import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: {
    order?: string;
  };
}

function makeFallbackOrderId(): string {
  return `${Date.now()}${Math.floor(Math.random() * 900 + 100)}`;
}

export default function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams.order ?? makeFallbackOrderId();

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="w-full rounded-3xl border border-sand-100 bg-white p-8 text-center shadow-card sm:p-12">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-sand-600">Заказ оформлен</p>
        <h1 className="mt-2 font-heading text-4xl text-ink">Спасибо за покупку</h1>
        <p className="mt-3 text-sm text-slate-600">
          Мы получили ваш заказ и уже передали его в обработку.
        </p>

        <div className="mt-6 rounded-2xl border border-sand-100 bg-sand-50 p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Номер заказа</p>
          <p className="mt-2 text-lg font-semibold text-ink">#{orderId}</p>
        </div>

        <Link
          href="/catalog"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Вернуться за покупками
        </Link>
      </section>
    </div>
  );
}
