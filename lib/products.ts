import productsData from "@/data/products.json";
import { Product } from "@/types/product";
import { CategoryFilter } from "@/types/category";
import { categoryManager } from "./categories";

export type SortOption = "price-asc" | "price-desc";

export interface ProductFilters {
  query: string;
  categoryFilter: CategoryFilter;
  sort: SortOption;
}

// Функция для очистки описания от ссылок
function cleanDescription(description: string): string {
  // Удаляем ссылку на страницу товара и текст "Подробнее на странице товара:"
  return description
    .replace(/Подробнее на странице товара:.*$/, '')
    .replace(/Товар из каталога ИНТЕРМАГ\.\s*/, '')
    .trim();
}

// Очищаем описания при загрузке данных
const products = (productsData as Product[]).map(product => ({
  ...product,
  description: cleanDescription(product.description)
}));

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getNewProducts(limit = 4): Product[] {
  const sorted = [...products].sort(
    (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
  );

  const onlyNew = sorted.filter((product) => product.isNew);
  return (onlyNew.length > 0 ? onlyNew : sorted).slice(0, limit);
}

export function getProductsByCategory(
  categoryId: string, 
  includeSubcategories: boolean = true
): Product[] {
  if (!categoryId) return products;
  
  const categoryIds = includeSubcategories 
    ? [categoryId] // TODO: Добавить получение всех подкатегорий
    : [categoryId];
    
  return products.filter(product => 
    categoryIds.includes(product.categoryId)
  );
}

export function filterAndSortProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  const query = filters.query.trim().toLowerCase();
  const categoryId = filters.categoryFilter.categoryId;

  const filtered = products.filter((product) => {
    // Фильтрация по категории
    let matchCategory = true;
    if (categoryId) {
      if (filters.categoryFilter.includeSubcategories !== false) {
        // Проверяем, находится ли продукт в выбранной категории или её подкатегориях
        const productCategoryPathIds = product.categoryPath.map(cp => cp.id);
        matchCategory = productCategoryPathIds.includes(categoryId);
      } else {
        // Только точное совпадение с конечной категорией
        matchCategory = product.categoryId === categoryId;
      }
    }

    // Фильтрация по поисковому запросу
    const matchQuery =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      (product.article ?? product.id).toLowerCase().includes(query);

    return matchCategory && matchQuery;
  });

  // Сортировка
  return filtered.sort((a, b) => {
    if (filters.sort === "price-asc") {
      return a.price - b.price;
    }

    if (filters.sort === "price-desc") {
      return b.price - a.price;
    }

    return a.price - b.price;
  });
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}
