import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import SubCategoryForm from "./SubCategoryForm";
import BrandForm from "./BrandForm";
import ProductForm from "./ProductForm";
import ProductVariantForm from "./ProductVariantForm";
import ProductReviewForm from "./ProductReviewForm";
import {
  getCategories,
  getSubCategories,
  getBrands,
  getProducts,
  getProductVariants,
  getProductReviews,
} from "../../services/productService";
import "./ProductManagement.css";
import type {
  Brand,
  BrandInput,
  Category,
  CategoryInput,
  Product,
  ProductInput,
  ProductReview,
  ProductReviewInput,
  ProductVariant,
  ProductVariantInput,
  SubCategory,
  SubCategoryInput,
} from "./productTypes";


const ProductManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data from API on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          categoriesData,
          subCategoriesData,
          brandsData,
          productsData,
          variantsData,
          reviewsData,
        ] = await Promise.all([
          getCategories(),
          getSubCategories(),
          getBrands(),
          getProducts(),
          getProductVariants(),
          getProductReviews(),
        ]);

        setCategories(categoriesData);
        setSubCategories(subCategoriesData);
        setBrands(brandsData);
        setProducts(productsData);
        setVariants(variantsData);
        setReviews(reviewsData);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load product data";
        setError(errorMessage);
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleCategoryCreated = async () => {
    // Refresh categories from API
    const updatedCategories = await getCategories();
    setCategories(updatedCategories);
  };

  const handleSubCategoryCreated = async () => {
    // Refresh subcategories from API
    const updatedSubCategories = await getSubCategories();
    setSubCategories(updatedSubCategories);
  };

  const handleBrandCreated = async () => {
    // Refresh brands from API
    const updatedBrands = await getBrands();
    setBrands(updatedBrands);
  };

  const handleProductCreated = async () => {
    // Refresh products from API
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
  };

  const handleVariantCreated = async () => {
    // Refresh variants from API
    const updatedVariants = await getProductVariants();
    setVariants(updatedVariants);
  };

  const handleReviewCreated = async () => {
    // Refresh reviews from API
    const updatedReviews = await getProductReviews();
    setReviews(updatedReviews);
  };

  return (
    <main className="product-admin-page">
      <div className="product-admin-shell">
        <section className="admin-hero">
          <p className="admin-kicker">Catalog Administration</p>
          <h1 className="admin-title">Product Catalog Management</h1>
          <p className="admin-subtitle">
            Create your catalog from the top of the hierarchy down: category,
            subcategory, brand, product, variant, and review.
          </p>
          <div className="admin-hierarchy" aria-label="Catalog hierarchy">
            <span className="hierarchy-step">Category</span>
            <span className="hierarchy-arrow">↓</span>
            <span className="hierarchy-step">SubCategory</span>
            <span className="hierarchy-arrow">↓</span>
            <span className="hierarchy-step">Brand</span>
            <span className="hierarchy-arrow">↓</span>
            <span className="hierarchy-step">Product</span>
            <span className="hierarchy-arrow">↓</span>
            <span className="hierarchy-step">Variant</span>
            <span className="hierarchy-arrow">↓</span>
            <span className="hierarchy-step">Review</span>
          </div>
        </section>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#fee",
              color: "#c33",
              borderRadius: "4px",
              marginBottom: "16px",
              border: "1px solid #fcc",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {isLoading ? (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: "#666",
            }}
          >
            Loading product data...
          </div>
        ) : (
          <div className="product-management-stack">
            <CategoryForm onCreated={handleCategoryCreated} />
            <SubCategoryForm
              categories={categories}
              onCreated={handleSubCategoryCreated}
            />
            <BrandForm onCreated={handleBrandCreated} />
            <ProductForm
              subCategories={subCategories}
              brands={brands}
              onCreated={handleProductCreated}
            />
            <ProductVariantForm
              products={products}
              onCreated={handleVariantCreated}
            />
            <ProductReviewForm
              products={products}
              onCreated={handleReviewCreated}
            />
          </div>
        )}

        <section className="admin-hero" style={{ marginTop: "24px" }}>
          <p className="admin-kicker">Saved Drafts</p>
          <p className="admin-subtitle">
            Categories: {categories.length} | SubCategories:{" "}
            {subCategories.length} | Brands: {brands.length} | Products:{" "}
            {products.length} | Variants: {variants.length} | Reviews:{" "}
            {reviews.length}
          </p>
        </section>
      </div>
    </main>
  );
};

export default ProductManagement;
