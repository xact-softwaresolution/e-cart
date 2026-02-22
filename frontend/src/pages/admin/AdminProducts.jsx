import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { formatPrice, getErrorMessage } from '../../lib/utils';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const { data, isLoading } = useQuery({ queryKey: ['admin-products'], queryFn: adminService.getProducts });
  const { data: catData } = useQuery({ queryKey: ['admin-categories'], queryFn: adminService.getCategories });

  const products = data?.data?.products || data?.data || [];
  const categories = catData?.data?.categories || catData?.data || [];

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editProduct}
          categories={categories}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            setShowForm(false);
            setEditProduct(null);
          }}
        />
      )}

      {isLoading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : products.length === 0 ? (
        <EmptyState title="No products" message="Create your first product to get started." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Product</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Category</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Price</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Stock</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          {(p.image || p.imageUrl) ? (
                            <img src={p.image || p.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">—</div>
                          )}
                        </div>
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.category?.name || '—'}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.quantity <= 5 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {p.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(p)} className="p-1.5 text-slate-400 hover:text-indigo-600 cursor-pointer">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(p.id); }}
                          className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

function ProductForm({ product, categories, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    quantity: product?.quantity || '',
    categoryId: product?.categoryId || product?.category?.id || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const isEdit = Boolean(product);

  const mutation = useMutation({
    mutationFn: (fd) => isEdit ? adminService.updateProduct(product.id, fd) : adminService.createProduct(fd),
    onSuccess: () => {
      toast.success(isEdit ? 'Product updated' : 'Product created');
      onSuccess();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => { if (v) fd.append(k, v); });
    if (imageFile) fd.append('image', imageFile);
    mutation.mutate(fd);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800">{isEdit ? 'Edit Product' : 'New Product'}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-5 w-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Product name"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Price (in paise)"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="Stock quantity"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="text-sm text-slate-600"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
        >
          {mutation.isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
