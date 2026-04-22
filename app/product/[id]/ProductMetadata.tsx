import type { Metadata } from "next";
import { getProductById } from "@/lib/products";

interface ProductMetadataProps {
  params: {
    id: string;
  };
}

export function generateMetadata({ params }: ProductMetadataProps): Metadata {
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