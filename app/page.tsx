import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { BackgroundImageSlider } from "@/components/ui/BackgroundImageSlider";
import { getNewProducts } from "@/lib/products";

const categories = [
  {
    title: "Мужская обувь",
    subtitle: "Ботинки, кеды, кроссовки",
    href: "/catalog?category=muzhskaya-obuv"
  },
  {
    title: "Женская обувь",
    subtitle: "Туфли, балетки, повседневные модели",
    href: "/catalog?category=zhenskaya-obuv"
  },
  {
    title: "Аксессуары",
    subtitle: "Сумки, уход и базовые дополнения",
    href: "/catalog?category=aksessuary"
  }
];

export default function HomePage() {
  const newProducts = getNewProducts(4);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-sand-100 p-8 sm:p-12">
        {/* Фоновый слайдер с изображениями */}
        <div className="absolute inset-0 z-0">
          <BackgroundImageSlider
            images={[
              "/images/collection/1.png",
              "/images/collection/2.png",
              "/images/collection/3.png"
            ]}
            interval={5000}
            className="h-full"
          />
        </div>
        
        {/* Декоративный элемент */}
        <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-sand-200/20 blur-3xl" />
        
        {/* Контент */}
        <div className="relative z-10 max-w-2xl space-y-6">
          <p className="text-xs uppercase tracking-[0.24em] text-white/90">New Collection</p>
          <h1 className="font-heading text-4xl leading-tight text-white sm:text-6xl">
            Минималистичный гардероб
            <br />
            на каждый день
          </h1>
          <p className="max-w-xl text-sm leading-6 text-white/90 sm:text-base">
            Чистые линии, благородные материалы и универсальные оттенки. Соберите
            образ, который работает в городе, в поездке и на каждый день.
          </p>
          <Link
            href="/catalog/categories"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:bg-white/90"
          >
            Перейти в каталог
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="mt-14 space-y-5">
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-3xl text-ink">Категории</h2>
          <Link href="/catalog/categories" className="text-sm font-medium text-sand-800 hover:text-ink">
            Смотреть все
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group rounded-2xl border border-sand-100 bg-white p-6 shadow-card transition hover:border-sand-300"
            >
              <h3 className="font-heading text-2xl text-ink">{category.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{category.subtitle}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm text-sand-800 transition group-hover:translate-x-1">
                Открыть
                <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 space-y-5">
        <h2 className="font-heading text-3xl text-ink">Новинки</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
