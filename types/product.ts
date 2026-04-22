import { CategoryPath } from "./category";

export interface Product {
  id: string;
  article: string;
  name: string;
  categoryId: string;
  categoryPath: CategoryPath[];
  price: number;
  oldPrice?: number;
  shortDescription: string;
  description: string;
  composition: string;
  isNew: boolean;
  imagePaths: string[];
  sizes: string[];
  createdAt: string;
}
