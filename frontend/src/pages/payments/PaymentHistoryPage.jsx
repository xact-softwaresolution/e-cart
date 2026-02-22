import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CreditCard, ChevronRight, Wallet } from 'lucide-react';
import { paymentService } from '../../api/paymentService';
import { formatPrice } from '../../lib/utils';
import { SkeletonLine } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import dayjs from 'dayjs';

const statusColors = {
  SUCCESS: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  CREATED: 'bg-blue-100 text-blue-700',
  FAILED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
};

export default function PaymentHistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentService.getAll,
  });

  const payments = data?.data?.payments || data?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLine className="h-8 w-1/3" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-xl space-y-2">
            <SkeletonLine className="h-4 w-1/3" />
            <SkeletonLine className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Payment History</h1>

      {payments.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No payments yet"
          message="Your payment history will appear here after you make a purchase."
          action={
            <Link to="/products" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
              Browse Products
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Payment #{payment.id?.slice(-8)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {dayjs(payment.createdAt).format('MMM D, YYYY h:mm A')}
                    </p>
                    {payment.orderId && (
                      <Link
                        to={`/orders/${payment.orderId}`}
                        className="text-xs text-indigo-600 hover:underline mt-0.5 inline-block"
                      >
                        View Order →
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[payment.status] || 'bg-slate-100 text-slate-600'}`}>
                    {payment.status}
                  </span>
                  <span className="font-bold text-indigo-600 text-sm">
                    {formatPrice(payment.amount)}
                  </span>
                </div>
              </div>
              {payment.razorpayPaymentId && (
                <p className="text-xs text-slate-400 mt-2">
                  Razorpay ID: {payment.razorpayPaymentId}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
