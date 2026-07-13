import { useState, type FormEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { api2 } from "../../services/axios";
import type { ShippingAddress } from "../ShippingModal/ShippingModal";
import type { CartItem } from "../../context/CartContext";
import "./PaymentModal.css";

// ── Stripe setup ──────────────────────────────────────────────────────────────
const stripePromise = loadStripe(
  "pk_test_51To5SJ1MwBGxWyJmRTsQbSUCFm3XRIzfaZD3PNCy2JPnc7uafheN9DnBjGLRWwprTwIkYNNUrNFo4ardlhjse17300eezCpEqp",
);

const STRIPE_ELEMENT_STYLE = {
  base: {
    fontSize: "14px",
    color: "#212121",
    fontFamily: '"Segoe UI", sans-serif',
    "::placeholder": { color: "#aaa" },
  },
  invalid: { color: "#e53935" },
};

// ── Public types ──────────────────────────────────────────────────────────────
export type PaymentMethod = "COD" | "CreditCard";

export interface PaymentResult {
  method: PaymentMethod;
  stripePaymentMethodId?: string;
  stripePaymentIntentId?: string;
  orderId?: number | string;
  orderNumber?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: PaymentResult) => void;
  totalAmount: number;
  recipientCity: string;
  // Order data needed to persist the order on payment intent creation
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discountAmount: number;
  shippingCharge: number;
  grandTotal: number;
}

type Step = "select" | "cod-confirm" | "card-form";

// ── Helper: decode JWT to get userId ─────────────────────────────────────────
function getUserIdFromToken(): number {
  try {
    const token = localStorage.getItem("token");
    if (!token) return 0;
    const payload = JSON.parse(atob(token.split(".")[1]));
    // The backend JwtService stores user PK under the claim name "Id"
    const raw =
      payload["Id"] ?? // matches new Claim("Id", user.Id.ToString())
      payload["id"] ??
      payload.nameid ??
      payload.sub ??
      0;
    const id = parseInt(String(raw), 10);
    return isNaN(id) ? 0 : id;
  } catch {
    return 0;
  }
}

// ── Inner Stripe form (must be inside <Elements>) ─────────────────────────────
interface StripeCardFormProps {
  // Totals
  totalAmount: number;
  // Full order payload for the single create-payment-intent call
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discountAmount: number;
  shippingCharge: number;
  grandTotal: number;
  // Callbacks
  onSuccess: (result: PaymentResult) => void;
  onBack: () => void;
}

const StripeCardForm = ({
  totalAmount,
  cartItems,
  shippingAddress,
  subtotal,
  discountAmount,
  shippingCharge,
  grandTotal,
  onSuccess,
  onBack,
}: StripeCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardholderName, setCardholderName] = useState("");
  const [nameError, setNameError] = useState("");
  const [stripeError, setStripeError] = useState("");
  const [loading, setLoading] = useState(false);

  const [elementState, setElementState] = useState({
    cardNumber: { complete: false, error: "" },
    cardExpiry: { complete: false, error: "" },
    cardCvc: { complete: false, error: "" },
  });

  const handleElementChange =
    (field: keyof typeof elementState) =>
    (event: { complete: boolean; error?: { message: string } }) => {
      setElementState((prev) => ({
        ...prev,
        [field]: {
          complete: event.complete,
          error: event.error?.message ?? "",
        },
      }));
      setStripeError("");
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStripeError("");

    if (!cardholderName.trim()) {
      setNameError("Cardholder name is required");
      return;
    }
    setNameError("");
    if (!stripe || !elements) return;

    const cardNumberEl = elements.getElement(CardNumberElement);
    if (!cardNumberEl) return;

    setLoading(true);

    // ── Step 1: create Stripe PaymentMethod ───────────────────────────────
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberEl,
      billing_details: { name: cardholderName.trim() },
    });

    if (pmError) {
      setStripeError(pmError.message ?? "Card verification failed.");
      setLoading(false);
      return;
    }

    // ── Step 2: POST to create-payment-intent (also creates the order) ────
    // Build items payload
    const items = cartItems.map((item) => {
      const unitPrice = item.selectedVariant
        ? item.selectedVariant.price
        : item.product.price;
      const lineDiscount =
        (item.product.originalPrice - unitPrice) * item.quantity;
      return {
        productId: item.product.id,
        variantId: item.selectedVariantId ?? null,
        quantity: item.quantity,
        unitPrice,
        discountAmount: parseFloat(lineDiscount.toFixed(2)),
        totalPrice: parseFloat((unitPrice * item.quantity).toFixed(2)),
      };
    });

    let clientSecret = "";
    let paymentIntentId = "";

    try {
      const { data } = await api2.post<any>(
        "/api/stripe/create-payment-intent",
        {
          // Stripe fields
          amount: totalAmount,
          currency: "inr",
          // Order fields
          userId: getUserIdFromToken(),
          items,
          shipping: {
            recipientName: shippingAddress.recipientName,
            phoneNumber: shippingAddress.phoneNumber,
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            country: shippingAddress.country,
            postalCode: shippingAddress.postalCode,
          },
          subTotal: parseFloat(subtotal.toFixed(2)),
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          shippingCharge: parseFloat(shippingCharge.toFixed(2)),
          grandTotal: parseFloat(grandTotal.toFixed(2)),
          paymentMethodId: paymentMethod.id,
        },
      );

      clientSecret = data.clientSecret;
      paymentIntentId = data.paymentIntentId;
    } catch {
      setStripeError("Could not initialise payment. Please try again.");
      setLoading(false);
      return;
    }
    // ── Step 3: confirm card payment with client secret ───────────────────
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

    console.log("PaymentIntent:", paymentIntent);

    if (confirmError) {
      setStripeError(confirmError.message ?? "Payment confirmation failed.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess({
      method: "CreditCard",
      stripePaymentMethodId: paymentMethod.id,
      stripePaymentIntentId: paymentIntentId,
    });
  };

  const allComplete =
    elementState.cardNumber.complete &&
    elementState.cardExpiry.complete &&
    elementState.cardCvc.complete;

  return (
    <form className="card-form" onSubmit={handleSubmit} noValidate>
      {/* Cardholder Name */}
      <div className="cf-group">
        <label htmlFor="cardholderName">
          Cardholder Name <span className="required">*</span>
        </label>
        <input
          id="cardholderName"
          type="text"
          placeholder="As printed on card"
          value={cardholderName}
          onChange={(e) => {
            setCardholderName(e.target.value.toUpperCase());
            if (nameError) setNameError("");
          }}
          className={nameError ? "cf-input cf-error" : "cf-input"}
          autoComplete="cc-name"
        />
        {nameError && <span className="cf-err-msg">{nameError}</span>}
      </div>

      {/* Card Number */}
      <div className="cf-group">
        <label>
          Card Number <span className="required">*</span>
        </label>
        <div
          className={`stripe-element-wrap${elementState.cardNumber.error ? " stripe-error" : ""}`}
        >
          <CardNumberElement
            options={{ style: STRIPE_ELEMENT_STYLE, showIcon: true }}
            onChange={handleElementChange("cardNumber")}
          />
        </div>
        {elementState.cardNumber.error && (
          <span className="cf-err-msg">{elementState.cardNumber.error}</span>
        )}
      </div>

      {/* Expiry + CVV */}
      <div className="cf-row">
        <div className="cf-group">
          <label>
            Expiry Date <span className="required">*</span>
          </label>
          <div
            className={`stripe-element-wrap${elementState.cardExpiry.error ? " stripe-error" : ""}`}
          >
            <CardExpiryElement
              options={{ style: STRIPE_ELEMENT_STYLE }}
              onChange={handleElementChange("cardExpiry")}
            />
          </div>
          {elementState.cardExpiry.error && (
            <span className="cf-err-msg">{elementState.cardExpiry.error}</span>
          )}
        </div>

        <div className="cf-group">
          <label>
            CVV / CVC <span className="required">*</span>
          </label>
          <div
            className={`stripe-element-wrap${elementState.cardCvc.error ? " stripe-error" : ""}`}
          >
            <CardCvcElement
              options={{ style: STRIPE_ELEMENT_STYLE }}
              onChange={handleElementChange("cardCvc")}
            />
          </div>
          {elementState.cardCvc.error && (
            <span className="cf-err-msg">{elementState.cardCvc.error}</span>
          )}
        </div>
      </div>

      {stripeError && <div className="stripe-global-error">{stripeError}</div>}

      <div className="secure-note">
        🔒 Secured by Stripe — your card details never touch our servers
      </div>

      <div className="pm-footer">
        <button type="button" className="btn-pm-cancel" onClick={onBack}>
          ← Change
        </button>
        <button
          type="submit"
          className="btn-pm-confirm"
          disabled={loading || !stripe || !allComplete}
        >
          {loading ? "Processing…" : `Pay ₹${totalAmount.toLocaleString()}`}
        </button>
      </div>
    </form>
  );
};

// ── Main modal ────────────────────────────────────────────────────────────────
const PaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  recipientCity,
  cartItems,
  shippingAddress,
  subtotal,
  discountAmount,
  shippingCharge,
  grandTotal,
}: PaymentModalProps) => {
  const [step, setStep] = useState<Step>("select");

  if (!isOpen) return null;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleClose = () => {
    setStep("select");
    onClose();
  };

  const renderHeader = (title: string, backTo?: Step) => (
    <div className="pm-header">
      <div className="pm-header-left">
        {backTo && (
          <button
            className="pm-back"
            onClick={() => setStep(backTo)}
            aria-label="Go back"
          >
            ←
          </button>
        )}
        <h2>{title}</h2>
      </div>
      <button className="pm-close" onClick={handleClose} aria-label="Close">
        ✕
      </button>
    </div>
  );

  // ── Select method ─────────────────────────────────────────────────────────
  if (step === "select") {
    return (
      <div
        className="pm-backdrop"
        onClick={handleBackdrop}
        role="dialog"
        aria-modal="true"
      >
        <div className="pm-box">
          {renderHeader("Choose Payment Method")}
          <div className="pm-body">
            <p className="pm-amount-line">
              Total payable: <strong>₹{totalAmount.toLocaleString()}</strong>
            </p>
            <div className="pm-options">
              <button
                className="pm-option"
                onClick={() => setStep("cod-confirm")}
              >
                <div className="pm-option-icon cod-icon">💵</div>
                <div className="pm-option-info">
                  <span className="pm-option-title">Cash on Delivery</span>
                  <span className="pm-option-desc">
                    Pay when your order arrives
                  </span>
                </div>
                <span className="pm-option-arrow">›</span>
              </button>
              <button
                className="pm-option"
                onClick={() => setStep("card-form")}
              >
                <div className="pm-option-icon card-icon">💳</div>
                <div className="pm-option-info">
                  <span className="pm-option-title">Credit Card</span>
                  <span className="pm-option-desc">
                    Visa, Mastercard, Amex &amp; more
                  </span>
                </div>
                <span className="pm-option-arrow">›</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── COD confirmation ──────────────────────────────────────────────────────
  if (step === "cod-confirm") {
    return (
      <div
        className="pm-backdrop"
        onClick={handleBackdrop}
        role="dialog"
        aria-modal="true"
      >
        <div className="pm-box">
          {renderHeader("Confirm Order", "select")}
          <div className="pm-body">
            <div className="cod-confirm-block">
              <div className="cod-icon-large">📦</div>
              <h3>Cash on Delivery</h3>
              <p>
                You will pay <strong>₹{totalAmount.toLocaleString()}</strong>{" "}
                when your order is delivered to <strong>{recipientCity}</strong>
                .
              </p>
              <div className="cod-summary">
                <div className="cod-row">
                  <span>Payment Method</span>
                  <span>Cash on Delivery</span>
                </div>
                <div className="cod-row">
                  <span>Amount Due on Delivery</span>
                  <strong>₹{totalAmount.toLocaleString()}</strong>
                </div>
              </div>
            </div>
            <div className="pm-footer">
              <button
                className="btn-pm-cancel"
                onClick={() => setStep("select")}
              >
                ← Change
              </button>
              <button
                className="btn-pm-confirm"
                onClick={() => onConfirm({ method: "COD" })}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Credit card (Stripe Elements) ─────────────────────────────────────────
  return (
    <div
      className="pm-backdrop"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className="pm-box">
        {renderHeader("Credit Card Details", "select")}
        <div className="pm-body">
          <Elements stripe={stripePromise}>
            <StripeCardForm
              totalAmount={totalAmount}
              cartItems={cartItems}
              shippingAddress={shippingAddress}
              subtotal={subtotal}
              discountAmount={discountAmount}
              shippingCharge={shippingCharge}
              grandTotal={grandTotal}
              onSuccess={onConfirm}
              onBack={() => setStep("select")}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
