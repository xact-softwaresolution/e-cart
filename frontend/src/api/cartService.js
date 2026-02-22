import api from '../lib/axios';

export const cartService = {
  getCart: async () => {
    const res = await api.get('/cart');
    return res.data;
  },

  addItem: async (productId, quantity = 1) => {
    const res = await api.post('/cart', { productId, quantity });
    return res.data;
  },

  updateItem: async (itemId, quantity) => {
    const res = await api.patch(`/cart/${itemId}`, { quantity });
    return res.data;
  },

  removeItem: async (itemId) => {
    const res = await api.delete(`/cart/${itemId}`);
    return res.data;
  },

  clearCart: async () => {
    const res = await api.delete('/cart');
    return res.data;
  },
};
