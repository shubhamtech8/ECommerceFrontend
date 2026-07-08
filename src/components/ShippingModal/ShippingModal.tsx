import { useState, type FormEvent } from "react";
import "./ShippingModal.css";

export interface ShippingAddress {
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: ShippingAddress) => void;
  totalAmount: number;
}

const INITIAL: ShippingAddress = {
  recipientName: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
};

const ShippingModal = ({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
}: ShippingModalProps) => {
  const [form, setForm] = useState<ShippingAddress>(INITIAL);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const e: Partial<ShippingAddress> = {};
    if (!form.recipientName.trim()) e.recipientName = "Name is required";
    if (!/^\d{10}$/.test(form.phoneNumber.trim()))
      e.phoneNumber = "Enter a valid 10-digit phone number";
    if (!form.addressLine1.trim()) e.addressLine1 = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.country.trim()) e.country = "Country is required";
    if (!/^\d{6}$/.test(form.postalCode.trim()))
      e.postalCode = "Enter a valid 6-digit postal code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) onConfirm(form);
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shipping-title"
    >
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <h2 id="shipping-title">Shipping Address</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          {/* Recipient + Phone */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="recipientName">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="recipientName"
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={form.recipientName}
                onChange={(e) => handleChange("recipientName", e.target.value)}
                className={errors.recipientName ? "input-error" : ""}
              />
              {errors.recipientName && (
                <span className="error-msg">{errors.recipientName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">
                Phone Number <span className="required">*</span>
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={form.phoneNumber}
                onChange={(e) =>
                  handleChange("phoneNumber", e.target.value.replace(/\D/g, ""))
                }
                className={errors.phoneNumber ? "input-error" : ""}
              />
              {errors.phoneNumber && (
                <span className="error-msg">{errors.phoneNumber}</span>
              )}
            </div>
          </div>

          {/* Address Line 1 */}
          <div className="form-group">
            <label htmlFor="addressLine1">
              Address Line 1 <span className="required">*</span>
            </label>
            <input
              id="addressLine1"
              type="text"
              placeholder="House No., Building, Street"
              value={form.addressLine1}
              onChange={(e) => handleChange("addressLine1", e.target.value)}
              className={errors.addressLine1 ? "input-error" : ""}
            />
            {errors.addressLine1 && (
              <span className="error-msg">{errors.addressLine1}</span>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="form-group">
            <label htmlFor="addressLine2">Address Line 2</label>
            <input
              id="addressLine2"
              type="text"
              placeholder="Area, Colony, Landmark (optional)"
              value={form.addressLine2}
              onChange={(e) => handleChange("addressLine2", e.target.value)}
            />
          </div>

          {/* City + Postal Code */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <input
                id="city"
                type="text"
                placeholder="e.g. Mumbai"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={errors.city ? "input-error" : ""}
              />
              {errors.city && <span className="error-msg">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">
                Postal Code <span className="required">*</span>
              </label>
              <input
                id="postalCode"
                type="text"
                placeholder="6-digit PIN"
                maxLength={6}
                value={form.postalCode}
                onChange={(e) =>
                  handleChange("postalCode", e.target.value.replace(/\D/g, ""))
                }
                className={errors.postalCode ? "input-error" : ""}
              />
              {errors.postalCode && (
                <span className="error-msg">{errors.postalCode}</span>
              )}
            </div>
          </div>

          {/* State + Country */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="state">
                State <span className="required">*</span>
              </label>
              <input
                id="state"
                type="text"
                placeholder="e.g. Maharashtra"
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className={errors.state ? "input-error" : ""}
              />
              {errors.state && (
                <span className="error-msg">{errors.state}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="country">
                Country <span className="required">*</span>
              </label>
              <input
                id="country"
                type="text"
                placeholder="e.g. India"
                value={form.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className={errors.country ? "input-error" : ""}
              />
              {errors.country && (
                <span className="error-msg">{errors.country}</span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <div className="modal-total">
              Order Total: <strong>₹{totalAmount.toLocaleString()}</strong>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-confirm">
                Confirm Order →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingModal;
