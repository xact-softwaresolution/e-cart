import axios from "axios";
import useAuthStore from "../store/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// when server returns 401 attempt a refresh once then retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original?._retry &&
      !original?.url?.includes("/auth/refresh")
    ) {
      original._retry = true;

      try {
        const res = await api.get("/auth/refresh");
        const payload = res.data?.data || res.data;
        const user = payload?.user;
        const token = payload?.accessToken;

        if (user) {
          useAuthStore.getState().setUser(user, token);
        }

        return api(original);
      } catch {
        useAuthStore.getState().clearAuth();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
