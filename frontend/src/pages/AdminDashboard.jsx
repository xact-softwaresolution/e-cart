import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Users, Package, TrendingUp, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import productService from '../services/product.service';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getProducts(),
  });

  const products = productsData?.data || [];

  const stats = [
    { label: 'Total Revenue', value: '$45,231.89', icon: <TrendingUp size={20} />, color: 'bg-green-500/10 text-green-500' },
    { label: 'Active Orders', value: '12', icon: <ShoppingBag size={20} />, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Total Products', value: '48', icon: <Package size={20} />, color: 'bg-purple-500/10 text-purple-500' },
    { label: 'Total Users', value: '2,341', icon: <Users size={20} />, color: 'bg-orange-500/10 text-orange-500' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-white flex items-center mb-8">
              <LayoutDashboard className="mr-3 text-blue-500" />
              Admin
            </h2>
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: <TrendingUp size={18} /> },
                { id: 'products', label: 'Products', icon: <Package size={18} /> },
                { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
                { id: 'users', label: 'Users', icon: <Users size={18} /> },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500 uppercase tracking-widest">{stat.label}</p>
                <h3 className="mt-1 text-2xl font-black text-white">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Table Area */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white capitalize">{activeTab} Management</h3>
              {activeTab === 'products' && (
                <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-all">
                  <Plus size={18} />
                  <span>Add Product</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {productsLoading ? (
                    [1, 2, 3].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 w-32 rounded bg-white/5" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-white/5" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-white/5" /></td>
                        <td className="px-6 py-4 text-right"><div className="ml-auto h-4 w-16 rounded bg-white/5" /></td>
                      </tr>
                    ))
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="text-sm hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center font-medium text-white">
                            <div className="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-white/5">
                              <img src={product.images?.[0]?.url} alt="" className="h-full w-full object-cover" />
                            </div>
                            {product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-500">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="rounded p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                              <Edit2 size={16} />
                            </button>
                            <button className="rounded p-2 text-gray-400 hover:bg-white/5 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                            <button className="rounded p-2 text-gray-400 hover:bg-white/5 hover:text-blue-500">
                              <ExternalLink size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
