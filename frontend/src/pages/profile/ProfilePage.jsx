import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { User, Mail, MapPin } from 'lucide-react';
import { userService } from '../../api/userService';
import useAuthStore from '../../store/authStore';
import { getErrorMessage } from '../../lib/utils';
import { SkeletonLine } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['profile'], queryFn: userService.getMe });
  const { data: addrData } = useQuery({ queryKey: ['addresses'], queryFn: userService.getAddresses });

  const profile = data?.data?.user || data?.data || user;
  const addresses = addrData?.data?.addresses || addrData?.data || [];

  const { register, handleSubmit, formState: { errors } } = useForm({
    values: { name: profile?.name || '', email: profile?.email || '' },
  });

  const updateMutation = useMutation({
    mutationFn: userService.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLine className="h-8 w-1/3" />
        <SkeletonLine className="h-4 w-1/2" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h1>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <User className="inline h-4 w-4 mr-1" /> Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <Mail className="inline h-4 w-4 mr-1" /> Email
            </label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="text-sm text-slate-500">
            <p>Role: <span className="font-medium text-slate-700">{profile?.role || 'USER'}</span></p>
          </div>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
          >
            {updateMutation.isPending ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Addresses */}
      <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
        <MapPin className="inline h-5 w-5 mr-1" /> My Addresses
      </h2>
      {addresses.length === 0 ? (
        <p className="text-sm text-slate-500">No addresses saved.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-sm font-medium text-slate-800">{addr.street}</p>
              <p className="text-sm text-slate-500">{addr.city}, {addr.state} {addr.zip}</p>
              <p className="text-sm text-slate-500">{addr.country}</p>
              {addr.isDefault && <span className="text-xs text-indigo-600 font-medium">Default</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
