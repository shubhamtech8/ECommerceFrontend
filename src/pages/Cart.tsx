import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ShippingModal, {
  type ShippingAddress,
} from "../components/ShippingModal/ShippingModal";
import PaymentModal, {
  type PaymentResult,
} from "../components/PaymentModal/PaymentModal";
import { placeOrder } from "../services/orderService";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [shippingOpen, setShippingOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);

  const handlePlaceOrder = () => setShippingOpen(true);

  // Shipping confirmed → open payment picker
  const handleShippingConfirm = (address: ShippingAddress) => {
    setShippingAddress(address);
    setShippingOpen(false);
    setPaymentOpen(true);
  };

  // Payment confirmed → call backend (COD only), then clear cart
  // For CreditCard: order was already created inside PaymentModal on the
  // create-payment-intent call — result carries orderId + orderNumber
  const handlePaymentConfirm = async (result: PaymentResult) => {
    if (!shippingAddress) return;
    setPaymentOpen(false);
    setOrderLoading(true);
    try {
      let orderNumber = result.orderNumber ?? "";
      let grandTotalFinal = total;

      if (result.method === "COD") {
        // COD: create order now
        const order = await placeOrder(
          cartItems,
          shippingAddress,
          result,
          subtotal,
          totalDiscount,
          deliveryCharge,
          total,
        );
        orderNumber = order.orderNumber;
        grandTotalFinal = order.grandTotal;
      }

      clearCart();
      navigate("/home", {
        state: {
          orderSuccess: true,
          orderNumber,
          grandTotal: grandTotalFinal,
        },
      });
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  // Use variant price when a variant is selected, otherwise base product price
  const getItemPrice = (item: (typeof cartItems)[0]) =>
    item.selectedVariant ? item.selectedVariant.price : item.product.price;

  const getItemStock = (item: (typeof cartItems)[0]) =>
    item.selectedVariant
      ? parseInt(item.selectedVariant.stockQuantity ?? "0", 10)
      : item.product.stock;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0,
  );
  const totalDiscount = cartItems.reduce(
    (sum, item) =>
      sum + (item.product.originalPrice - getItemPrice(item)) * item.quantity,
    0,
  );
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  const handleQtyChange = (item: (typeof cartItems)[0], newQty: number) => {
    const stock = getItemStock(item);
    if (newQty < 1 || newQty > stock) return;
    updateQuantity(item.product.id, newQty, item.selectedVariantId);
  };

  return (
    <div className="cart-page">
      {/* Top navigation */}
      <nav className="cart-nav">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
        <h1 className="cart-nav-title">🛒 Shopping Cart</h1>
        <span className="cart-count">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </span>
      </nav>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <button className="continue-btn" onClick={() => navigate("/home")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          {/* Left — Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2>Cart Items</h2>
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear All
              </button>
            </div>

            {cartItems.map((item) => {
              const { product, quantity, selectedVariant } = item;
              const price = getItemPrice(item);
              const stock = getItemStock(item);

              return (
                <div
                  className="cart-item"
                  key={`${product.id}-${selectedVariant?.variantId ?? "base"}`}
                >
                  {/* Product image */}
                  <div className="cart-item-image-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="cart-item-image"
                    />
                    {product.discount > 0 && (
                      <span className="cart-discount-badge">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Product details */}
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{product.name}</h3>
                    <p className="cart-item-category">{product.category}</p>

                    {/* Variant tag */}
                    {selectedVariant && (
                      <div className="cart-variant-tag">
                        {selectedVariant.color && (
                          <span
                            className="cart-variant-dot"
                            style={{ background: selectedVariant.color }}
                          />
                        )}
                        <span>{selectedVariant.variantName}</span>
                        {selectedVariant.color && (
                          <span className="cart-variant-color">
                            · {selectedVariant.color}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="cart-item-rating">
                      ⭐ {product.rating}{" "}
                      <span className="cart-item-reviews">
                        ({product.reviews} reviews)
                      </span>
                    </div>

                    <div className="cart-item-price-row">
                      <span className="cart-item-price">
                        ₹{price.toLocaleString()}
                      </span>
                      {price < product.originalPrice && (
                        <>
                          <span className="cart-item-original-price">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                          <span className="cart-item-saving">
                            Save ₹
                            {(product.originalPrice - price).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Qty + stock info */}
                    <div className="cart-item-qty-row">
                      <span className="qty-label">Qty:</span>
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => handleQtyChange(item, quantity - 1)}
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-value">{quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleQtyChange(item, quantity + 1)}
                          disabled={quantity >= stock}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span
                        className={`stock-info ${
                          stock - quantity <= 3 ? "low-stock" : ""
                        }`}
                      >
                        {stock - quantity === 0
                          ? "Max qty reached"
                          : stock - quantity <= 3
                            ? `Only ${stock - quantity} left!`
                            : `${stock} in stock`}
                      </span>
                    </div>

                    {/* Item subtotal */}
                    <div className="cart-item-subtotal">
                      Item total:{" "}
                      <strong>₹{(price * quantity).toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(product.id, selectedVariant?.variantId)
                    }
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right — Order Summary */}
          <div className="cart-summary">
            <h2 className="summary-title">Price Details</h2>
            <div className="summary-row">
              <span>
                Price ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
              <span>₹{(subtotal + totalDiscount).toLocaleString()}</span>
            </div>
            <div className="summary-row discount">
              <span>Discount</span>
              <span>− ₹{totalDiscount.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className={deliveryCharge === 0 ? "free-delivery" : ""}>
                {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
              </span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <p className="summary-saving">
              You will save ₹{totalDiscount.toLocaleString()} on this order
            </p>
            <button
              className="checkout-btn"
              onClick={handlePlaceOrder}
              disabled={orderLoading}
            >
              {orderLoading ? "Placing Order…" : "Place Order"}
            </button>
            <button
              className="continue-shopping-link"
              onClick={() => navigate("/home")}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      )}

      <ShippingModal
        isOpen={shippingOpen}
        onClose={() => setShippingOpen(false)}
        onConfirm={handleShippingConfirm}
        totalAmount={total}
      />

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onConfirm={handlePaymentConfirm}
        totalAmount={total}
        recipientCity={shippingAddress?.city ?? ""}
        cartItems={cartItems}
        shippingAddress={
          shippingAddress ?? {
            recipientName: "",
            phoneNumber: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
          }
        }
        subtotal={subtotal}
        discountAmount={totalDiscount}
        shippingCharge={deliveryCharge}
        grandTotal={total}
      />
    </div>
  );
};

export default Cart;
