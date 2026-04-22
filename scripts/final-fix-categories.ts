import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Category } from "@/types/category";

function generateSlug(name: string): string {
  if (!name || name.trim() === '') return 'bez-kategorii';
  
  // Транслитерация кириллицы в латиницу
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': '-'
  };
  
  let slug = name.toLowerCase();
  
  // Транслитерация
  slug = slug.split('').map(char => translitMap[char] || char).join('');
  
  // Удаляем все не-латинские символы и цифры, кроме дефиса
  slug = slug.replace(/[^a-z0-9-]/g, '');
  
  // Убираем множественные дефисы
  slug = slug.replace(/-+/g, '-');
  
  // Убираем дефисы в начале и конце
  slug = slug.replace(/^-|-$/g, '');
  
  // Если после всех преобразований строка пустая, используем fallback
  if (!slug) {
    // Создаем slug из первых букв слов
    const words = name.toLowerCase().split(/\s+/).filter(w => w);
    if (words.length > 0) {
      slug = words.map(w => w.charAt(0)).join('');
    } else {
      slug = 'cat';
    }
  }
  
  return slug;
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
  
  console.log(`Обработка ${products.length} товаров...`);
  
  for (const product of products) {
    const newCategoryPath = [];
    
    for (let i = 0; i < product.categoryPath.length; i++) {
      const cat = product.categoryPath[i];
      const catName = cat.name || 'Без категории';
      const catId = generateSlug(catName);
      const parentId = i > 0 ? generateSlug(product.categoryPath[i - 1].name || '') : null;
      
      const newCat = {
        id: catId,
        slug: catId,
        name: catName
      };
      
      newCategoryPath.push(newCat);
      
      if (!categoryMap.has(catId)) {
        categoryMap.set(catId, {
          id: catId,
          slug: catId,
          name: catName,
          parentId,
          level: i,
          path: newCategoryPath.map(c => c.name),
          productCount: 0
        });
      }
    }
    
    // Обновляем categoryPath и categoryId продукта
    product.categoryPath = newCategoryPath;
    if (newCategoryPath.length > 0) {
      const leafCategory = newCategoryPath[newCategoryPath.length - 1];
      product.categoryId = leafCategory.id;
    } else {
      product.categoryId = 'bez-kategorii';
    }
  }
  
  console.log(`Найдено ${categoryMap.size} уникальных категорий`);
  
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
  console.log(`Обновлено ${products.length} товаров: ${productsPath}`);

  // Генерируем файл категорий
  const categoriesContent = `import { Category } from "@/types/category";

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export default categories;
`;

  await writeFile(categoriesOutputPath, categoriesContent, "utf8");
  console.log(`Сгенерировано ${categories.length} категорий: ${categoriesOutputPath}`);
  
  // Выводим статистику по категориям
  console.log("\nСтатистика категорий по структуре basarab.ru:");
  const rootCategories = categories.filter(cat => cat.parentId === null);
  console.log(`\nКорневых категорий: ${rootCategories.length}`);
  
  for (const rootCat of rootCategories) {
    console.log(`\n${rootCat.name} (${rootCat.id}): ${rootCat.productCount} товаров`);
    const children = categories.filter(cat => cat.parentId === rootCat.id);
    for (const child of children) {
      console.log(`  - ${child.name} (${child.id}): ${child.productCount} товаров`);
      const grandchildren = categories.filter(cat => cat.parentId === child.id);
      for (const grandchild of grandchildren) {
        console.log(`    - ${grandchild.name} (${grandchild.id}): ${grandchild.productCount} товаров`);
      }
    }
  }
  
  // Проверяем распределение по основным категориям
  console.log("\nРаспределение по основным категориям:");
  const mainCategories = ["Мужская обувь", "Женская обувь", "Женская одежда", "Аксессуары"];
  let totalProducts = 0;
  
  for (const mainCat of mainCategories) {
    const cat = categories.find(c => c.name === mainCat);
    if (cat) {
      console.log(`${mainCat}: ${cat.productCount} товаров`);
      totalProducts += cat.productCount;
    } else {
      console.log(`${mainCat}: 0 товаров (не найдена)`);
    }
  }
  
  console.log(`\nВсего товаров в основных категориях: ${totalProducts} из ${products.length}`);
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});