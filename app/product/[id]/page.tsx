import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { ProductPageContent } from "@/components/product/ProductPageContent";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = getProductById(params.id);

  if (!product) {
    return {
      title: "Товар не найден | ИНТЕРМАГ",
      description: "Карточка товара не найдена."
    };
  }

  return {
    title: `${product.name} | ИНТЕРМАГ`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | ИНТЕРМАГ`,
      description: product.shortDescription,
      images: product.imagePaths[0] ? [product.imagePaths[0]] : []
    }
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductPageContent product={product} />;
}
