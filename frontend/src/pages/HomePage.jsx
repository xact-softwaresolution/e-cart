import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, CreditCard } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              Shop the best products at unbeatable prices
            </h1>
            <p className="mt-4 text-lg text-indigo-100">
              Discover a wide range of quality products with fast delivery and secure payments.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                to="/products"
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition"
              >
                Browse Products
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-400 border border-indigo-400 transition"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: ShoppingBag, title: 'Wide Selection', desc: 'Thousands of products across categories' },
            { icon: Truck, title: 'Fast Delivery', desc: 'Quick and reliable shipping' },
            { icon: Shield, title: 'Secure Shopping', desc: 'Your data is always protected' },
            { icon: CreditCard, title: 'Easy Payments', desc: 'Multiple payment options available' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition">
              <Icon className="h-10 w-10 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
