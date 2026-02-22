import api from '../lib/axios';

export const orderService = {
  create: async (addressId) => {
    const res = await api.post('/orders', { addressId });
    return res.data;
  },

  getAll: async () => {
    const res = await api.get('/orders');
    return res.data;
  },

  getById: async (orderId) => {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  },
};
