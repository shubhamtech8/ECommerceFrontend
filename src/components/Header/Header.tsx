import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <header className="header">
      <div className="header-container">
        {/* Left: Logo */}
        <div className="header-left">
          <div className="logo" onClick={() => navigate("/")}>
            <span className="logo-icon">🛒</span>
            <span className="logo-text">ECart Test</span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="header-center">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for products, brands, and more..."
              className="search-input"
            />
            <button className="search-button" type="button">
              🔍
            </button>
          </div>
        </div>

        {/* Right: Navigation */}
        <div className="header-right">
          <nav className="nav-links">
            <button
              type="button"
              className="nav-link"
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <button
              type="button"
              className="nav-link"
              onClick={() => navigate("/products")}
            >
              Products
            </button>
            <button
              type="button"
              className="nav-link cart-link"
              onClick={() => navigate("/cart")}
              aria-label={`Cart, ${totalItems} items`}
            >
              <span className="cart-icon">🛍️</span>
              <span className="cart-badge">{totalItems}</span>
            </button>
            <button
              type="button"
              className="nav-link login-link"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
