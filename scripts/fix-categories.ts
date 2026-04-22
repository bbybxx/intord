import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Category } from "@/types/category";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function run(): Promise<void> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const workspaceRoot = path.resolve(scriptDir, "..");
  const productsPath = path.resolve(workspaceRoot, "data/products.json");
  const categoriesOutputPath = path.resolve(workspaceRoot, "data/categories.ts");

  // Читаем продукты
  const productsData = await readFile(productsPath, "utf8");
  const products = JSON.parse(productsData);

  // Собираем все уникальные категории из продуктов
  const categoryMap = new Map<string, Category>();
  
  for (const product of products) {
    for (let i = 0; i < product.categoryPath.length; i++) {
      const cat = product.categoryPath[i];
      const parentId = i > 0 ? generateSlug(product.categoryPath[i - 1].name) : null;
      const catId = generateSlug(cat.name);
      
      // Обновляем categoryPath с правильными id и slug
      product.categoryPath[i] = {
        id: catId,
        slug: catId,
        name: cat.name
      };
      
      if (!categoryMap.has(catId)) {
        categoryMap.set(catId, {
          id: catId,
          slug: catId,
          name: cat.name,
          parentId,
          level: i,
          path: product.categoryPath.slice(0, i + 1).map((c: any) => c.name),
          productCount: 0
        });
      }
    }
    
    // Обновляем categoryId продукта
    const leafCategory = product.categoryPath[product.categoryPath.length - 1];
    product.categoryId = leafCategory.id;
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
  
  const categories = Array.from(categoryMap.values());

  // Сохраняем обновленные продукты
  await writeFile(productsPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  // Генерируем файл категорий
  const categoriesContent = `import { Category } from "@/types/category";

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export default categories;
`;

  await writeFile(categoriesOutputPath, categoriesContent, "utf8");

  console.log(`Обновлено ${products.length} товаров: ${productsPath}`);
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