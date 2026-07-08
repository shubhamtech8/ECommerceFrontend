import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product, ProductVariant } from "../../data/products";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const activeVariants = product.variants?.filter((v) => v.isActive) ?? [];
  const hasVariants = activeVariants.length > 0;

  // First active variant is selected by default (required when variants exist)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants ? activeVariants[0] : null,
  );

  // Effective price/stock based on selection
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayStock = selectedVariant
    ? parseInt(selectedVariant.stockQuantity ?? "0", 10)
    : product.stock;

  // Cart state — keyed on product + variant combo
  const isInCart = cartItems.some(
    (item) =>
      item.product.id === product.id &&
      (item.selectedVariantId ?? null) === (selectedVariant?.variantId ?? null),
  );

  const handleAddToCart = () => {
    addToCart(product, selectedVariant ?? undefined);
    navigate("/cart");
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        {product.discount > 0 && (
          <div className="discount-badge">{product.discount}% OFF</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <span className="stars">⭐</span>
          <span className="rating-value">{product.rating}</span>
          <span className="reviews">({product.reviews} reviews)</span>
        </div>

        <div className="product-price">
          <span className="current-price">
            ₹{displayPrice.toLocaleString()}
          </span>
          {displayPrice < product.originalPrice && (
            <span className="original-price">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Variants */}
        {hasVariants && (
          <div className="variant-section">
            <span className="variant-label">
              {selectedVariant?.variantName}
            </span>
            <div className="variant-chips">
              {activeVariants.map((v) => (
                <button
                  key={v.variantId}
                  className={`variant-chip ${
                    selectedVariant?.variantId === v.variantId ? "selected" : ""
                  }`}
                  style={
                    v.color
                      ? ({ "--chip-color": v.color } as React.CSSProperties)
                      : undefined
                  }
                  onClick={() => setSelectedVariant(v)}
                  title={`${v.variantName}${v.color ? ` — ${v.color}` : ""}`}
                  aria-label={v.variantName}
                >
                  {v.color ? (
                    <span
                      className="chip-color-dot"
                      style={{ background: v.color }}
                    />
                  ) : (
                    <span className="chip-text">{v.variantName}</span>
                  )}
                </button>
              ))}
            </div>
            <span className="variant-stock">
              {displayStock > 0 ? `${displayStock} in stock` : "Out of stock"}
            </span>
          </div>
        )}

        <button
          className={`add-to-cart-btn ${isInCart ? "in-cart" : ""}`}
          onClick={handleAddToCart}
          disabled={isInCart || displayStock === 0}
          title={
            displayStock === 0
              ? "Out of stock"
              : isInCart
                ? "Already in cart"
                : "Add to cart"
          }
        >
          {displayStock === 0
            ? "Out of Stock"
            : isInCart
              ? "✔ Added to Cart"
              : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
