import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { productService } from '../../api/productService';
import { cartService } from '../../api/cartService';
import { formatPrice, getErrorMessage } from '../../lib/utils';
import { SkeletonLine } from '../../components/ui/Skeleton';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { incrementCart } = useCartStore();
  const [qty, setQty] = React.useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
  });

  const product = data?.data?.product || data?.data || null;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await cartService.addItem(product.id, qty);
      incrementCart();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="skeleton h-96 w-full rounded-xl" />
        <SkeletonLine className="h-8 w-1/2" />
        <SkeletonLine className="h-4 w-3/4" />
        <SkeletonLine className="h-10 w-1/4" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Product not found.</p>
        <button onClick={() => navigate('/products')} className="mt-4 text-indigo-600 font-medium hover:underline cursor-pointer">
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm mb-6 cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-slate-100 rounded-xl overflow-hidden aspect-square">
          {product.image || product.imageUrl ? (
            <img src={product.image || product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Package className="h-20 w-20" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full w-fit mb-2">
              {product.category.name || product.category}
            </span>
          )}
          <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-slate-500 mt-3 text-sm leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <span className="text-3xl font-bold text-indigo-600">{formatPrice(product.price)}</span>
          </div>

          <div className="mt-2">
            {product.quantity > 0 ? (
              <span className="text-sm text-emerald-600 font-medium">In stock ({product.quantity} available)</span>
            ) : (
              <span className="text-sm text-red-500 font-medium">Out of stock</span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-slate-300 rounded-lg">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-medium border-x border-slate-300">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.quantity || 10, qty + 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.quantity <= 0}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
