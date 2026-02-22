import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Tag } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { getErrorMessage } from '../../lib/utils';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminService.getCategories,
  });

  const categories = data?.data?.categories || data?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => adminService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category created');
      setShowForm(false);
      setName('');
      setDescription('');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name: name.trim(), description: description.trim() });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-xl p-4 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-slate-600 text-sm font-medium hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <SkeletonTable rows={4} cols={3} />
      ) : categories.length === 0 ? (
        <EmptyState icon={Tag} title="No categories" message="Create your first category to organize products." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Description</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Products</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <Tag className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-medium text-slate-800">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{cat.description || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{cat._count?.products ?? cat.productCount ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => { if (confirm(`Delete category "${cat.name}"?`)) deleteMutation.mutate(cat.id); }}
                        className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
