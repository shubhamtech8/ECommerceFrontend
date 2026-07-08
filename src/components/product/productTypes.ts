export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

export interface SubCategory {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

export interface Brand {
  id: number;
  name: string;
  brandUrl: string;
  description: string;
  websiteUrl: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  subCategoryId: number;
  subCategoryName: string;
  brandId: number;
  brandName: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  sku: string;
  modelNumber: string;
  price: number;
  discount: number;
  discountType: string;
  stockQuantity: number;
  thumbnailImage: string;
  isActive: boolean;
}

export interface ProductVariant {
  id: number;
  productId: number;
  productName: string;
  variantName: string;
  color: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface ProductReview {
  id: number;
  productId: number;
  productName: string;
  reviewTitle: string;
  reviewDescription: string;
  rating: number;
  reviewImageUrl: string;
}

export type CategoryInput = Omit<Category, "id">;
export type SubCategoryInput = Omit<SubCategory, "id" | "categoryName">;
export type BrandInput = Omit<Brand, "id">;
export type ProductInput = Omit<Product, "id" | "subCategoryName" | "brandName">;
export type ProductVariantInput = Omit<ProductVariant, "id" | "productName">;
export type ProductReviewInput = Omit<ProductReview, "id" | "productName">;
