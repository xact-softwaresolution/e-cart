import api from "../lib/axios";

export const authService = {
  login: async (data) => (await api.post("/auth/login", data )).data,

  register: async (data) => (await api.post("/auth/register", data )).data,

  getProfile: async () => (await api.get("/auth/profile" )).data,

  refresh: async () => (await api.get("/auth/refresh" )).data,

  logout: async () => (await api.post("/auth/logout" )).data,
};
