import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Shield, User } from 'lucide-react';
import { adminService } from '../../api/adminService';
import { getErrorMessage } from '../../lib/utils';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: adminService.getUsers });
  const users = data?.data?.users || data?.data || [];

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Users</h1>
        <SkeletonTable rows={5} cols={4} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Users</h1>

      {users.length === 0 ? (
        <EmptyState title="No users" message="Users will appear here." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">User</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Role</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Joined</th>
                  <th className="text-right px-4 py-3 text-slate-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-slate-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{dayjs(u.createdAt).format('MMM D, YYYY')}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateRoleMutation.mutate({ userId: u.id, role: u.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                          title={u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                        >
                          {u.role === 'ADMIN' ? <User className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => { if (confirm('Delete this user?')) deleteMutation.mutate(u.id); }}
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
