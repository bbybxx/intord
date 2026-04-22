"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Ruler } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const imageSrc = product.imagePaths && product.imagePaths.length > 0 
    ? product.imagePaths[0] 
    : "/images/fallback.jpg";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: Math.min(index * 0.05, 0.45) }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group overflow-hidden rounded-2xl border border-sand-100 bg-white shadow-card transition"
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand-50">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            onError={(e) => {
              // Если изображение не загружается, заменяем на fallback
              const target = e.target as HTMLImageElement;
              target.src = '/images/fallback.jpg';
            }}
          />
          {product.isNew ? (
            <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
              New
            </span>
          ) : null}
        </div>
      </Link>

       <div className="space-y-3 p-4">
         <p className="text-xs uppercase tracking-[0.18em] text-sand-600">
           {product.categoryPath && product.categoryPath.length > 0 ? product.categoryPath[0].name : product.categoryId}
         </p>

        <Link href={`/product/${product.id}`} className="block">
          <h3 className="font-heading text-lg text-ink transition hover:text-sand-800 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm text-slate-600 min-h-[2.5rem]">{product.shortDescription}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-ink">
              {formatPrice(product.price)} RUB
            </span>
            {product.oldPrice ? (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            ) : null}
          </div>

          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-sand-200 px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-sand-100"
          >
            <Ruler size={16} />
            Выбрать размер
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
