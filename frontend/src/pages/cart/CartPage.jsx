import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { cartService } from '../../api/cartService';
import { formatPrice, getErrorMessage } from '../../lib/utils';
import { SkeletonLine } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import useCartStore from '../../store/cartStore';
import toast from 'react-hot-toast';

export default function CartPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setCartCount } = useCartStore();

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  });

  const cartItems = data?.data?.items || data?.data?.cartItems || [];
  const totalPrice = data?.data?.totalPrice || data?.data?.total || 0;

  // Sync cart count
  React.useEffect(() => {
    if (cartItems.length >= 0) {
      setCartCount(cartItems.length);
    }
  }, [cartItems.length, setCartCount]);

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }) => cartService.updateItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId) => cartService.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const clearMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCartCount(0);
      toast.success('Cart cleared');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 bg-white p-4 rounded-xl">
            <div className="skeleton h-24 w-24 rounded-lg" />
            <div className="flex-1 space-y-2">
              <SkeletonLine className="h-4 w-1/2" />
              <SkeletonLine className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Browse products and add items to your cart."
          action={
            <Link to="/products" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
              Browse Products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
        <button
          onClick={() => clearMutation.mutate()}
          className="text-sm text-red-500 hover:text-red-600 font-medium cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const product = item.product || item;
          return (
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200">
              <div className="h-24 w-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                {product.image || product.imageUrl ? (
                  <img src={product.image || product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-800 text-sm truncate">{product.name}</h3>
                <p className="text-indigo-600 font-bold text-sm mt-1">{formatPrice(product.price || item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-slate-300 rounded-lg">
                    <button
                      onClick={() => updateMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                      className="p-1.5 text-slate-500 hover:bg-slate-50 cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-xs font-medium border-x border-slate-300">{item.quantity}</span>
                    <button
                      onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                      className="p-1.5 text-slate-500 hover:bg-slate-50 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeMutation.mutate(item.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-600 font-medium">Total</span>
          <span className="text-2xl font-bold text-indigo-600">{formatPrice(totalPrice)}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
