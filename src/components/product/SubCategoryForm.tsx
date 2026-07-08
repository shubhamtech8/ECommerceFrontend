import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createSubCategory } from "../../services/productService";
import type { Category, SubCategoryInput } from "./productTypes";

interface SubCategoryFormProps {
  categories: Category[];
  onCreated: (subCategory: SubCategoryInput) => void;
}

interface SubCategoryFormState {
  categoryId: number | "";
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

const initialState: SubCategoryFormState = {
  categoryId: "",
  name: "",
  description: "",
  imageUrl: "",
  isActive: true,
};

const SubCategoryForm = ({ categories, onCreated }: SubCategoryFormProps) => {
  const [formData, setFormData] = useState<SubCategoryFormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof SubCategoryFormState, string>>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : name === "categoryId" ? (value ? Number(value) : "") : value,
    }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof SubCategoryFormState, string>> = {};

    if (formData.categoryId === "") {
      nextErrors.categoryId = "Category selection is required.";
    }

    if (!formData.name.trim()) {
      nextErrors.name = "SubCategory name is required.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "SubCategory description is required.";
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

    const selectedCategory = categories.find(
      (category) => category.id === formData.categoryId,
    );

    if (!selectedCategory) {
      setErrors((previous) => ({
        ...previous,
        categoryId: "Select a valid category.",
      }));
      return;
    }

    setIsLoading(true);

    try {
      const payload: SubCategoryInput = {
        categoryId: selectedCategory.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        isActive: formData.isActive,
      };

      await createSubCategory(payload);
      onCreated(payload);
      setMessage("SubCategory saved successfully.");
      setFormData(initialState);
      setErrors({});
    } catch {
      setMessage("Unable to save subcategory right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="form-card">
      <div className="form-card-header">
        <div className="form-card-heading">
          <p className="form-badge">Step 2</p>
          <h2 className="form-title">Add SubCategory</h2>
          <p className="form-description">
            Attach a subcategory to an existing category.
          </p>
        </div>
      </div>

      {message ? (
        <div className="form-message success">{message}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="form-grid single-column">
        <div className="form-field">
          <label className="form-label" htmlFor="subcategory-category">
            Category Dropdown
          </label>
          <select
            id="subcategory-category"
            name="categoryId"
            className={`form-select${errors.categoryId ? " error" : ""}`}
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <span className="form-error">{errors.categoryId}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="subcategory-name">
            SubCategory Name
          </label>
          <input
            id="subcategory-name"
            name="name"
            type="text"
            className={`form-input${errors.name ? " error" : ""}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="Mobile Phones"
          />
          {errors.name ? <span className="form-error">{errors.name}</span> : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="subcategory-description">
            SubCategory Description
          </label>
          <textarea
            id="subcategory-description"
            name="description"
            className={`form-textarea${errors.description ? " error" : ""}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="Narrower grouping within the main category"
          />
          {errors.description ? (
            <span className="form-error">{errors.description}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="subcategory-image-url">
            Image Url
          </label>
          <input
            id="subcategory-image-url"
            name="imageUrl"
            type="url"
            className={`form-input${errors.imageUrl ? " error" : ""}`}
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/subcategory.png"
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
              Enable the subcategory in the hierarchy.
            </span>
          </span>
        </label>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Saving SubCategory..." : "Save SubCategory"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default SubCategoryForm;
