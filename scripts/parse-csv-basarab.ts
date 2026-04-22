import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Product } from "../types/product";
import { Category, CategoryPath } from "../types/category";

interface CsvRow {
  url: string;
  name: string;
  price: string;
  category: string;
  image_url: string;
  image_file: string;
  article: string;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapToBasarabCategories(rawCategory: string, productName: string): { name: string; slug: string }[] {
  const cleanCategory = rawCategory.replace(/^Главная\s+/, "");
  const lowerCategory = cleanCategory.toLowerCase();
  const lowerName = productName.toLowerCase();

  // Определяем основную категорию
  let mainCategory = "";
  let subCategory = "";
  let specificCategory = "";

  // 1. Определяем основную категорию (4 большие категории)
  if (lowerCategory.includes("аксессуар") || lowerCategory.includes("средства ухода") || lowerCategory.includes("стельк")) {
    mainCategory = "Аксессуары";
    
    // Подкатегории для аксессуаров
    if (lowerCategory.includes("средства ухода") || 
        lowerName.includes("дезодорант") || 
        lowerName.includes("очиститель") ||
        lowerName.includes("краска") ||
        lowerName.includes("спрей") ||
        lowerName.includes("салфетк")) {
      subCategory = "Средства ухода";
    } else if (lowerCategory.includes("стельк") || lowerName.includes("стельк") || lowerName.includes("подпяточник")) {
      subCategory = "Стельки";
    } else {
      subCategory = "Все аксессуары";
    }
    
    specificCategory = subCategory;
    
  } else if (lowerCategory.includes("мужская обувь") || lowerName.includes("мужск") || lowerName.includes("муж.")) {
    mainCategory = "Мужская обувь";
    
    // Подкатегории для мужской обуви
    if (lowerCategory.includes("спортивная") || lowerName.includes("кед") || lowerName.includes("кроссовк")) {
      subCategory = "Спортивная обувь";
    } else if (lowerCategory.includes("туфл") && lowerCategory.includes("комфорт")) {
      subCategory = "Туфли комфорт";
    } else if (lowerCategory.includes("летняя") || lowerName.includes("сандал") || lowerName.includes("босоножк")) {
      subCategory = "Летняя обувь";
    } else if (lowerCategory.includes("ботинк") && lowerCategory.includes("комфорт")) {
      subCategory = "Ботинки комфорт";
    } else if (lowerCategory.includes("ботинк") && lowerCategory.includes("спорт")) {
      subCategory = "Ботинки спорт";
    } else if (lowerCategory.includes("ботинк") && lowerCategory.includes("классические")) {
      subCategory = "Ботинки классические";
    } else if (lowerCategory.includes("ботинк")) {
      subCategory = "Ботинки комфорт"; // по умолчанию
    } else if (lowerCategory.includes("туфл")) {
      subCategory = "Туфли комфорт"; // по умолчанию
    } else {
      subCategory = "Вся мужская обувь";
    }
    
    specificCategory = subCategory;
    
  } else if (lowerCategory.includes("женская обувь") || (lowerCategory.includes("женск") && lowerCategory.includes("обувь"))) {
    mainCategory = "Женская обувь";
    
    // Подкатегории для женской обуви
    if (lowerCategory.includes("босоногая") || lowerName.includes("балетк") || lowerName.includes("босоножк")) {
      subCategory = "Босоногая обувь";
    } else if (lowerCategory.includes("спортивная") || lowerName.includes("кед") || lowerName.includes("кроссовк")) {
      subCategory = "Спортивная обувь";
    } else if (lowerCategory.includes("туфл") && lowerCategory.includes("комфорт")) {
      subCategory = "Туфли комфорт";
    } else if (lowerCategory.includes("туфл") && (lowerCategory.includes("каблук") || lowerName.includes("каблук"))) {
      subCategory = "Туфли на каблуке";
    } else if (lowerCategory.includes("летняя") || lowerName.includes("сандал")) {
      subCategory = "Летняя обувь";
    } else if (lowerCategory.includes("открытая") && lowerCategory.includes("каблук")) {
      subCategory = "Открытая обувь на каблуке";
    } else if (lowerCategory.includes("ботинк") && lowerCategory.includes("спорт")) {
      subCategory = "Ботинки спорт";
    } else if (lowerCategory.includes("ботинк") && lowerCategory.includes("комфорт")) {
      subCategory = "Ботинки комфорт";
    } else if (lowerCategory.includes("ботинк") && lowerCategory.includes("каблук")) {
      subCategory = "Ботинки на каблуке";
    } else if (lowerCategory.includes("сапог")) {
      subCategory = "Сапоги";
    } else if (lowerCategory.includes("ботинк")) {
      subCategory = "Ботинки комфорт"; // по умолчанию
    } else if (lowerCategory.includes("туфл")) {
      subCategory = "Туфли комфорт"; // по умолчанию
    } else {
      subCategory = "Вся женская обувь";
    }
    
    specificCategory = subCategory;
    
  } else if (lowerCategory.includes("женская одежда") || (lowerCategory.includes("женск") && (lowerCategory.includes("одежд") || lowerName.includes("блуз") || lowerName.includes("плать") || lowerName.includes("юбк")))) {
    mainCategory = "Женская одежда";
    
    // Подкатегории для женской одежды
    if (lowerCategory.includes("костюм") || lowerName.includes("костюм")) {
      subCategory = "Костюмы";
    } else if (lowerCategory.includes("плать") || lowerName.includes("плать") || lowerName.includes("сарафан")) {
      subCategory = "Платья и сарафаны";
    } else if (lowerCategory.includes("брюк") || lowerName.includes("брюк")) {
      subCategory = "Брюки";
    } else if (lowerCategory.includes("юбк") || lowerName.includes("юбк")) {
      subCategory = "Юбки";
    } else if (lowerCategory.includes("блуз") || lowerCategory.includes("рубашк") || lowerName.includes("блуз") || lowerName.includes("рубаш")) {
      subCategory = "Блузы и рубашки";
    } else if (lowerCategory.includes("футболк") || lowerCategory.includes("топ") || lowerName.includes("футбол") || lowerName.includes("майк") || lowerName.includes("топ")) {
      subCategory = "Футболки и топы";
    } else {
      subCategory = "Вся женская одежда";
    }
    
    specificCategory = subCategory;
    
  } else {
    // Если не удалось определить, используем "Аксессуары" как категорию по умолчанию
    mainCategory = "Аксессуары";
    subCategory = "Все аксессуары";
    specificCategory = subCategory;
  }

  // Строим иерархию категорий
  const categories = [
    { name: mainCategory, slug: generateSlug(mainCategory) },
    { name: subCategory, slug: generateSlug(subCategory) }
  ];

  // Для некоторых категорий добавляем третий уровень
  if (mainCategory === "Аксессуары" && subCategory === "Средства ухода") {
    // Определяем тип средства ухода
    let careType = "Все средства ухода";
    if (lowerName.includes("дезодорант")) careType = "Дезодоранты";
    else if (lowerName.includes("очиститель")) careType = "Очистители";
    else if (lowerName.includes("краска")) careType = "Краски";
    else if (lowerName.includes("спрей")) careType = "Спреи";
    else if (lowerName.includes("салфетк")) careType = "Салфетки";
    
    categories.push({ name: careType, slug: generateSlug(careType) });
  }

  return categories;
}

function createImagePath(row: CsvRow): string {
  const source = row.image_file || row.article;
  const normalized = source.replaceAll("\\", "/").replace(/^\/+/, "");
  const filename = path.basename(normalized);
  const folder = row.article || path.basename(path.dirname(normalized));

  return `/images/products/${folder}/${filename}`;
}

function inferSizes(category: string, name: string): string[] {
  const lower = `${category} ${name}`.toLowerCase();

  const clothesPattern =
    /блуз|рубаш|футбол|худи|толстов|плать|юбк|брюк|джинс|свитер|кофт|пальто|куртк/;
  const accessoriesPattern = /аксессуар|средства ухода|стельк|сумк|ремень|шарф/;

  if (clothesPattern.test(lower)) {
    return ["XS", "S", "M", "L", "XL"];
  }

  if (accessoriesPattern.test(lower)) {
    return ["ONE SIZE"];
  }

  // По умолчанию для обуви числовые размеры
  return ["36", "37", "38", "39", "40", "41"];
}

async function copyImageToPublic(row: CsvRow, workspaceRoot: string): Promise<void> {
  const sourceRelative = (row.image_file || "").replaceAll("\\", "/").replace(/^\/+/, "");

  if (!sourceRelative) {
    return;
  }

  const fileName = path.basename(sourceRelative);
  const folder = row.article || path.basename(path.dirname(sourceRelative));
  const sourceAbsolute = path.resolve(workspaceRoot, "..", sourceRelative);
  const targetAbsolute = path.resolve(
    workspaceRoot,
    "public/images/products",
    folder,
    fileName
  );

  await mkdir(path.dirname(targetAbsolute), { recursive: true });

  try {
    await copyFile(sourceAbsolute, targetAbsolute);
  } catch {
    // Пропускаем отсутствующие файлы
  }
}

function mapRowToProduct(
  row: CsvRow, 
  index: number
): Product {
  const safePrice = Number.parseFloat(row.price);
  const articleId = (row.article || row.name)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "");

  const categoryHierarchy = mapToBasarabCategories(row.category, row.name);
  const leafCategory = categoryHierarchy[categoryHierarchy.length - 1];
  const leafCategoryId = generateSlug(leafCategory.name);
  
  const categoryPath: CategoryPath[] = categoryHierarchy.map(cat => ({
    id: generateSlug(cat.name),
    slug: cat.slug,
    name: cat.name
  }));

  return {
    id: articleId,
    article: row.article || articleId,
    name: row.name,
    categoryId: leafCategoryId,
    categoryPath,
    price: Number.isFinite(safePrice) ? Math.round(safePrice) : 0,
    shortDescription: `Артикул: ${row.article}`,
    description: `Товар из каталога ИНТЕРМАГ. Подробнее на странице товара: ${row.url}`,
    composition: "Уточняйте состав в карточке товара или у менеджера.",
    isNew: index < 24,
    imagePaths: [createImagePath(row)],
    sizes: inferSizes(leafCategory.name, row.name),
    createdAt: new Date(Date.UTC(2026, 0, 1 + index)).toISOString().slice(0, 10)
  };
}

function buildCategoriesFromProducts(products: Product[]): Category[] {
  const categoryMap = new Map<string, Category>();
  
  // Сначала собираем все уникальные категории из путей
  for (const product of products) {
    for (let i = 0; i < product.categoryPath.length; i++) {
      const cat = product.categoryPath[i];
      const parentId = i > 0 ? product.categoryPath[i - 1].id : null;
      
      if (!categoryMap.has(cat.id)) {
        categoryMap.set(cat.id, {
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          parentId,
          level: i,
          path: product.categoryPath.slice(0, i + 1).map(c => c.name),
          productCount: 0
        });
      }
    }
  }
  
  // Подсчитываем количество товаров в конечных категориях
  for (const product of products) {
    const leafCategoryId = product.categoryId;
    const category = categoryMap.get(leafCategoryId);
    if (category) {
      category.productCount++;
    }
  }
  
  // Обновляем количество товаров в родительских категориях
  for (const category of categoryMap.values()) {
    if (category.parentId) {
      let currentParentId: string | null = category.parentId;
      while (currentParentId) {
        const parentCategory = categoryMap.get(currentParentId);
        if (parentCategory) {
          parentCategory.productCount += category.productCount;
          currentParentId = parentCategory.parentId;
        } else {
          break;
        }
      }
    }
  }
  
  return Array.from(categoryMap.values());
}

async function run(): Promise<void> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const workspaceRoot = path.resolve(scriptDir, "..");
  const csvPath = path.resolve(workspaceRoot, "../data/base.csv");
  const productsOutputPath = path.resolve(workspaceRoot, "data/products.json");
  const categoriesOutputPath = path.resolve(workspaceRoot, "data/categories.ts");

  const raw = await readFile(csvPath, "utf8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length <= 1) {
    throw new Error("CSV пустой или содержит только заголовок.");
  }

  const header = parseCsvLine(lines[0]);
  const requiredHeaders: Array<keyof CsvRow> = [
    "url",
    "name",
    "price",
    "category",
    "image_url",
    "image_file",
    "article"
  ];

  for (const key of requiredHeaders) {
    if (!header.includes(key)) {
      throw new Error(`В CSV отсутствует обязательная колонка: ${key}`);
    }
  }

  const products: Product[] = [];

  for (const [index, line] of lines.slice(1).entries()) {
    const cols = parseCsvLine(line);
    if (cols.length !== header.length) {
      continue;
    }

    const row: CsvRow = {
      url: cols[header.indexOf("url")] ?? "",
      name: cols[header.indexOf("name")] ?? "",
      price: cols[header.indexOf("price")] ?? "",
      category: cols[header.indexOf("category")] ?? "",
      image_url: cols[header.indexOf("image_url")] ?? "",
      image_file: cols[header.indexOf("image_file")] ?? "",
      article: cols[header.indexOf("article")] ?? ""
    };

    await copyImageToPublic(row, workspaceRoot);
    
    const product = mapRowToProduct(row, index);
    products.push(product);
  }

  // Строим категории на основе всех продуктов
  const categories = buildCategoriesFromProducts(products);

  await mkdir(path.dirname(productsOutputPath), { recursive: true });
  await writeFile(productsOutputPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  // Генерируем файл категорий
  const categoriesContent = `import { Category } from "@/types/category";

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export default categories;
`;

  await writeFile(categoriesOutputPath, categoriesContent, "utf8");

  console.log(`Сгенерировано ${products.length} товаров: ${productsOutputPath}`);
  console.log(`Сгенерировано ${categories.length} категорий: ${categoriesOutputPath}`);
  
  // Выводим статистику по категориям
  console.log("\nСтатистика категорий по структуре basarab.ru:");
  const rootCategories = categories.filter(cat => cat.parentId === null);
  for (const rootCat of rootCategories) {
    console.log(`\n${rootCat.name}: ${rootCat.productCount} товаров`);
    const children = categories.filter(cat => cat.parentId === rootCat.id);
    for (const child of children) {
      console.log(`  - ${child.name}: ${child.productCount} товаров`);
      const grandchildren = categories.filter(cat => cat.parentId === child.id);
      for (const grandchild of grandchildren) {
        console.log(`    - ${grandchild.name}: ${grandchild.productCount} товаров`);
      }
    }
  }
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});