import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const CartSlideOver = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md transform transition-transform border-l border-white/10 bg-zinc-950 p-6 shadow-2xl">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <ShoppingBag className="mr-2" size={24} />
                Your Cart
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mt-8 flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                  <div className="rounded-full bg-white/5 p-6">
                    <ShoppingBag size={48} className="text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Your cart is empty</h3>
                  <p className="text-gray-400">Looks like you haven't added anything yet.</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="rounded-full bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-white/5 border border-white/10">
                        <img 
                          src={item.images?.[0]?.url || 'https://via.placeholder.com/150'} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between">
                            <h4 className="font-bold text-white truncate max-w-[150px]">{item.name}</h4>
                            <p className="font-bold text-blue-500">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 uppercase tracking-widest">{item.category?.name || 'Standard'}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:text-blue-500 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="mx-2 text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:text-blue-500 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex justify-between text-base font-bold text-white">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-8 space-y-4">
                  <Link 
                    to="/checkout" 
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={20} />
                  </Link>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSlideOver;
