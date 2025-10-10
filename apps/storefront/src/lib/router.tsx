import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductPage from "../pages/product";
import OrderStatusPage from "../pages/order-status";
import CartPage from "../pages/cart";
import Catalog from "../pages/catalog";
import CheckoutPage from "../pages/checkout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/p/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id" element={<OrderStatusPage />} />
      </Routes>
    </BrowserRouter>
  );
}

