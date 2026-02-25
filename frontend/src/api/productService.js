import api from "../lib/axios";

export const productService = {
  getAll: async ({ page = 1, limit = 12, search = "", category = "" } = {}) => {
    const params = { page, limit };
    if (search) params.search = search;
    if (category) params.category = category;
    return (await api.get("/products", { params } )).data;
  },

  getById: async (id) => (await api.get(`/products/${id}` )).data,

  getCategories: async () => (await api.get("/products/categories" )).data,
};
