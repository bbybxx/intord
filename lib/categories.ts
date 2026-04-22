import { Category, CategoryTree, CategoryPath } from "@/types/category";
import categoriesData from "@/data/categories";

const categories = categoriesData;

export class CategoryManager {
  private categories: Map<string, Category>;
  private tree: CategoryTree[];

  constructor(categories: Category[]) {
    this.categories = new Map();
    categories.forEach(cat => this.categories.set(cat.id, cat));
    this.tree = this.buildTree(categories);
  }

  private buildTree(categories: Category[]): CategoryTree[] {
    const categoryMap = new Map<string, CategoryTree>();
    const roots: CategoryTree[] = [];

    // Сначала создаем все узлы
    categories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Затем связываем детей с родителями
    categories.forEach(cat => {
      const node = categoryMap.get(cat.id)!;
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // Если родитель не найден, добавляем как корневой
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  getTree(): CategoryTree[] {
    return this.tree;
  }

  getCategory(id: string): Category | undefined {
    return this.categories.get(id);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  getChildren(parentId: string | null): Category[] {
    return Array.from(this.categories.values())
      .filter(cat => cat.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }

  getPath(categoryId: string): CategoryPath[] {
    const path: CategoryPath[] = [];
    let currentId: string | null = categoryId;

    while (currentId) {
      const category = this.categories.get(currentId);
      if (!category) break;

      path.unshift({
        id: category.id,
        slug: category.slug,
        name: category.name
      });

      currentId = category.parentId;
    }

    return path;
  }

  getLeafCategories(): Category[] {
    const allIds = new Set(this.categories.keys());
    const parentIds = new Set(
      Array.from(this.categories.values())
        .map(cat => cat.parentId)
        .filter(Boolean) as string[]
    );

    return Array.from(this.categories.values())
      .filter(cat => !parentIds.has(cat.id))
      .sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }

  getRootCategories(): Category[] {
    return this.getChildren(null);
  }

  getCategoryWithChildren(id: string): CategoryTree | undefined {
    const tree = this.tree;
    
    function findNode(nodes: CategoryTree[]): CategoryTree | undefined {
      for (const node of nodes) {
        if (node.id === id) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return undefined;
    }
    
    return findNode(tree);
  }

  getAllSubcategoryIds(parentId: string): string[] {
    const result: string[] = [];
    const self = this;
    
    function collectIds(categoryId: string) {
      result.push(categoryId);
      const children = self.getChildren(categoryId);
      children.forEach(child => collectIds(child.id));
    }
    
    collectIds(parentId);
    return result;
  }
}

// Создаем глобальный экземпляр менеджера категорий
export const categoryManager = new CategoryManager(categories);

// Экспортируем вспомогательные функции
export function getCategoryTree(): CategoryTree[] {
  return categoryManager.getTree();
}

export function getCategoryById(id: string): Category | undefined {
  return categoryManager.getCategory(id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryManager.getCategoryBySlug(slug);
}

export function getCategoryChildren(parentId: string | null): Category[] {
  return categoryManager.getChildren(parentId);
}

export function getCategoryPath(categoryId: string): CategoryPath[] {
  return categoryManager.getPath(categoryId);
}

export function getLeafCategories(): Category[] {
  return categoryManager.getLeafCategories();
}

export function getRootCategories(): Category[] {
  return categoryManager.getRootCategories();
}

export function buildCategoryTree(categories: Category[]): CategoryTree[] {
  return new CategoryManager(categories).getTree();
}