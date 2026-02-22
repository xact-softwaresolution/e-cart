import api from "../lib/axios";

export const authService = {
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get("/auth/profile");
    return res.data;
  },

  refresh: async () => {
    const res = await api.get("/auth/refresh");
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },
};
