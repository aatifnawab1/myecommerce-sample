import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { Toaster } from "./components/ui/sonner";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Perfumes from "./pages/Perfumes";
import Drones from "./pages/Drones";
import Watches from "./pages/Watches";
import Others from "./pages/Others";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ReturnRefund from "./pages/ReturnRefund";

// Admin imports
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminDemand from "./pages/admin/AdminDemand";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminSlides from "./pages/admin/AdminSlides";

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <div className="App min-h-screen flex flex-col bg-black">
                    <Header />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/perfumes" element={<Perfumes />} />
                        <Route path="/drones" element={<Drones />} />
                        <Route path="/watches" element={<Watches />} />
                        <Route path="/others" element={<Others />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/track-order" element={<TrackOrder />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/return" element={<ReturnRefund />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="demand" element={<AdminDemand />} />
                        <Route path="coupons" element={<AdminCoupons />} />
                        <Route path="slides" element={<AdminSlides />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
            <Toaster position="top-right" richColors />
          </BrowserRouter>
        </AdminAuthProvider>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
