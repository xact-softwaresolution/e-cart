import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '../../api/userService';
import { orderService } from '../../api/orderService';
import { cartService } from '../../api/cartService';
import { paymentService } from '../../api/paymentService';
import { formatPrice, getErrorMessage } from '../../lib/utils';
import Spinner from '../../components/ui/Spinner';
import useCartStore from '../../store/cartStore';
import toast from 'react-hot-toast';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { setCartCount } = useCartStore();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cartData } = useQuery({ queryKey: ['cart'], queryFn: cartService.getCart });
  const { data: addressData, refetch: refetchAddresses } = useQuery({ queryKey: ['addresses'], queryFn: userService.getAddresses });

  const addresses = addressData?.data?.addresses || addressData?.data || [];
  const cartItems = cartData?.data?.items || cartData?.data?.cartItems || [];
  const totalPrice = cartData?.data?.totalPrice || cartData?.data?.total || 0;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'India', isDefault: false },
  });

  const addAddressMutation = useMutation({
    mutationFn: userService.addAddress,
    onSuccess: (data) => {
      refetchAddresses();
      setShowAddForm(false);
      reset();
      const newAddr = data?.data?.address || data?.data;
      if (newAddr) setSelectedAddress(newAddr.id);
      toast.success('Address added');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  // Auto-select default address
  React.useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr.id);
    }
  }, [addresses, selectedAddress]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    setIsProcessing(true);
    try {
      // 1. Create order
      const orderRes = await orderService.create(selectedAddress);
      const order = orderRes?.data?.order || orderRes?.data;
      const orderId = order?.id;

      // 2. Initiate payment
      const paymentRes = await paymentService.initiate(orderId);
      const razorpayOrder = paymentRes?.data;

      // 3. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'E-Cart',
        description: `Order #${orderId}`,
        order_id: razorpayOrder.razorpayOrderId || razorpayOrder.id,
        handler: async (response) => {
          try {
            await paymentService.verify({
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setCartCount(0);
            toast.success('Payment successful!');
            navigate(`/orders/${orderId}`);
          } catch (err) {
            toast.error('Payment verification failed');
            navigate(`/orders/${orderId}`);
          }
        },
        prefill: {},
        theme: { color: '#4f46e5' },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Razorpay SDK not loaded');
        // Fallback: still redirect to order
        setCartCount(0);
        navigate(`/orders/${orderId}`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Address Section */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Delivery Address</h2>
            <button onClick={() => setShowAddForm(!showAddForm)} className="text-sm text-indigo-600 font-medium flex items-center gap-1 cursor-pointer">
              <Plus className="h-4 w-4" /> Add New
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit((data) => addAddressMutation.mutate(data))} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <input {...register('street')} placeholder="Street address" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                </div>
                <div>
                  <input {...register('city')} placeholder="City" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <input {...register('state')} placeholder="State" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <input {...register('zip')} placeholder="ZIP code" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>}
                </div>
                <div>
                  <input {...register('country')} placeholder="Country" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" {...register('isDefault')} className="rounded" /> Set as default
              </label>
              <button type="submit" disabled={addAddressMutation.isPending} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer">
                {addAddressMutation.isPending ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          )}

          {addresses.length === 0 && !showAddForm ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No addresses found. Add one to proceed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 p-4 bg-white border rounded-xl cursor-pointer transition ${
                    selectedAddress === addr.id ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-slate-800">{addr.street}</p>
                    <p className="text-slate-500">{addr.city}, {addr.state} {addr.zip}</p>
                    <p className="text-slate-500">{addr.country}</p>
                    {addr.isDefault && <span className="text-xs text-indigo-600 font-medium">Default</span>}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {cartItems.map((item) => {
              const product = item.product || item;
              return (
                <div key={item.id} className="flex justify-between">
                  <span className="text-slate-600 truncate max-w-[60%]">{product.name} × {item.quantity}</span>
                  <span className="text-slate-800 font-medium">{formatPrice((product.price || item.price) * item.quantity)}</span>
                </div>
              );
            })}
          </div>
          <hr className="my-4 border-slate-200" />
          <div className="flex justify-between font-bold text-slate-900">
            <span>Total</span>
            <span className="text-indigo-600">{formatPrice(totalPrice)}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing || !selectedAddress}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
          >
            {isProcessing && <Spinner size="sm" className="text-white" />}
            Place Order & Pay
          </button>
        </div>
      </div>
    </div>
  );
}
