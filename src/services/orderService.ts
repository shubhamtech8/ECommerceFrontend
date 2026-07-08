import { api2 } from "./axios";
import type { ShippingAddress } from "../components/ShippingModal/ShippingModal";
import type { PaymentResult } from "../components/PaymentModal/PaymentModal";
import type { CartItem } from "../context/CartContext";

export interface PlaceOrderResponse {
  orderId: number;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: boolean;
  grandTotal: number;
}

export const placeOrder = async (
  cartItems: CartItem[],
  shipping: ShippingAddress,
  payment: PaymentResult,
  subtotal: number,
  discountAmount: number,
  shippingCharge: number,
  grandTotal: number,
): Promise<PlaceOrderResponse> => {
  // Derive userId from JWT stored in localStorage (0 = guest / unauthenticated)
  const userId = getUserIdFromToken();

  const payload = {
    userId,
    items: cartItems.map((item) => {
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
    }),
    shipping: {
      recipientName: shipping.recipientName,
      phoneNumber: shipping.phoneNumber,
      addressLine1: shipping.addressLine1,
      addressLine2: shipping.addressLine2,
      city: shipping.city,
      state: shipping.state,
      country: shipping.country,
      postalCode: shipping.postalCode,
    },
    payment: {
      method: payment.method, // "COD" | "CreditCard"
      paymentIntentId: payment.stripePaymentIntentId ?? null, // from Stripe, null for COD
      paymentMethodId: payment.stripePaymentMethodId ?? null, // from Stripe, null for COD
      currency: "INR",
    },
    subTotal: parseFloat(subtotal.toFixed(2)),
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    shippingCharge: parseFloat(shippingCharge.toFixed(2)),
    grandTotal: parseFloat(grandTotal.toFixed(2)),
  };

  const response = await api2.post<any>("/api/order/place", payload);
  const data = response.data?.data ?? response.data;

  return {
    orderId: data.orderId,
    orderNumber: data.orderNumber,
    orderStatus: data.orderStatus,
    paymentStatus: data.paymentStatus,
    grandTotal: data.grandTotal,
  };
};

/** Decodes the JWT payload and extracts the user ID claim. */
function getUserIdFromToken(): number {
  try {
    const token = localStorage.getItem("token");
    if (!token) return 0;
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Common claim names for user ID
    return (
      payload.nameid ??
      payload.sub ??
      payload.userId ??
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ??
      0
    );
  } catch {
    return 0;
  }
}
