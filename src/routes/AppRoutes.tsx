import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import ProductManagement from "../components/product/ProductManagement";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import MainLayout from "../layouts/MainLayout";
import { CartProvider } from "../context/CartContext";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/home"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
