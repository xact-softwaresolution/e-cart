import api from './api';

const productService = {
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/products/categories'); // Assuming this endpoint exists based on backend structure
    return response.data;
  },
};

export default productService;
