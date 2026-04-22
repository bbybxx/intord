import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function generateSlug(name: string): string {
  if (!name || name.trim() === '') return 'bez-kategorii';
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

  // Читаем продукты
  const productsData = await readFile(productsPath, "utf8");
  const products = JSON.parse(productsData);

  console.log(`Всего товаров: ${products.length}`);
  
  // Проверяем первые 5 товаров
  for (let i = 0; i < Math.min(5, products.length); i++) {
    const product = products[i];
    console.log(`\nТовар ${i + 1}: ${product.name}`);
    console.log(`Категория из CSV: ${product.category || 'нет'}`);
    console.log(`CategoryPath длина: ${product.categoryPath.length}`);
    
    for (let j = 0; j < product.categoryPath.length; j++) {
      const cat = product.categoryPath[j];
      console.log(`  Уровень ${j}: name="${cat.name}", id="${cat.id}", slug="${cat.slug}"`);
      console.log(`    Генерируем slug: ${generateSlug(cat.name)}`);
    }
    
    console.log(`CategoryId: ${product.categoryId}`);
  }
  
  // Проверяем все уникальные категории
  console.log("\n\nПроверка всех уникальных категорий:");
  const allCategories = new Map<string, any>();
  
  for (const product of products) {
    for (const cat of product.categoryPath) {
      if (!allCategories.has(cat.name)) {
        allCategories.set(cat.name, {
          name: cat.name,
          id: cat.id,
          slug: cat.slug,
          count: 0
        });
      }
      const entry = allCategories.get(cat.name)!;
      entry.count++;
    }
  }
  
  console.log(`Всего уникальных категорий: ${allCategories.size}`);
  
  // Выводим первые 10 категорий
  let count = 0;
  for (const [name, cat] of allCategories) {
    if (count++ < 10) {
      console.log(`"${name}": id="${cat.id}", slug="${cat.slug}", товаров=${cat.count}`);
    }
  }
  
  // Проверяем категории с пустыми id
  console.log("\nКатегории с пустыми id:");
  for (const [name, cat] of allCategories) {
    if (!cat.id || cat.id === '') {
      console.log(`"${name}": id="${cat.id}"`);
    }
  }
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});