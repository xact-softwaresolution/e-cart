import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { productService } from '../../api/productService';
import { cartService } from '../../api/cartService';
import { formatPrice, getErrorMessage } from '../../lib/utils';
import { SkeletonCard } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import toast from 'react-hot-toast';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const { isAuthenticated } = useAuthStore();
  const { incrementCart } = useCartStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', page, search],
    queryFn: () => productService.getAll({ page, limit: 12, search }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  });

  const products = data?.data?.products || data?.data || [];
  const totalPages = data?.data?.totalPages || data?.totalPages || 1;
  const categories = categoriesData?.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchInput, page: '1' });
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await cartService.addItem(productId, 1);
      incrementCart();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition cursor-pointer">
            Search
          </button>
        </form>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setSearchParams({ page: '1' })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
              !search ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-300'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSearchParams({ search: cat.name, page: '1' })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                search === cat.name ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-500">Failed to load products. Please try again.</div>
      ) : products.length === 0 ? (
        <EmptyState title="No products found" message="Try adjusting your search or browse all products." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition group">
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-square bg-slate-100 overflow-hidden">
                    {product.image || product.imageUrl ? (
                      <img
                        src={product.image || product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No Image</div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 hover:text-indigo-600 transition">{product.name}</h3>
                  </Link>
                  {product.category && (
                    <p className="text-xs text-slate-400 mt-1">{product.category.name || product.category}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-indigo-600">{formatPrice(product.price)}</span>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer"
                      title="Add to cart"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSearchParams({ search, page: String(i + 1) })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                    page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-300 hover:border-indigo-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
