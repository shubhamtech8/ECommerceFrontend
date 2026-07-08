import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product, ProductVariant } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  /** Derived key: `productId` or `productId-variantId` */
  selectedVariantId?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    variantId?: number,
  ) => void;
  removeFromCart: (productId: number, variantId?: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/** Unique key per product+variant combo — reserved for future use */
// const itemKey = (productId: number, variantId?: number) =>
//   variantId !== undefined ? `${productId}-${variantId}` : `${productId}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, variant?: ProductVariant) => {
    const maxStock = variant
      ? parseInt(variant.stockQuantity ?? "0", 10)
      : product.stock;
    const variantId = variant?.variantId;

    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          (item.selectedVariantId ?? undefined) === variantId,
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id &&
          (item.selectedVariantId ?? undefined) === variantId
            ? { ...item, quantity: Math.min(item.quantity + 1, maxStock) }
            : item,
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedVariant: variant,
          selectedVariantId: variantId,
        },
      ];
    });
  };

  const updateQuantity = (
    productId: number,
    quantity: number,
    variantId?: number,
  ) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        (item.selectedVariantId ?? undefined) === variantId
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const removeFromCart = (productId: number, variantId?: number) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (item.selectedVariantId ?? undefined) === variantId
          ),
      ),
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
