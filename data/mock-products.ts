import { Product } from "@/types/product";

export const mockProducts: Product[] = [
  {
    id: "shoe-001",
    article: "shoe-001",
    name: "Балетки кожаные Milk",
    categoryId: "shoes",
    categoryPath: [
      { id: "shoes", slug: "shoes", name: "Обувь" }
    ],
    price: 14990,
    oldPrice: 16990,
    shortDescription: "Мягкая кожа, анатомическая стелька и лаконичный силуэт.",
    description:
      "Повседневные балетки из натуральной кожи с деликатной посадкой. Подходят под базовый и офисный гардероб.",
    composition: "Верх: 100% кожа. Подкладка: 100% кожа. Подошва: тунит.",
    isNew: true,
    imagePaths: [
      "/images/products/shoe-001/1.jpg",
      "/images/products/shoe-001/2.jpg",
      "/images/products/shoe-001/3.jpg"
    ],
    sizes: ["35", "36", "37", "38", "39", "40"],
    createdAt: "2026-04-10"
  },
  {
    id: "shoe-002",
    article: "shoe-002",
    name: "Лоферы замшевые Caramel",
    categoryId: "shoes",
    categoryPath: [
      { id: "shoes", slug: "shoes", name: "Обувь" }
    ],
    price: 17990,
    shortDescription: "Замша премиум-класса и гибкая подошва.",
    description:
      "Лоферы с мягкой формой и аккуратной линией носка. Универсальная пара для города и путешествий.",
    composition: "Верх: 100% замша. Подкладка: 100% кожа. Подошва: резина.",
    isNew: false,
    imagePaths: [
      "/images/products/shoe-002/1.jpg",
      "/images/products/shoe-002/2.jpg"
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    createdAt: "2026-03-22"
  },
  {
    id: "cloth-001",
    article: "cloth-001",
    name: "Блуза женская Graphite",
    categoryId: "clothing",
    categoryPath: [
      { id: "clothing", slug: "clothing", name: "Одежда" }
    ],
    price: 8990,
    shortDescription: "Свободный крой и ткань с красивой фактурой.",
    description:
      "Минималистичная блуза со спущенным плечом и аккуратным воротником-стойкой. Сочетается с джинсами и классическими брюками.",
    composition: "70% вискоза, 30% полиэстер.",
    isNew: true,
    imagePaths: [
      "/images/products/cloth-001/1.jpg",
      "/images/products/cloth-001/2.jpg"
    ],
    sizes: ["XS", "S", "M", "L"],
    createdAt: "2026-04-15"
  },
  {
    id: "acc-001",
    article: "acc-001",
    name: "Сумка mini Saddle",
    categoryId: "accessories",
    categoryPath: [
      { id: "accessories", slug: "accessories", name: "Аксессуары" }
    ],
    price: 11990,
    shortDescription: "Компактная форма и регулируемый ремень.",
    description:
      "Сумка на каждый день с внутренним карманом и магнитной застежкой. Выполнена в гладкой коже.",
    composition: "100% кожа. Подкладка: 100% хлопок.",
    isNew: false,
    imagePaths: [
      "/images/products/acc-001/1.jpg",
      "/images/products/acc-001/2.jpg"
    ],
    sizes: ["ONE SIZE"],
    createdAt: "2026-02-28"
  }
];
