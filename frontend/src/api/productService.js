import api from '../lib/axios';

export const productService = {
  getAll: async ({ page = 1, limit = 12, search = '' } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    const res = await api.get(`/products?${params.toString()}`);
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get('/products/categories');
    return res.data;
  },
};
