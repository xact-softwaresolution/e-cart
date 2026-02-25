import api from "../lib/axios";

export const cartService = {
  getCart: async () => (await api.get("/cart" )).data,

  addItem: async (productId, quantity = 1) =>
    (await api.post("/cart", { productId, quantity } )).data,

  updateItem: async (itemId, quantity) =>
    (await api.patch(`/cart/${itemId}`, { quantity } )).data,

  removeItem: async (itemId) => (await api.delete(`/cart/${itemId}` )).data,

  clearCart: async () => (await api.delete("/cart" )).data,
};
