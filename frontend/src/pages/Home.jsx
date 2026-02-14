import React from 'react';
import { useQuery } from '@tanstack/react-query';
import productService from '../services/product.service';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getProducts({ limit: 4 }),
  });

  const products = response?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-800 to-black px-8 py-24 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-md">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-blue-400"></span>
            New Arrivals for 2026
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            Redefine Your <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Style.</span>
          </h1>
          <p className="mb-8 text-lg text-gray-300">
            Discover a curated collection of premium products designed for the modern individual. Speed, quality, and aesthetics combined.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-full bg-white px-10 py-4 font-bold text-indigo-900 transition-all hover:scale-105 hover:bg-blue-50 active:scale-95 shadow-lg shadow-white/10">
              Shop Collection
            </button>
            <button className="rounded-full border border-white/20 bg-white/5 px-10 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white/10">
              View Lookbook
            </button>
          </div>
        </div>
        
        {/* Abstract shapes for premium feel */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-pulse"></div>
      </div>

      {/* Featured Products */}
      <section className="mt-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-white">Featured</h2>
            <div className="mt-2 h-1 w-12 bg-blue-600 rounded-full"></div>
          </div>
          <button className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">
            View All Products
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-xl bg-white/5"></div>
                <div className="mt-4 h-4 w-3/4 rounded bg-white/5"></div>
                <div className="mt-2 h-4 w-1/2 rounded bg-white/5"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-500">
            Failed to load products. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
