import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createProduct } from "../../services/productService";
import type { Brand, ProductInput, SubCategory } from "./productTypes";

interface ProductFormProps {
  subCategories: SubCategory[];
  brands: Brand[];
  onCreated: (product: ProductInput) => void;
}

interface ProductFormState {
  subCategoryId: number | "";
  brandId: number | "";
  name: string;
  shortDescription: string;
  fullDescription: string;
  sku: string;
  modelNumber: string;
  price: string;
  discount: string;
  discountType: string;
  stockQuantity: string;
  thumbnailImage: string;
  isActive: boolean;
}

const initialState: ProductFormState = {
  subCategoryId: "",
  brandId: "",
  name: "",
  shortDescription: "",
  fullDescription: "",
  sku: "",
  modelNumber: "",
  price: "",
  discount: "",
  discountType: "Amount",
  stockQuantity: "",
  thumbnailImage: "",
  isActive: true,
};

const ProductForm = ({
  subCategories,
  brands,
  onCreated,
}: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormState>(initialState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormState, string>>
  >({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : name === "subCategoryId" || name === "brandId"
            ? value
              ? Number(value)
              : ""
            : value,
    }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ProductFormState, string>> = {};

    if (formData.subCategoryId === "") {
      nextErrors.subCategoryId = "SubCategory selection is required.";
    }

    if (formData.brandId === "") {
      nextErrors.brandId = "Brand selection is required.";
    }

    if (!formData.name.trim()) {
      nextErrors.name = "Product name is required.";
    }

    if (!formData.shortDescription.trim()) {
      nextErrors.shortDescription = "Short description is required.";
    }

    if (!formData.fullDescription.trim()) {
      nextErrors.fullDescription = "Full description is required.";
    }

    if (!formData.sku.trim()) {
      nextErrors.sku = "SKU is required.";
    }

    if (!formData.modelNumber.trim()) {
      nextErrors.modelNumber = "Model number is required.";
    }

    const priceValue = Number(formData.price);
    if (!formData.price.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      nextErrors.price = "Price must be greater than 0.";
    }

    const stockValue = Number(formData.stockQuantity);
    if (
      !formData.stockQuantity.trim() ||
      Number.isNaN(stockValue) ||
      stockValue < 0
    ) {
      nextErrors.stockQuantity = "Stock quantity is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!validate()) {
      return;
    }

    const selectedSubCategory = subCategories.find(
      (subCategory) => subCategory.id === formData.subCategoryId,
    );
    const selectedBrand = brands.find((brand) => brand.id === formData.brandId);

    if (!selectedSubCategory) {
      setErrors((previous) => ({
        ...previous,
        subCategoryId: "Select a valid subcategory.",
      }));
      return;
    }

    if (!selectedBrand) {
      setErrors((previous) => ({
        ...previous,
        brandId: "Select a valid brand.",
      }));
      return;
    }

    setIsLoading(true);

    try {
      const payload: ProductInput = {
        subCategoryId: selectedSubCategory.id,
        brandId: selectedBrand.id,
        name: formData.name.trim(),
        shortDescription: formData.shortDescription.trim(),
        fullDescription: formData.fullDescription.trim(),
        sku: formData.sku.trim(),
        modelNumber: formData.modelNumber.trim(),
        price: Number(formData.price),
        discount: Number(formData.discount),
        discountType: formData.discountType,
        stockQuantity: Number(formData.stockQuantity),
        thumbnailImage: formData.thumbnailImage.trim(),
        isActive: formData.isActive,
      };

      await createProduct(payload);
      onCreated(payload);
      setMessage("Product saved successfully.");
      setFormData(initialState);
      setErrors({});
    } catch {
      setMessage("Unable to save product right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="form-card">
      <div className="form-card-header">
        <div className="form-card-heading">
          <p className="form-badge">Step 4</p>
          <h2 className="form-title">Add Product</h2>
          <p className="form-description">
            Connect the product to a subcategory and brand.
          </p>
        </div>
      </div>

      {message ? <div className="form-message success">{message}</div> : null}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="product-subcategory">
            SubCategory Dropdown
          </label>
          <select
            id="product-subcategory"
            name="subCategoryId"
            className={`form-select${errors.subCategoryId ? " error" : ""}`}
            value={formData.subCategoryId}
            onChange={handleChange}
          >
            <option value="">Select subcategory</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.categoryName} / {subCategory.name}
              </option>
            ))}
          </select>
          {errors.subCategoryId ? (
            <span className="form-error">{errors.subCategoryId}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="product-brand">
            Brand Dropdown
          </label>
          <select
            id="product-brand"
            name="brandId"
            className={`form-select${errors.brandId ? " error" : ""}`}
            value={formData.brandId}
            onChange={handleChange}
          >
            <option value="">Select brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brandId ? (
            <span className="form-error">{errors.brandId}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            name="name"
            type="text"
            className={`form-input${errors.name ? " error" : ""}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="iPhone 16"
          />
          {errors.name ? (
            <span className="form-error">{errors.name}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="product-short-description">
            Product Short Description
          </label>
          <textarea
            id="product-short-description"
            name="shortDescription"
            className={`form-textarea${errors.shortDescription ? " error" : ""}`}
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="Compact summary of the product"
          />
          {errors.shortDescription ? (
            <span className="form-error">{errors.shortDescription}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="product-full-description">
            Full Description
          </label>
          <textarea
            id="product-full-description"
            name="fullDescription"
            className={`form-textarea${errors.fullDescription ? " error" : ""}`}
            value={formData.fullDescription}
            onChange={handleChange}
            placeholder="Complete product description"
          />
          {errors.fullDescription ? (
            <span className="form-error">{errors.fullDescription}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="product-sku">
            SKU
          </label>
          <input
            id="product-sku"
            name="sku"
            type="text"
            className={`form-input${errors.sku ? " error" : ""}`}
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU-001"
          />
          {errors.sku ? <span className="form-error">{errors.sku}</span> : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="product-model-number">
            Model Number
          </label>
          <input
            id="product-model-number"
            name="modelNumber"
            type="text"
            className={`form-input${errors.modelNumber ? " error" : ""}`}
            value={formData.modelNumber}
            onChange={handleChange}
            placeholder="MDL-2026"
          />
          {errors.modelNumber ? (
            <span className="form-error">{errors.modelNumber}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="product-price">
            Price
          </label>
          <input
            id="product-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            className={`form-input${errors.price ? " error" : ""}`}
            value={formData.price}
            onChange={handleChange}
            placeholder="999.99"
          />
          {errors.price ? (
            <span className="form-error">{errors.price}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="product-discount">
            Discount
          </label>
          <input
            id="product-discount"
            name="discount"
            type="number"
            min="0"
            step="0.01"
            className={`form-input${errors.discount ? " error" : ""}`}
            value={formData.discount}
            onChange={handleChange}
            placeholder="100"
          />
          {errors.discount ? (
            <span className="form-error">{errors.discount}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="product-discount-type">
            Discount Type
          </label>
          <select
            id="product-discount-type"
            name="discountType"
            className={`form-select${errors.discountType ? " error" : ""}`}
            value={formData.discountType}
            onChange={handleChange}
          >
            <option value="Amount">Amount</option>
            <option value="Percentage">Percentage</option>
          </select>
          {errors.discountType ? (
            <span className="form-error">{errors.discountType}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="product-stock-quantity">
            Stock Quantity
          </label>
          <input
            id="product-stock-quantity"
            name="stockQuantity"
            type="number"
            min="0"
            step="1"
            className={`form-input${errors.stockQuantity ? " error" : ""}`}
            value={formData.stockQuantity}
            onChange={handleChange}
            placeholder="100"
          />
          {errors.stockQuantity ? (
            <span className="form-error">{errors.stockQuantity}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="product-thumbnail-image">
            Thumbnail Image
          </label>
          <input
            id="product-thumbnail-image"
            name="thumbnailImage"
            type="url"
            className={`form-input${errors.thumbnailImage ? " error" : ""}`}
            value={formData.thumbnailImage}
            onChange={handleChange}
            placeholder="https://example.com/product.png"
          />
          {errors.thumbnailImage ? (
            <span className="form-error">{errors.thumbnailImage}</span>
          ) : null}
        </div>

        <label className="checkbox-field">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span className="checkbox-copy">
            <span className="checkbox-title">Is Active</span>
            <span className="checkbox-subtitle">
              Publish the product in the catalog.
            </span>
          </span>
        </label>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Saving Product..." : "Save Product"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProductForm;
