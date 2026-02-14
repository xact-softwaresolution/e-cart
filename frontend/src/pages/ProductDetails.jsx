import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Heart, Shield, Truck, RotateCcw, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import productService from '../services/product.service';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  });

  const product = response?.data;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart!`);
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="w-full lg:w-1/2 animate-pulse">
            <div className="aspect-square rounded-2xl bg-white/5"></div>
          </div>
          <div className="w-full space-y-6 lg:w-1/2 animate-pulse">
            <div className="h-4 w-1/4 rounded bg-white/5"></div>
            <div className="h-10 w-3/4 rounded bg-white/5"></div>
            <div className="h-6 w-1/4 rounded bg-white/5"></div>
            <div className="h-32 w-full rounded bg-white/5"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-white">Product not found</h2>
        <Link to="/products" className="mt-4 text-blue-500 hover:underline">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex text-sm font-medium text-gray-500">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-white transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300 truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            {product.images && product.images[selectedImage] ? (
              <img 
                src={product.images[selectedImage].url} 
                alt={product.name} 
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center text-gray-500">No Image</div>
            )}
            
            {product.images?.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                {product.images.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`h-1.5 w-8 rounded-full transition-all ${idx === selectedImage ? 'bg-blue-600' : 'bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {product.images?.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square overflow-hidden rounded-xl border transition-all ${idx === selectedImage ? 'border-blue-500' : 'border-white/10 hover:border-white/30'}`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-500">
            {product.category?.name || 'Limited Edition'}
          </p>
          <h1 className="mt-2 text-4xl font-black text-white md:text-5xl">{product.name}</h1>
          
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-sm text-gray-400">(4.8 • 124 reviews)</span>
          </div>

          <div className="mt-8 flex items-end space-x-4">
            <p className="text-3xl font-black text-white">${product.price.toFixed(2)}</p>
            {product.compareAtPrice && (
              <p className="mb-1 text-xl text-gray-500 line-through">${product.compareAtPrice.toFixed(2)}</p>
            )}
          </div>

          <p className="mt-8 text-lg leading-relaxed text-gray-300">
            {product.description || 'Elevate your lifestyle with this premium product. Crafted with precision and designed for those who demand the best.'}
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex flex-grow items-center justify-center space-x-3 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/20"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              <button className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-all hover:border-red-500/50 hover:text-red-500">
                <Heart size={20} />
              </button>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 border-t border-white/10 pt-12 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <Truck size={24} />
              </div>
              <h4 className="text-sm font-bold text-white">Free Shipping</h4>
              <p className="mt-1 text-xs text-gray-500">Orders over $500</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                <Shield size={24} />
              </div>
              <h4 className="text-sm font-bold text-white">Secure Payment</h4>
              <p className="mt-1 text-xs text-gray-500">100% encrypted</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                <RotateCcw size={24} />
              </div>
              <h4 className="text-sm font-bold text-white">30 Day Returns</h4>
              <p className="mt-1 text-xs text-gray-500">Hassle free</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
