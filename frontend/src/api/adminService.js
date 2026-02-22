import api from '../lib/axios';

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
  },

  // Products
  getProducts: async () => {
    const res = await api.get('/admin/products');
    return res.data;
  },
  getProduct: async (id) => {
    const res = await api.get(`/admin/products/${id}`);
    return res.data;
  },
  createProduct: async (formData) => {
    const res = await api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  updateProduct: async (id, formData) => {
    const res = await api.patch(`/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  deleteProduct: async (id) => {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  },

  // Categories
  getCategories: async () => {
    const res = await api.get('/admin/categories');
    return res.data;
  },
  createCategory: async (data) => {
    const res = await api.post('/admin/categories', data);
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  },

  // Inventory
  updateInventory: async (data) => {
    const res = await api.patch('/admin/inventory', data);
    return res.data;
  },
  getLowStock: async () => {
    const res = await api.get('/admin/inventory/low-stock');
    return res.data;
  },
  getInventoryReport: async () => {
    const res = await api.get('/admin/inventory/report');
    return res.data;
  },

  // Orders
  getOrders: async () => {
    const res = await api.get('/admin/orders/dashboard');
    return res.data;
  },
  getOrderMetrics: async () => {
    const res = await api.get('/admin/orders/metrics');
    return res.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const res = await api.patch(`/orders/${orderId}/status`, { status });
    return res.data;
  },

  // Users
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  getUserMetrics: async () => {
    const res = await api.get('/admin/users/metrics');
    return res.data;
  },
  getUser: async (id) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
  },
  updateUserRole: async (userId, role) => {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    return res.data;
  },
  deleteUser: async (userId) => {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
  },

  // Payments
  getAllPayments: async () => {
    const res = await api.get('/payments/admin/all');
    return res.data;
  },
  getPaymentStats: async () => {
    const res = await api.get('/payments/admin/statistics');
    return res.data;
  },
};
