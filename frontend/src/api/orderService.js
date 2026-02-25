import api from "../lib/axios";

export const orderService = {
  create: async (addressId) => (await api.post("/orders", { addressId } )).data,

  getAll: async () => (await api.get("/orders" )).data,

  getById: async (orderId) => (await api.get(`/orders/${orderId}` )).data,

  getAllAdmin: async ({ page = 1, limit = 20, status = "" } = {}) => {
    const params = { page, limit };
    if (status) params.status = status;
    return (await api.get("/orders/admin/all", { params } )).data;
  },

  getAdminStatistics: async () => (await api.get("/orders/admin/statistics" )).data,

  updateStatus: async (orderId, status) =>
    (await api.patch(`/orders/${orderId}/status`, { status } )).data,
};
