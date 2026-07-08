import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-container">
          {/* Column 1: Company Info */}
          <div className="footer-column">
            <div className="footer-logo">
              <span className="footer-logo-icon">🛒</span>
              <span className="footer-company-name">ECart</span>
            </div>
            <p className="footer-company-desc">Your trusted online store</p>
            <div className="footer-contact">
              <p className="contact-item">
                <span className="contact-icon">📱</span> +1 (555) 123-4567
              </p>
              <p className="contact-item">
                <span className="contact-icon">✉️</span> support@ecart.com
              </p>
              <p className="contact-item">
                <span className="contact-icon">📍</span> 123 Commerce Street, NY
                10001
              </p>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => navigate("/")}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => navigate("/about")}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => navigate("/privacy")}
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="footer-column">
            <h4 className="footer-heading">Shop Categories</h4>
            <ul className="footer-links">
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => navigate("/electronics")}
                >
                  Electronics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => navigate("/mobiles")}
                >
                  Mobiles
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => navigate("/laptops")}
                >
                  Laptops
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => navigate("/accessories")}
                >
                  Accessories
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>&copy; 2024 ECart. All rights reserved.</p>
          <div className="footer-socials">
            <button type="button" className="social-link" aria-label="Facebook">
              f
            </button>
            <button type="button" className="social-link" aria-label="X">
              𝕏
            </button>
            <button
              type="button"
              className="social-link"
              aria-label="Instagram"
            >
              📷
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
