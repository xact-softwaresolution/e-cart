import api from '../lib/axios';

export const paymentService = {
  initiate: async (orderId) => {
    const res = await api.post('/payments/initiate', { orderId });
    return res.data;
  },

  verify: async (data) => {
    const res = await api.post('/payments/verify', data);
    return res.data;
  },

  getAll: async () => {
    const res = await api.get('/payments');
    return res.data;
  },

  getByOrder: async (orderId) => {
    const res = await api.get(`/payments/order/${orderId}`);
    return res.data;
  },

  getById: async (paymentId) => {
    const res = await api.get(`/payments/${paymentId}`);
    return res.data;
  },

  requestRefund: async (paymentId, amount, reason) => {
    const res = await api.post(`/payments/${paymentId}/refund`, { amount, reason });
    return res.data;
  },
};
