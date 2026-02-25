import api from "../lib/axios";

export const adminService = {
  // Dashboard
  getDashboardStats: async () => (await api.get("/admin/dashboard/stats" )).data,

  // Products
  getProducts: async ({ page = 1, limit = 20, search = "" } = {}) => {
    const params = { page, limit };
    if (search) params.search = search;
    return (await api.get("/admin/products", { params } )).data;
  },
  getProduct: async (id) => (await api.get(`/admin/products/${id}` )).data,
  createProduct: async (data) => (await api.post("/admin/products", data )).data,
  updateProduct: async (id, data) => (await api.patch(`/admin/products/${id}`, data )).data,
  deleteProduct: async (id) => (await api.delete(`/admin/products/${id}` )).data,

  // Categories
  getCategories: async () => (await api.get("/admin/categories" )).data,
  getCategoryById: async (id) => (await api.get(`/admin/categories/${id}` )).data,
  createCategory: async (data) => (await api.post("/admin/categories", data )).data,
  deleteCategory: async (id) => (await api.delete(`/admin/categories/${id}` )).data,

  // Inventory
  updateInventory: async (data) => (await api.patch("/admin/inventory", data )).data,
  getLowStock: async (threshold = 10) =>
    (await api.get("/admin/inventory/low-stock", { params: { threshold } } )).data,
  getInventoryReport: async () => (await api.get("/admin/inventory/report" )).data,

  // Orders
  getOrders: async ({ page = 1, limit = 20, status = "" } = {}) => {
    const params = { page, limit };
    if (status) params.status = status;
    return (await api.get("/admin/orders/dashboard", { params } )).data;
  },
  getOrderMetrics: async () => (await api.get("/admin/orders/metrics" )).data,
  updateOrderStatus: async (orderId, status) =>
    (await api.patch(`/orders/${orderId}/status`, { status } )).data,

  // Users
  getUsers: async ({ page = 1, limit = 20, role = "" } = {}) => {
    const params = { page, limit };
    if (role) params.role = role;
    return (await api.get("/admin/users", { params } )).data;
  },
  getUserMetrics: async () => (await api.get("/admin/users/metrics" )).data,
  getUser: async (id) => (await api.get(`/admin/users/${id}` )).data,
  updateUserRole: async (userId, role) =>
    (await api.patch(`/admin/users/${userId}/role`, { role } )).data,
  deleteUser: async (userId) => (await api.delete(`/admin/users/${userId}` )).data,
};
