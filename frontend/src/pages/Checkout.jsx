import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreditCard, Truck, MapPin, CheckCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  if (items.length === 0 && step !== 3) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
        <Link to="/products" className="mt-4 text-blue-500 hover:underline">Go to shop</Link>
      </div>
    );
  }

  const onSubmit = (data) => {
    if (step === 1) {
      setStep(2);
    } else {
      // Handle actual payment / order creation here
      const loadingToast = toast.loading('Processing your order...');
      setTimeout(() => {
        toast.success('Order placed successfully!', { id: loadingToast });
        clearCart();
        setStep(3);
      }, 2000);
    }
  };

  const steps = [
    { title: 'Shipping', icon: <Truck size={18} /> },
    { title: 'Payment', icon: <CreditCard size={18} /> },
    { title: 'Success', icon: <CheckCircle size={18} /> },
  ];

  if (step === 3) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-black text-white">Thank You for Your Order!</h1>
        <p className="mt-4 text-lg text-gray-400">
          Your order has been placed and is being processed. You will receive an email confirmation shortly.
        </p>
        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/" className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:bg-blue-700">
            Return to Home
          </Link>
          <button className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:bg-white/10">
            View Order Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 flex items-center justify-center">
        <div className="flex w-full max-w-md items-center justify-between">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${step > i + 1 ? 'bg-blue-600 border-blue-600 text-white' : step === i + 1 ? 'border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/10 text-gray-500'}`}>
                  {step > i + 1 ? <CheckCircle size={20} /> : s.icon}
                </div>
                <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${step === i + 1 ? 'text-blue-500' : 'text-gray-500'}`}>{s.title}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-[2px] flex-grow mx-4 transition-all ${step > i + 1 ? 'bg-blue-600' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-12 lg:flex-row">
        <div className="flex-grow">
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <MapPin className="mr-3 text-blue-500" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-400">Address line 1</label>
                    <input 
                      type="text" 
                      {...register('address', { required: 'Address is required' })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 py-3.5 px-4 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">City</label>
                    <input 
                      type="text" 
                      {...register('city', { required: 'City is required' })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 py-3.5 px-4 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Postal Code</label>
                    <input 
                      type="text" 
                      {...register('zip', { required: 'Zip is required' })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 py-3.5 px-4 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <CreditCard className="mr-3 text-blue-500" />
                  Payment Details
                </h2>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-400">
                  <p>In this MVP, we use simulated payments. In the future, Stripe or Razorpay will be integrated here.</p>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl border border-blue-500/50 bg-blue-500/5 p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 h-5 w-5 rounded-full border-4 border-blue-500 bg-black"></div>
                      <span className="font-bold text-white">Simulated Payment Gateway</span>
                    </div>
                    <CreditCard className="text-blue-500" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8">
              {step === 2 && (
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="mr-2" size={18} />
                  Back to Shipping
                </button>
              )}
              <div className="flex-grow" />
              <button 
                type="submit"
                className="flex items-center justify-center space-x-2 rounded-xl bg-blue-600 px-10 py-4 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                <span>{step === 1 ? 'Continue to Payment' : 'Place Order'}</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <aside className="w-full lg:w-96 lg:flex-shrink-0">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sticky top-24">
            <h3 className="text-xl font-bold text-white">Order Summary</h3>
            <div className="mt-8 space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                      <img src={item.images?.[0]?.url} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white truncate max-w-[120px]">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-500 italic">Free</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-black text-white">
                <span>Total</span>
                <span className="text-blue-500">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
