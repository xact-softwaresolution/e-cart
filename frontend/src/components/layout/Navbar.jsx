import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, Wallet } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cartCount } = useCartStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">
            E-Cart
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition">
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition">
                  Orders
                </Link>
                <Link to="/payments" className="text-slate-600 hover:text-indigo-600 transition" title="Payments">
                  <Wallet className="h-5 w-5" />
                </Link>
                <Link to="/cart" className="relative text-slate-600 hover:text-indigo-600 transition">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-slate-600 hover:text-indigo-600 transition" title="Admin">
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                )}
                <Link to="/profile" className="text-slate-600 hover:text-indigo-600 transition" title="Profile">
                  <User className="h-5 w-5" />
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition cursor-pointer" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-slate-600 cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 space-y-2">
          <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-600 text-sm font-medium">Products</Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-600 text-sm font-medium">Orders</Link>
              <Link to="/payments" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-600 text-sm font-medium">Payments</Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-600 text-sm font-medium">
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-600 text-sm font-medium">Admin</Link>}
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-600 text-sm font-medium">Profile</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-red-500 text-sm font-medium cursor-pointer">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-600 text-sm font-medium">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 text-indigo-600 text-sm font-medium">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
