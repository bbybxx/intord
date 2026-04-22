import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Product } from "../types/product";

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

function splitCategory(rawCategory: string): string {
  const tokens = rawCategory.split(" ").filter(Boolean);

  if (tokens.length <= 1) {
    return rawCategory || "Без категории";
  }

  // CSV category starts with "Главная", then a root category.
  return tokens[1] ?? "Без категории";
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapCategory(rawCategory: string): { categoryId: string; categoryPath: any[] } {
  const categoryName = splitCategory(rawCategory);
  const categoryId = generateSlug(categoryName);
  
  return {
    categoryId,
    categoryPath: [
      {
        id: categoryId,
        slug: categoryId,
        name: categoryName
      }
    ]
  };
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

  // By default, shoe categories get numeric sizes.
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
    // Skip missing files: JSON is still generated with predictable paths.
  }
}

function mapRowToProduct(row: CsvRow, index: number): Product {
  const safePrice = Number.parseFloat(row.price);
  const articleId = (row.article || row.name)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "");

  const { categoryId, categoryPath } = mapCategory(row.category);

  return {
    id: articleId,
    article: row.article || articleId,
    name: row.name,
    categoryId,
    categoryPath,
    price: Number.isFinite(safePrice) ? Math.round(safePrice) : 0,
    shortDescription: `Артикул: ${row.article}`,
    description: `Товар из каталога ИНТЕРМАГ. Подробнее на странице товара: ${row.url}`,
    composition: "Уточняйте состав в карточке товара или у менеджера.",
    isNew: index < 24,
    imagePaths: [createImagePath(row)],
    sizes: inferSizes(splitCategory(row.category), row.name),
    createdAt: new Date(Date.UTC(2026, 0, 1 + index)).toISOString().slice(0, 10)
  };
}

async function run(): Promise<void> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const workspaceRoot = path.resolve(scriptDir, "..");
  const csvPath = path.resolve(workspaceRoot, "../data/base.csv");
  const outputPath = path.resolve(workspaceRoot, "data/products.json");

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

  const records: Product[] = [];

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
    records.push(mapRowToProduct(row, index));
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");

  // eslint-disable-next-line no-console
  console.log(`Generated ${records.length} products: ${outputPath}`);
}

run().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
