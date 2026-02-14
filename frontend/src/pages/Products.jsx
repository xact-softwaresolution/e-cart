import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import productService from '../services/product.service';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', selectedCategory, sortBy, searchTerm],
    queryFn: () => productService.getProducts({ 
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      sort: sortBy,
      search: searchTerm || undefined
    }),
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black text-white">All Products</h1>
          <p className="mt-2 text-gray-400">Discover our entire collection of premium goods.</p>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
            />
          </div>
          <button className="flex items-center justify-center space-x-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10">
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 lg:flex-shrink-0">
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">Categories</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={`block w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${selectedCategory === 'all' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  All Categories
                </button>
                {categoriesLoading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-9 w-full animate-pulse rounded-lg bg-white/5"></div>)
                ) : (
                  categories.map((category) => (
                    <button 
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`block w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${selectedCategory === category.slug ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">Sort By</h3>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {productsLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-xl bg-white/5"></div>
                  <div className="mt-4 h-4 w-3/4 rounded bg-white/5"></div>
                  <div className="mt-2 h-4 w-1/2 rounded bg-white/5"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-center">
              <Search size={48} className="mb-4 text-gray-600" />
              <p className="text-lg font-medium text-gray-400">No products found</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="mt-4 text-blue-500 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
