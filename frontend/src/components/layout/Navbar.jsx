import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import useCartStore from '../../store/cartStore';

const Navbar = () => {
  const getItemCount = useCartStore((state) => state.getItemCount);
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-white">
            E-CART<span className="text-blue-500">.</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link to="/products" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">Products</Link>
          <Link to="/categories" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">Categories</Link>
          <Link to="/new-arrivals" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">New Arrivals</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <button 
            onClick={() => setIsOpen(true)}
            className="relative text-gray-300 hover:text-white transition-colors"
          >
            <ShoppingCart size={20} />
            {getItemCount() > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {getItemCount()}
              </span>
            )}
          </button>
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
            <User size={20} />
          </Link>
          <button className="text-gray-300 hover:text-white md:hidden">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
