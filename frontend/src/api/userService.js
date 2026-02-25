import api from "../lib/axios";

export const userService = {
  getMe: async () => (await api.get("/users/me" )).data,

  updateMe: async (data) => (await api.patch("/users/me", data )).data,

  getAddresses: async () => (await api.get("/users/addresses" )).data,

  addAddress: async (data) => (await api.post("/users/addresses", data )).data,
};
