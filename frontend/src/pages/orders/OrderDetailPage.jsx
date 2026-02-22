import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CreditCard, RefreshCw } from 'lucide-react';
import { orderService } from '../../api/orderService';
import { paymentService } from '../../api/paymentService';
import { formatPrice, getErrorMessage } from '../../lib/utils';
import { SkeletonLine } from '../../components/ui/Skeleton';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const paymentStatusColors = {
  SUCCESS: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  CREATED: 'bg-blue-100 text-blue-700',
  FAILED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getById(orderId),
  });

  // Fetch payment info for this order
  const { data: paymentData } = useQuery({
    queryKey: ['order-payment', orderId],
    queryFn: () => paymentService.getByOrder(orderId),
    enabled: !!orderId,
  });

  const order = data?.data?.order || data?.data || null;
  const payments = paymentData?.data?.payments || paymentData?.data || [];
  const latestPayment = Array.isArray(payments) ? payments[0] : payments;

  const refundMutation = useMutation({
    mutationFn: (paymentId) => paymentService.requestRefund(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-payment', orderId] });
      toast.success('Refund requested successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLine className="h-8 w-1/3" />
        <SkeletonLine className="h-4 w-1/2" />
        <div className="space-y-3 mt-6">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonLine key={i} className="h-16 w-full" />)}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        Order not found.
        <button onClick={() => navigate('/orders')} className="block mt-4 text-indigo-600 font-medium hover:underline mx-auto cursor-pointer">
          Back to orders
        </button>
      </div>
    );
  }

  const items = order.items || order.orderItems || [];
  const canRefund = latestPayment &&
    (latestPayment.status === 'SUCCESS' || latestPayment.status === 'COMPLETED' || latestPayment.status === 'PAID') &&
    latestPayment.status !== 'REFUNDED' &&
    (order.status === 'DELIVERED' || order.status === 'CANCELLED');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm mb-6 cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order #{order.id?.slice(-8)}</h1>
          <p className="text-sm text-slate-500">{dayjs(order.createdAt).format('MMMM D, YYYY h:mm A')}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium w-fit ${statusColors[order.status] || 'bg-slate-100 text-slate-600'}`}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Items</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item, idx) => {
            const product = item.product || item;
            return (
              <div key={idx} className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  {(product.image || product.imageUrl) ? (
                    <img src={product.image || product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{product.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium text-slate-800 text-sm">{formatPrice(item.price * item.quantity)}</span>
              </div>
            );
          })}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="font-semibold text-slate-800">Total</span>
          <span className="text-xl font-bold text-indigo-600">{formatPrice(order.totalAmount || order.total)}</span>
        </div>
      </div>

      {/* Payment Info */}
      {latestPayment && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-500" /> Payment
            </h2>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[latestPayment.status] || 'bg-slate-100 text-slate-600'}`}>
              {latestPayment.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-slate-500">Amount</p>
            <p className="text-slate-800 font-medium">{formatPrice(latestPayment.amount)}</p>
            {latestPayment.razorpayPaymentId && (
              <>
                <p className="text-slate-500">Razorpay ID</p>
                <p className="text-slate-800 font-mono text-xs">{latestPayment.razorpayPaymentId}</p>
              </>
            )}
            <p className="text-slate-500">Date</p>
            <p className="text-slate-800">{dayjs(latestPayment.createdAt).format('MMM D, YYYY h:mm A')}</p>
          </div>
          {canRefund && (
            <button
              onClick={() => { if (confirm('Request a refund for this payment?')) refundMutation.mutate(latestPayment.id); }}
              disabled={refundMutation.isPending}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              {refundMutation.isPending ? 'Requesting...' : 'Request Refund'}
            </button>
          )}
        </div>
      )}

      {/* Delivery Address */}
      {order.address && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mt-4">
          <h2 className="font-semibold text-slate-800 mb-2">Delivery Address</h2>
          <p className="text-sm text-slate-600">
            {order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}
          </p>
        </div>
      )}
    </div>
  );
}
