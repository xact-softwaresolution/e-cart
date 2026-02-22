import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Boxes, Tag, CreditCard, TrendingUp, UserCheck } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { formatPrice } from '../../lib/utils';
import { SkeletonLine } from '../../components/ui/Skeleton';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/categories', icon: Tag, label: 'Categories' },
  { to: '/admin/inventory', icon: Boxes, label: 'Inventory' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <nav className="lg:w-56 flex-shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl p-3 lg:sticky lg:top-24">
            <div className="flex lg:flex-col gap-1 overflow-x-auto">
              {navItems.map(({ to, icon: Icon, label, exact }) => {
                const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getDashboardStats,
  });

  // Order metrics
  const { data: orderMetrics } = useQuery({
    queryKey: ['admin-order-metrics'],
    queryFn: adminService.getOrderMetrics,
  });

  // User metrics
  const { data: userMetrics } = useQuery({
    queryKey: ['admin-user-metrics'],
    queryFn: adminService.getUserMetrics,
  });

  const stats = data?.data || {};
  const oMetrics = orderMetrics?.data || {};
  const uMetrics = userMetrics?.data || {};

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonLine className="h-8 w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: formatPrice(stats.totalRevenue || 0), icon: BarChart3, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'text-purple-600 bg-purple-50' },
          { label: 'Products', value: stats.totalProducts || 0, icon: Package, color: 'text-orange-600 bg-orange-50' },
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

      {/* Order & User Metrics */}
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        {/* Order Metrics */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold text-slate-800">Order Metrics</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Pending', value: oMetrics.pending ?? oMetrics.pendingOrders ?? '—', dot: 'bg-yellow-400' },
              { label: 'Confirmed', value: oMetrics.confirmed ?? oMetrics.confirmedOrders ?? '—', dot: 'bg-blue-400' },
              { label: 'Shipped', value: oMetrics.shipped ?? oMetrics.shippedOrders ?? '—', dot: 'bg-purple-400' },
              { label: 'Delivered', value: oMetrics.delivered ?? oMetrics.deliveredOrders ?? '—', dot: 'bg-emerald-400' },
              { label: 'Cancelled', value: oMetrics.cancelled ?? oMetrics.cancelledOrders ?? '—', dot: 'bg-red-400' },
              { label: 'Avg. Value', value: oMetrics.averageOrderValue ? formatPrice(oMetrics.averageOrderValue) : '—', dot: 'bg-indigo-400' },
            ].map(({ label, value, dot }) => (
              <div key={label} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${dot}`} />
                  <span className="text-slate-600">{label}</span>
                </span>
                <span className="font-bold text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Metrics */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="h-5 w-5 text-purple-600" />
            <h2 className="font-semibold text-slate-800">User Metrics</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Total Users', value: uMetrics.totalUsers ?? '—', dot: 'bg-indigo-400' },
              { label: 'Admins', value: uMetrics.adminUsers ?? uMetrics.admins ?? '—', dot: 'bg-purple-400' },
              { label: 'New (30d)', value: uMetrics.newUsersLast30Days ?? uMetrics.newUsers ?? '—', dot: 'bg-emerald-400' },
              { label: 'Active', value: uMetrics.activeUsers ?? '—', dot: 'bg-blue-400' },
            ].map(({ label, value, dot }) => (
              <div key={label} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${dot}`} />
                  <span className="text-slate-600">{label}</span>
                </span>
                <span className="font-bold text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {stats.recentOrders && stats.recentOrders.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-2 text-slate-600 font-medium">Order ID</th>
                  <th className="text-left px-4 py-2 text-slate-600 font-medium">Status</th>
                  <th className="text-right px-4 py-2 text-slate-600 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 text-slate-700">#{order.id?.slice(-8)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">{formatPrice(order.totalAmount || order.total)}</td>
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
