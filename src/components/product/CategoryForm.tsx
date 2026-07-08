import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { createCategory } from "../../services/productService";
import type { CategoryInput } from "./productTypes";

interface CategoryFormProps {
  onCreated: (category: CategoryInput) => void;
}

interface CategoryFormState {
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

const initialState: CategoryFormState = {
  name: "",
  description: "",
  imageUrl: "",
  isActive: true,
};

const CategoryForm = ({ onCreated }: CategoryFormProps) => {
  const [formData, setFormData] = useState<CategoryFormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormState, string>>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target;
    const checked =
      event.target instanceof HTMLInputElement && type === "checkbox"
        ? event.target.checked
        : undefined;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked ?? false : value,
    }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof CategoryFormState, string>> = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Category name is required.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Category description is required.";
    }

    if (!formData.imageUrl.trim()) {
      nextErrors.imageUrl = "Image URL is required.";
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

    setIsLoading(true);

    try {
      const payload: CategoryInput = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        isActive: formData.isActive,
      };

      await createCategory(payload);
      onCreated(payload);
      setMessage("Category saved successfully.");
      setFormData(initialState);
      setErrors({});
    } catch {
      setMessage("Unable to save category right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="form-card">
      <div className="form-card-header">
        <div className="form-card-heading">
          <p className="form-badge">Step 1</p>
          <h2 className="form-title">Add Category</h2>
          <p className="form-description">
            Start the catalog hierarchy by creating a top-level category.
          </p>
        </div>
      </div>

      {message ? (
        <div className="form-message success">{message}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="form-grid single-column">
        <div className="form-field">
          <label className="form-label" htmlFor="category-name">
            Category Name
          </label>
          <input
            id="category-name"
            name="name"
            type="text"
            className={`form-input${errors.name ? " error" : ""}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="Electronics"
          />
          {errors.name ? <span className="form-error">{errors.name}</span> : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="category-description">
            Category Description
          </label>
          <textarea
            id="category-description"
            name="description"
            className={`form-textarea${errors.description ? " error" : ""}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="High-level grouping for products"
          />
          {errors.description ? (
            <span className="form-error">{errors.description}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="category-image-url">
            Image Url
          </label>
          <input
            id="category-image-url"
            name="imageUrl"
            type="url"
            className={`form-input${errors.imageUrl ? " error" : ""}`}
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/category.png"
          />
          {errors.imageUrl ? (
            <span className="form-error">{errors.imageUrl}</span>
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
              Enable the category for storefront and admin usage.
            </span>
          </span>
        </label>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Saving Category..." : "Save Category"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CategoryForm;
