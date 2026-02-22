import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import useAuthStore from "./store/authStore";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import MainLayout from "./components/layout/MainLayout";
import {
  ProtectedRoute,
  AdminRoute,
  GuestRoute,
} from "./components/auth/RouteGuards";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProductListPage from "./pages/products/ProductListPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderListPage from "./pages/orders/OrderListPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import ProfilePage from "./pages/profile/ProfilePage";
import PaymentHistoryPage from "./pages/payments/PaymentHistoryPage";
import { AdminLayout, AdminDashboard } from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPayments from "./pages/admin/AdminPayments";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function AppInit({ children }) {
  const refreshUser = useAuthStore((s) => s.refreshUser);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <AppInit>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: { fontSize: "14px", borderRadius: "10px" },
              }}
            />
            <Routes>
              <Route element={<MainLayout />}>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Guest only */}
                <Route
                  path="/login"
                  element={
                    <GuestRoute>
                      <LoginPage />
                    </GuestRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <GuestRoute>
                      <RegisterPage />
                    </GuestRoute>
                  }
                />

                {/* Protected */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute>
                      <PaymentHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="payments" element={<AdminPayments />} />
                </Route>

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-[60vh] flex items-center justify-center text-center">
                      <div>
                        <h1 className="text-6xl font-bold text-slate-300">
                          404
                        </h1>
                        <p className="text-slate-500 mt-2">Page not found</p>
                      </div>
                    </div>
                  }
                />
              </Route>
            </Routes>
          </AppInit>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
