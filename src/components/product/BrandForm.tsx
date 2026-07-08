import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createBrand } from "../../services/productService";
import type { BrandInput } from "./productTypes";

interface BrandFormProps {
  onCreated: (brand: BrandInput) => void;
}

interface BrandFormState {
  name: string;
  brandUrl: string;
  description: string;
  websiteUrl: string;
  isActive: boolean;
}

const initialState: BrandFormState = {
  name: "",
  brandUrl: "",
  description: "",
  websiteUrl: "",
  isActive: true,
};

const BrandForm = ({ onCreated }: BrandFormProps) => {
  const [formData, setFormData] = useState<BrandFormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof BrandFormState, string>>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof BrandFormState, string>> = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Brand name is required.";
    }

    if (!formData.brandUrl.trim()) {
      nextErrors.brandUrl = "Brand URL is required.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Brand description is required.";
    }

    if (!formData.websiteUrl.trim()) {
      nextErrors.websiteUrl = "Website URL is required.";
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
      const payload: BrandInput = {
        name: formData.name.trim(),
        brandUrl: formData.brandUrl.trim(),
        description: formData.description.trim(),
        websiteUrl: formData.websiteUrl.trim(),
        isActive: formData.isActive,
      };

      await createBrand(payload);
      onCreated(payload);
      setMessage("Brand saved successfully.");
      setFormData(initialState);
      setErrors({});
    } catch {
      setMessage("Unable to save brand right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="form-card">
      <div className="form-card-header">
        <div className="form-card-heading">
          <p className="form-badge">Step 3</p>
          <h2 className="form-title">Add Brand</h2>
          <p className="form-description">
            Register the brand that will be linked to products.
          </p>
        </div>
      </div>

      {message ? (
        <div className="form-message success">{message}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="form-grid single-column">
        <div className="form-field">
          <label className="form-label" htmlFor="brand-name">
            Brand Name
          </label>
          <input
            id="brand-name"
            name="name"
            type="text"
            className={`form-input${errors.name ? " error" : ""}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="Apple"
          />
          {errors.name ? <span className="form-error">{errors.name}</span> : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="brand-url">
            Brand Url
          </label>
          <input
            id="brand-url"
            name="brandUrl"
            type="url"
            className={`form-input${errors.brandUrl ? " error" : ""}`}
            value={formData.brandUrl}
            onChange={handleChange}
            placeholder="https://brand-assets.example.com/logo.png"
          />
          {errors.brandUrl ? (
            <span className="form-error">{errors.brandUrl}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="brand-description">
            Brand Description
          </label>
          <textarea
            id="brand-description"
            name="description"
            className={`form-textarea${errors.description ? " error" : ""}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description about the brand"
          />
          {errors.description ? (
            <span className="form-error">{errors.description}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="brand-website-url">
            Website Url
          </label>
          <input
            id="brand-website-url"
            name="websiteUrl"
            type="url"
            className={`form-input${errors.websiteUrl ? " error" : ""}`}
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="https://www.apple.com"
          />
          {errors.websiteUrl ? (
            <span className="form-error">{errors.websiteUrl}</span>
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
              Make the brand available for products.
            </span>
          </span>
        </label>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Saving Brand..." : "Save Brand"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default BrandForm;
