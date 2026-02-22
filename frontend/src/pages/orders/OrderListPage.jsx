import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { orderService } from '../../api/orderService';
import { formatPrice } from '../../lib/utils';
import { SkeletonLine } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import dayjs from 'dayjs';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function OrderListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getAll,
  });

  const orders = data?.data?.orders || data?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
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
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          message="Start shopping and your orders will appear here."
          action={
            <Link to="/products" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
              Browse Products
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">Order #{order.id?.slice(-8)}</p>
                  <p className="text-xs text-slate-500 mt-1">{dayjs(order.createdAt).format('MMM D, YYYY h:mm A')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-slate-100 text-slate-600'}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-indigo-600 text-sm">{formatPrice(order.totalAmount || order.total)}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
