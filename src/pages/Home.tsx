import { useEffect, useState } from "react";
import type { Product } from "../data/products";
import ProductCard from "../components/ProductCard/ProductCard";
import { getProductList } from "../services/productService";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await getProductList();
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to ECart</h1>
          <p className="hero-subtitle">
            Shop the latest electronics, mobiles, laptops, and accessories
          </p>
          <button className="hero-cta">Start Shopping</button>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Discover our amazing collection</p>
        </div>

        {loading ? (
          <p className="section-subtitle">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="section-subtitle">No products available right now.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h3>Special Offers!</h3>
          <p>Get up to 50% off on selected items</p>
          <button className="promo-btn">Shop Now</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
