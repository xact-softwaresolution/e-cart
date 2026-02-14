import React from 'react';
import { User, Mail, Shield, Settings, Package, Heart } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Profile = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col items-center border-b border-white/10 pb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-black text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">{user?.name || 'User Name'}</h2>
              <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
            <nav className="mt-6 space-y-1">
              <button className="flex w-full items-center space-x-3 rounded-lg bg-white/5 px-4 py-2.5 text-sm font-bold text-white">
                <User size={18} />
                <span>Profile Info</span>
              </button>
              <button className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <Package size={18} />
                <span>My Orders</span>
              </button>
              <button className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <Heart size={18} />
                <span>Wishlist</span>
              </button>
              <button className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-grow space-y-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-bold text-white">Personal Information</h3>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                <div className="mt-2 flex items-center space-x-3 text-white">
                  <User size={18} className="text-blue-500" />
                  <span className="font-medium">{user?.name}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                <div className="mt-2 flex items-center space-x-3 text-white">
                  <Mail size={18} className="text-blue-500" />
                  <span className="font-medium">{user?.email}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Account Status</label>
                <div className="mt-2 flex items-center space-x-3 text-white">
                  <Shield size={18} className="text-green-500" />
                  <span className="font-medium">Verified Customer</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Role</label>
                <div className="mt-2 inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-500">
                  {user?.role || 'Customer'}
                </div>
              </div>
            </div>
            <button className="mt-12 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white transition-all hover:bg-blue-700">
              Update Profile
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
            <div className="mt-8 text-center py-12 border border-dashed border-white/10 rounded-xl">
              <p className="text-gray-500">No recent activity to show.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
