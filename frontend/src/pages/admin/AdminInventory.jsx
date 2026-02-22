import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Package, RefreshCw, ArrowDownCircle, ArrowUpCircle, RotateCcw } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { formatPrice, getErrorMessage } from '../../lib/utils';
import { SkeletonTable, SkeletonLine } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

const reasonOptions = [
  { value: 'RESTOCK', label: 'Restock', icon: ArrowUpCircle, color: 'text-emerald-600' },
  { value: 'DAMAGE', label: 'Damage', icon: ArrowDownCircle, color: 'text-red-600' },
  { value: 'RETURN', label: 'Return', icon: RotateCcw, color: 'text-blue-600' },
];

export default function AdminInventory() {
  const queryClient = useQueryClient();
  const [updateForm, setUpdateForm] = useState(null);
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('RESTOCK');

  // Low stock products
  const { data: lowStockData, isLoading: lowLoading } = useQuery({
    queryKey: ['admin-low-stock'],
    queryFn: adminService.getLowStock,
  });

  // Inventory report
  const { data: reportData, isLoading: reportLoading } = useQuery({
    queryKey: ['admin-inventory-report'],
    queryFn: adminService.getInventoryReport,
  });

  // All products for stock management
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: adminService.getProducts,
  });

  const lowStockProducts = lowStockData?.data?.products || lowStockData?.data || [];
  const report = reportData?.data || {};
  const products = productsData?.data?.products || productsData?.data || [];

  const updateMutation = useMutation({
    mutationFn: (data) => adminService.updateInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-low-stock'] });
      queryClient.invalidateQueries({ queryKey: ['admin-inventory-report'] });
      toast.success('Inventory updated');
      setUpdateForm(null);
      setQty('');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!qty || !updateForm) return;
    updateMutation.mutate({
      productId: updateForm,
      quantity: parseInt(qty),
      reason,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Inventory Management</h1>

      {/* Report Summary */}
      {!reportLoading && report && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: report.totalProducts ?? products.length, color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Total Stock', value: report.totalStock ?? '—', color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Low Stock Items', value: report.lowStockCount ?? lowStockProducts.length, color: 'text-amber-600 bg-amber-50' },
            { label: 'Out of Stock', value: report.outOfStockCount ?? '—', color: 'text-red-600 bg-red-50' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-sm text-slate-500">{label}</p>
              <p className={`text-xl font-bold mt-1 ${color.split(' ')[0]}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="font-semibold text-amber-800">Low Stock Alerts ({lowStockProducts.length})</h2>
          </div>
          <div className="space-y-2">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-100">
                <span className="text-sm font-medium text-slate-800">{p.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-red-600 font-bold">{p.quantity} left</span>
                  <button
                    onClick={() => { setUpdateForm(p.id); setReason('RESTOCK'); }}
                    className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition cursor-pointer"
                  >
                    Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Update Stock Form */}
      {updateForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-slate-800 mb-3">Update Stock</h2>
          <form onSubmit={handleUpdate} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Product</label>
              <select
                value={updateForm}
                onChange={(e) => setUpdateForm(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} (stock: {p.quantity})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Quantity</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="10"
                required
                min="1"
                className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {reasonOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Stock'}
            </button>
            <button
              type="button"
              onClick={() => setUpdateForm(null)}
              className="px-4 py-2 text-slate-600 text-sm font-medium hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* All Products Stock Table */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800">All Products</h2>
        {!updateForm && (
          <button
            onClick={() => setUpdateForm(products[0]?.id || '')}
            className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" /> Update Stock
          </button>
        )}
      </div>

      {productsLoading ? (
        <SkeletonTable rows={5} cols={4} />
      ) : products.length === 0 ? (
        <EmptyState title="No products" message="Add products first to manage inventory." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Product</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Price</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Stock</th>
                  <th className="text-center px-4 py-3 text-slate-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">{p.quantity}</td>
                    <td className="px-4 py-3 text-center">
                      {p.quantity === 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Out of Stock</span>
                      ) : p.quantity <= 5 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Low</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">In Stock</span>
                      )}
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
