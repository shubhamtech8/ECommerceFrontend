import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createProductReview } from "../../services/productService";
import type { Product, ProductReviewInput } from "./productTypes";

interface ProductReviewFormProps {
  products: Product[];
  onCreated: (review: ProductReviewInput) => void;
}

interface ProductReviewFormState {
  productId: number | "";
  reviewTitle: string;
  reviewDescription: string;
  rating: string;
  reviewImageUrl: string;
}

const initialState: ProductReviewFormState = {
  productId: "",
  reviewTitle: "",
  reviewDescription: "",
  rating: "",
  reviewImageUrl: "",
};

const ProductReviewForm = ({ products, onCreated }: ProductReviewFormProps) => {
  const [formData, setFormData] = useState<ProductReviewFormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductReviewFormState, string>>>({});
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
    const nextErrors: Partial<Record<keyof ProductReviewFormState, string>> = {};

    if (formData.productId === "") {
      nextErrors.productId = "Product selection is required.";
    }

    if (!formData.reviewTitle.trim()) {
      nextErrors.reviewTitle = "Review title is required.";
    }

    if (!formData.reviewDescription.trim()) {
      nextErrors.reviewDescription = "Review description is required.";
    }

    const ratingValue = Number(formData.rating);
    if (
      !formData.rating.trim() ||
      Number.isNaN(ratingValue) ||
      ratingValue < 1 ||
      ratingValue > 5
    ) {
      nextErrors.rating = "Rating must be between 1 and 5.";
    }

    if (!formData.reviewImageUrl.trim()) {
      nextErrors.reviewImageUrl = "Review image URL is required.";
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
      const payload: ProductReviewInput = {
        productId: selectedProduct.id,
        reviewTitle: formData.reviewTitle.trim(),
        reviewDescription: formData.reviewDescription.trim(),
        rating: Number(formData.rating),
        reviewImageUrl: formData.reviewImageUrl.trim(),
      };

      await createProductReview(payload);
      onCreated(payload);
      setMessage("Review saved successfully.");
      setFormData(initialState);
      setErrors({});
    } catch {
      setMessage("Unable to save review right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="form-card">
      <div className="form-card-header">
        <div className="form-card-heading">
          <p className="form-badge">Step 6</p>
          <h2 className="form-title">Add Product Review</h2>
          <p className="form-description">
            Capture customer feedback for a specific product.
          </p>
        </div>
      </div>

      {message ? (
        <div className="form-message success">{message}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="form-grid single-column">
        <div className="form-field">
          <label className="form-label" htmlFor="review-product">
            Product Dropdown
          </label>
          <select
            id="review-product"
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
          <label className="form-label" htmlFor="review-title">
            Review Title
          </label>
          <input
            id="review-title"
            name="reviewTitle"
            type="text"
            className={`form-input${errors.reviewTitle ? " error" : ""}`}
            value={formData.reviewTitle}
            onChange={handleChange}
            placeholder="Great battery life"
          />
          {errors.reviewTitle ? (
            <span className="form-error">{errors.reviewTitle}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="review-description">
            Review Description
          </label>
          <textarea
            id="review-description"
            name="reviewDescription"
            className={`form-textarea${errors.reviewDescription ? " error" : ""}`}
            value={formData.reviewDescription}
            onChange={handleChange}
            placeholder="Write a detailed customer review"
          />
          {errors.reviewDescription ? (
            <span className="form-error">{errors.reviewDescription}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="review-rating">
            Rating (1-5)
          </label>
          <input
            id="review-rating"
            name="rating"
            type="number"
            min="1"
            max="5"
            step="1"
            className={`form-input${errors.rating ? " error" : ""}`}
            value={formData.rating}
            onChange={handleChange}
            placeholder="5"
          />
          {errors.rating ? <span className="form-error">{errors.rating}</span> : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="review-image-url">
            Review Image Url
          </label>
          <input
            id="review-image-url"
            name="reviewImageUrl"
            type="url"
            className={`form-input${errors.reviewImageUrl ? " error" : ""}`}
            value={formData.reviewImageUrl}
            onChange={handleChange}
            placeholder="https://example.com/review-image.png"
          />
          {errors.reviewImageUrl ? (
            <span className="form-error">{errors.reviewImageUrl}</span>
          ) : null}
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Saving Review..." : "Save Review"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProductReviewForm;
