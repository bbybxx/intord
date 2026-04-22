import { Product } from "@/types/product";
import { CategoryPath } from "@/types/category";

export interface CsvProductRow {
  id: string;
  article?: string;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  shortDescription: string;
  description: string;
  composition: string;
  isNew: string;
  imagePaths: string;
  sizes: string;
  createdAt: string;
}

// Функция для преобразования строки категории в categoryId и categoryPath
function mapCategory(categoryStr: string): { categoryId: string; categoryPath: CategoryPath[] } {
  const categoryMap: Record<string, { id: string; name: string }> = {
    "Обувь": { id: "shoes", name: "Обувь" },
    "Одежда": { id: "clothing", name: "Одежда" },
    "Аксессуары": { id: "accessories", name: "Аксессуары" }
  };

  const normalizedCategory = categoryStr.trim();
  const categoryInfo = categoryMap[normalizedCategory] || { id: "other", name: "Другое" };

  return {
    categoryId: categoryInfo.id,
    categoryPath: [
      {
        id: categoryInfo.id,
        slug: categoryInfo.id,
        name: categoryInfo.name
      }
    ]
  };
}

export function mapCsvRowToProduct(row: CsvProductRow): Product {
  const { categoryId, categoryPath } = mapCategory(row.category);

  return {
    id: row.id,
    article: row.article ?? row.id,
    name: row.name,
    categoryId,
    categoryPath,
    price: Number(row.price),
    oldPrice: row.oldPrice ? Number(row.oldPrice) : undefined,
    shortDescription: row.shortDescription,
    description: row.description,
    composition: row.composition,
    isNew: row.isNew.toLowerCase() === "true",
    imagePaths: row.imagePaths
      .split("|")
      .map((path) => path.trim())
      .filter(Boolean),
    sizes: row.sizes
      .split("|")
      .map((size) => size.trim())
      .filter(Boolean),
    createdAt: row.createdAt
  };
}
