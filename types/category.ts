export interface Category {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  level: number;
  path: string[];
  productCount: number;
  children?: Category[];
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface CategoryPath {
  id: string;
  slug: string;
  name: string;
}

export type CategoryFilter = {
  categoryId?: string;
  includeSubcategories?: boolean;
};