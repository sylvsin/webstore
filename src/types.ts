export interface Product {
  id: number;
  name: string;
  added: string;
  description: string;
  price: number;
  year: number;
  imageUrl: string;
  isAddedToCart?: boolean;
  productCategory: Array<{
    categoryId: number;
    category: undefined | null | string;
  }>
}

