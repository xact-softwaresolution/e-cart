import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, DollarSign, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { formatPrice } from '../../lib/utils';
import { SkeletonTable, SkeletonLine } from '../../components/ui/Skeleton';
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

export default function AdminPayments() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-payment-stats'],
    queryFn: adminService.getPaymentStats,
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['admin-all-payments'],
    queryFn: adminService.getAllPayments,
  });

  const stats = statsData?.data || {};
  const payments = paymentsData?.data?.payments || paymentsData?.data || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Payments</h1>

      {/* Stats Cards */}
      {!statsLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: formatPrice(stats.totalRevenue || stats.total || 0), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Successful', value: stats.successfulPayments ?? stats.successful ?? '—', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
            { label: 'Failed', value: stats.failedPayments ?? stats.failed ?? '—', icon: XCircle, color: 'text-red-600 bg-red-50' },
            { label: 'Refunds', value: stats.refunds ?? stats.refunded ?? '—', icon: RefreshCw, color: 'text-purple-600 bg-purple-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Payments Table */}
      {paymentsLoading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments" message="Payment records will appear here." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Payment ID</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">User</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">#{p.id?.slice(-8)}</td>
                    <td className="px-4 py-3 text-slate-600">{p.user?.name || p.user?.email || '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{dayjs(p.createdAt).format('MMM D, YYYY')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-slate-100 text-slate-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">{formatPrice(p.amount)}</td>
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
