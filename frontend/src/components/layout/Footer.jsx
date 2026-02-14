import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Featured Items</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Discounts</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Newsletter</h3>
            <p className="mb-4 text-sm">Join our mailing list for updates.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full rounded-l-md border border-white/20 bg-white/5 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
              <button className="rounded-r-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs">
          <p>© {new Date().getFullYear()} E-CART. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
