import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createProductVariant } from "../../services/productService";
import type { Product, ProductVariantInput } from "./productTypes";

interface ProductVariantFormProps {
  products: Product[];
  onCreated: (variant: ProductVariantInput) => void;
}

interface ProductVariantFormState {
  productId: number | "";
  variantName: string;
  color: string;
  description: string;
  price: string;
  stockQuantity: string;
  isActive: boolean;
}

const initialState: ProductVariantFormState = {
  productId: "",
  variantName: "",
  color: "",
  description: "",
  price: "",
  stockQuantity: "",
  isActive: true,
};

const ProductVariantForm = ({ products, onCreated }: ProductVariantFormProps) => {
  const [formData, setFormData] = useState<ProductVariantFormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductVariantFormState, string>>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox"
        ? (event.target as HTMLInputElement).checked
        : name === "productId"
          ? value
            ? Number(value)
            : ""
          : value,
    }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ProductVariantFormState, string>> = {};

    if (formData.productId === "") {
      nextErrors.productId = "Product selection is required.";
    }

    if (!formData.variantName.trim()) {
      nextErrors.variantName = "Variant name is required.";
    }

    if (!formData.color.trim()) {
      nextErrors.color = "Color is required.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Description is required.";
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

    const selectedProduct = products.find((product) => product.id === formData.productId);

    if (!selectedProduct) {
      setErrors((previous) => ({
        ...previous,
        productId: "Select a valid product.",
      }));
      return;
    }

    setIsLoading(true);

    try {
      const payload: ProductVariantInput = {
        productId: selectedProduct.id,
        variantName: formData.variantName.trim(),
        color: formData.color.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        isActive: formData.isActive,
      };

      await createProductVariant(payload);
      onCreated(payload);
      setMessage("Variant saved successfully.");
      setFormData(initialState);
      setErrors({});
    } catch {
      setMessage("Unable to save variant right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="form-card">
      <div className="form-card-header">
        <div className="form-card-heading">
          <p className="form-badge">Step 5</p>
          <h2 className="form-title">Add Product Variant</h2>
          <p className="form-description">
            Add size, color, or other variant-specific details.
          </p>
        </div>
      </div>

      {message ? (
        <div className="form-message success">{message}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="form-grid single-column">
        <div className="form-field">
          <label className="form-label" htmlFor="variant-product">
            Product Dropdown
          </label>
          <select
            id="variant-product"
            name="productId"
            className={`form-select${errors.productId ? " error" : ""}`}
            value={formData.productId}
            onChange={handleChange}
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {errors.productId ? (
            <span className="form-error">{errors.productId}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="variant-name">
            Variant Name
          </label>
          <input
            id="variant-name"
            name="variantName"
            type="text"
            className={`form-input${errors.variantName ? " error" : ""}`}
            value={formData.variantName}
            onChange={handleChange}
            placeholder="128 GB"
          />
          {errors.variantName ? (
            <span className="form-error">{errors.variantName}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="variant-color">
            Color
          </label>
          <input
            id="variant-color"
            name="color"
            type="text"
            className={`form-input${errors.color ? " error" : ""}`}
            value={formData.color}
            onChange={handleChange}
            placeholder="Black"
          />
          {errors.color ? <span className="form-error">{errors.color}</span> : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="variant-description">
            Description
          </label>
          <textarea
            id="variant-description"
            name="description"
            className={`form-textarea${errors.description ? " error" : ""}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="Variant-specific description"
          />
          {errors.description ? (
            <span className="form-error">{errors.description}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="variant-price">
            Price
          </label>
          <input
            id="variant-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            className={`form-input${errors.price ? " error" : ""}`}
            value={formData.price}
            onChange={handleChange}
            placeholder="1099.99"
          />
          {errors.price ? <span className="form-error">{errors.price}</span> : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="variant-stock-quantity">
            Stock Quantity
          </label>
          <input
            id="variant-stock-quantity"
            name="stockQuantity"
            type="number"
            min="0"
            step="1"
            className={`form-input${errors.stockQuantity ? " error" : ""}`}
            value={formData.stockQuantity}
            onChange={handleChange}
            placeholder="75"
          />
          {errors.stockQuantity ? (
            <span className="form-error">{errors.stockQuantity}</span>
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
              Make the variant selectable in the product card.
            </span>
          </span>
        </label>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Saving Variant..." : "Save Variant"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProductVariantForm;
