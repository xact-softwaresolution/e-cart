import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/adminService';
import { formatPrice, getErrorMessage } from '../../lib/utils';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const statusOptions = ['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['admin-orders'], queryFn: adminService.getOrders });
  const orders = data?.data?.orders || data?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => adminService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Orders</h1>
        <SkeletonTable rows={5} cols={5} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Orders</h1>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Orders will appear here when customers make purchases." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Order ID</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Date</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">#{order.id?.slice(-8)}</td>
                    <td className="px-4 py-3 text-slate-600">{order.user?.name || order.user?.email || '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{dayjs(order.createdAt).format('MMM D, YYYY')}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">{formatPrice(order.totalAmount || order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-slate-100 text-slate-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            updateStatusMutation.mutate({ orderId: order.id, status: e.target.value });
                          }
                        }}
                        className="px-2 py-1 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Update</option>
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
