import api from "../lib/axios";

export const paymentService = {
  initiate: async (orderId) => (await api.post("/payments/initiate", { orderId } )).data,

  verify: async (payload) => (await api.post("/payments/verify", payload )).data,

  getAll: async ({ page = 1, limit = 10 } = {}) =>
    (await api.get("/payments", { params: { page, limit } } )).data,

  getByOrder: async (orderId) => (await api.get(`/payments/order/${orderId}` )).data,

  getById: async (paymentId) => (await api.get(`/payments/${paymentId}` )).data,

  requestRefund: async (paymentId, amount, reason) =>
    (await api.post(`/payments/${paymentId}/refund`, { amount, reason } )).data,

  getAllAdmin: async ({ page = 1, limit = 20, status = "" } = {}) => {
    const params = { page, limit };
    if (status) params.status = status;
    return (await api.get("/payments/admin/all", { params } )).data;
  },

  getAdminStatistics: async () => (await api.get("/payments/admin/statistics" )).data,
};
