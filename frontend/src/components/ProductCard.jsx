import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
    setIsOpen(true);
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all group-hover:border-blue-500/50">
        <Link to={`/products/${product.id}`}>
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0].url} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/5">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </Link>
        <button className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity hover:bg-blue-600 group-hover:opacity-100 backdrop-blur-md">
          <Heart size={18} />
        </button>
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-400">{product.category?.name || 'Category'}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="mt-1 text-lg font-bold text-white transition-colors hover:text-blue-500">{product.name}</h3>
        </Link>
        <p className="mt-1 text-blue-500 font-bold">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
