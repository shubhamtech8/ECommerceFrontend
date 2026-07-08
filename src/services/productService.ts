import { api2 } from "./axios";
import type { Product } from "../data/products";
import type {
  BrandInput,
  CategoryInput,
  ProductInput,
  ProductReviewInput,
  ProductVariantInput,
  SubCategoryInput,
} from "../components/product/productTypes";

// POST functions
export const createCategory = async (payload: CategoryInput) => {
  try {
    // Map frontend payload to backend DTO format (PascalCase)
    const backendPayload = {
      CategoryName: payload.name,
      CategoryDescription: payload.description,
      ImageUrl: payload.imageUrl,
      isActive: payload.isActive,
    };
    const response = await api2.post<any>(
      "/api/product/categories",
      backendPayload,
    );
    // Backend returns ApiResponse with data nested inside
    const item = response.data?.data || response.data;
    return {
      id: item.categoryID || item.id,
      name: item.categoryName || item.name,
      description: item.categoryDescription || item.description,
      imageUrl: item.imageUrl,
      isActive: item.isActive,
    };
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const createSubCategory = async (payload: SubCategoryInput) => {
  try {
    // Map frontend payload to backend DTO format (PascalCase)
    const backendPayload = {
      CategoryID: payload.categoryId,
      SubCategoryName: payload.name,
      SubCategoryDescription: payload.description,
      ImageUrl: payload.imageUrl,
      isActive: payload.isActive,
    };
    const response = await api2.post<any>(
      "/api/product/subcategories",
      backendPayload,
    );
    const item = response.data?.data || response.data;
    return {
      id: item.subCategoryID || item.id,
      categoryId: item.categoryID || item.categoryId,
      categoryName: item.categoryName,
      name: item.subCategoryName || item.name,
      description: item.subCategoryDescription || item.description,
      imageUrl: item.imageUrl,
      isActive: item.isActive,
    };
  } catch (error) {
    console.error("Error creating subcategory:", error);
    throw error;
  }
};

export const createBrand = async (payload: BrandInput) => {
  try {
    // Map frontend payload to backend DTO format (PascalCase)
    const backendPayload = {
      BrandName: payload.name,
      BrandUrl: payload.brandUrl,
      BrandDescription: payload.description,
      WebsiteUrl: payload.websiteUrl,
      isActive: payload.isActive,
    };
    const response = await api2.post<any>(
      "/api/product/brands",
      backendPayload,
    );
    const item = response.data?.data || response.data;
    return {
      id: item.brandID || item.id,
      name: item.brandName || item.name,
      description: item.brandDescription || item.description,
      brandUrl: item.brandUrl,
      websiteUrl: item.websiteUrl,
      isActive: item.isActive,
    };
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
};

export const createProduct = async (payload: ProductInput) => {
  try {
    // Map frontend payload to backend DTO format (PascalCase)
    const backendPayload = {
      SubCategoryID: payload.subCategoryId,
      BrandID: payload.brandId,
      ProductName: payload.name,
      ProductShortDescription: payload.shortDescription,
      FullDescription: payload.fullDescription,
      SKU: payload.sku,
      ModelNumber: payload.modelNumber,
      Price: payload.price,
      Discount: payload.discount,
      DiscountType: payload.discountType,
      StockQty: String(payload.stockQuantity),
      ThumbnailImage: payload.thumbnailImage,
      isActive: String(payload.isActive), // Convert boolean to string for ProductDto
    };
    const response = await api2.post<any>(
      "/api/product/products",
      backendPayload,
    );
    const item = response.data?.data || response.data;
    return {
      id: item.productID || item.id,
      subCategoryId: item.subCategoryID || item.subCategoryId,
      subCategoryName: item.subCategoryName,
      brandId: item.brandID || item.brandId,
      brandName: item.brandName,
      name: item.productName || item.name,
      shortDescription: item.productShortDescription || item.shortDescription,
      fullDescription: item.fullDescription,
      sku: item.sku,
      modelNumber: item.modelNumber,
      price: item.price,
      discount: item.discount,
      discountType: item.discountType,
      stockQuantity: item.stockQty || item.stockQuantity,
      thumbnailImage: item.thumbnailImage,
      isActive:
        typeof item.isActive === "string"
          ? item.isActive === "true" || item.isActive === "True"
          : item.isActive,
    };
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const createProductVariant = async (payload: ProductVariantInput) => {
  try {
    // Map frontend payload to backend DTO format (PascalCase)
    const backendPayload = {
      ProductId: payload.productId,
      Color: payload.color,
      Price: payload.price,
      Description: payload.description,
      VariantName: payload.variantName,
      StockQuantity: String(payload.stockQuantity),
      isActive: payload.isActive,
    };
    const response = await api2.post<any>(
      "/api/product/product-variants",
      backendPayload,
    );
    const item = response.data?.data || response.data;
    return {
      id: item.variantID || item.id,
      productId: item.productID || item.productId,
      productName: item.productName,
      variantName: item.variantName,
      color: item.color,
      description: item.description,
      price: item.price,
      stockQuantity: item.stockQuantity || item.stockQty,
      isActive: item.isActive,
    };
  } catch (error) {
    console.error("Error creating product variant:", error);
    throw error;
  }
};

export const createProductReview = async (payload: ProductReviewInput) => {
  try {
    // Map frontend payload to backend DTO format (PascalCase)
    const backendPayload = {
      ProductId: payload.productId,
      ReviewTitle: payload.reviewTitle,
      ReviewDescription: payload.reviewDescription,
      Rating: payload.rating,
      ReviewImageUrl: payload.reviewImageUrl,
    };
    const response = await api2.post<any>(
      "/api/product/product-reviews",
      backendPayload,
    );
    const item = response.data?.data || response.data;
    return {
      id: item.reviewID || item.id,
      productId: item.productID || item.productId,
      productName: item.productName,
      reviewTitle: item.reviewTitle,
      reviewDescription: item.reviewDescription,
      rating: item.rating,
      reviewImageUrl: item.reviewImageUrl,
    };
  } catch (error) {
    console.error("Error creating product review:", error);
    throw error;
  }
};

// GET functions
export const getCategories = async () => {
  try {
    const response = await api2.get<any>("/api/product/categories");
    // Backend returns ApiResponse with data nested inside
    const data = response.data?.data || [];
    // Map backend response to match frontend model
    return data.map((item: any) => ({
      id: item.categoryID || item.id,
      name: item.categoryName || item.name,
      description: item.categoryDescription || item.description,
      imageUrl: item.imageUrl,
      isActive: item.isActive,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getSubCategories = async () => {
  try {
    const response = await api2.get<any>("/api/product/subcategories");
    const data = response.data?.data || [];
    return data.map((item: any) => ({
      id: item.subCategoryID || item.id,
      categoryId: item.categoryID || item.categoryId,
      categoryName: item.categoryName,
      name: item.subCategoryName || item.name,
      description: item.subCategoryDescription || item.description,
      imageUrl: item.imageUrl,
      isActive: item.isActive,
    }));
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

export const getBrands = async () => {
  try {
    const response = await api2.get<any>("/api/product/brands");
    const data = response.data?.data || [];
    return data.map((item: any) => ({
      id: item.brandID || item.id,
      name: item.brandName || item.name,
      description: item.brandDescription || item.description,
      brandUrl: item.brandUrl,
      websiteUrl: item.websiteUrl,
      isActive: item.isActive,
    }));
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export const getProductList = async (): Promise<Product[]> => {
  try {
    const response = await api2.get<any>("/api/product/product-list");
    const data = Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];

    return data.map((item: any) => {
      const originalPrice = Number(
        item.originalPrice ??
          item.OriginalPrice ??
          item.price ??
          item.Price ??
          0,
      );
      const price = Number(
        item.price ??
          item.Price ??
          item.originalPrice ??
          item.OriginalPrice ??
          0,
      );
      const discount =
        Number(item.discount ?? item.Discount ?? 0) ||
        (originalPrice > 0
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : 0);

      return {
        id:
          item.productId ??
          item.productID ??
          item.ProductId ??
          item.ProductID ??
          item.id,
        name: item.productName ?? item.ProductName ?? item.name,
        price,
        originalPrice,
        discount,
        image:
          item.image ??
          item.Image ??
          item.thumbnailImage ??
          item.ThumbnailImage ??
          "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300&h=300&fit=crop",
        category: item.category ?? item.Category ?? "General",
        rating: Number(item.rating ?? item.Rating ?? item.averageRatings ?? 0),
        reviews: Number(item.reviews ?? item.Reviews ?? item.totalReviews ?? 0),
        stock: Number(item.qty ?? item.Qty ?? item.stockQty ?? 0),
        variants: Array.isArray(item.variants ?? item.Variants)
          ? (item.variants ?? item.Variants).map((v: any) => ({
              variantId: v.variantId ?? v.VariantId ?? v.variantID ?? 0,
              variantName: v.variantName ?? v.VariantName ?? "",
              color: v.color ?? v.Color ?? "",
              price: Number(v.price ?? v.Price ?? 0),
              description: v.description ?? v.Description ?? "",
              stockQuantity: String(v.stockQuantity ?? v.StockQuantity ?? "0"),
              isActive: v.isActive ?? v.IsActive ?? false,
            }))
          : [],
      };
    });
  } catch (error) {
    console.error("Error fetching product list:", error);
    return [];
  }
};

export const getProducts = async () => {
  try {
    const response = await api2.get<any>("/api/product/products");
    const data = response.data?.data || [];
    return data.map((item: any) => ({
      id: item.productID || item.id,
      subCategoryId: item.subCategoryID || item.subCategoryId,
      subCategoryName: item.subCategoryName,
      brandId: item.brandID || item.brandId,
      brandName: item.brandName,
      name: item.productName || item.name,
      shortDescription: item.productShortDescription || item.shortDescription,
      fullDescription: item.fullDescription,
      sku: item.sku,
      modelNumber: item.modelNumber,
      price: item.price,
      discount: item.discount,
      discountType: item.discountType,
      stockQuantity: item.stockQty || item.stockQuantity,
      thumbnailImage: item.thumbnailImage,
      isActive:
        typeof item.isActive === "string"
          ? item.isActive === "true" || item.isActive === "True"
          : item.isActive,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductVariants = async () => {
  try {
    const response = await api2.get<any>("/api/product/product-variants");
    const data = response.data?.data || [];
    return data.map((item: any) => ({
      id: item.variantID || item.id,
      productId: item.productID || item.productId,
      productName: item.productName,
      variantName: item.variantName,
      color: item.color,
      description: item.description,
      price: item.price,
      stockQuantity: item.stockQuantity || item.stockQty,
      isActive: item.isActive,
    }));
  } catch (error) {
    console.error("Error fetching product variants:", error);
    return [];
  }
};

export const getProductReviews = async () => {
  try {
    const response = await api2.get<any>("/api/product/product-reviews");
    const data = response.data?.data || [];
    return data.map((item: any) => ({
      id: item.reviewID || item.id,
      productId: item.productID || item.productId,
      productName: item.productName,
      reviewTitle: item.reviewTitle,
      reviewDescription: item.reviewDescription,
      rating: item.rating,
      reviewImageUrl: item.reviewImageUrl,
    }));
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
};
