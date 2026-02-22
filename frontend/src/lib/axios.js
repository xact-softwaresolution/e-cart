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
  withCredentials: true, // include cookies
});

// when server returns 401 attempt a refresh once then retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    // avoid infinite loop: don't attempt refresh if the failing request is the
    // refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/auth/refresh")
    ) {
      original._retry = true;
      try {
        const res = await api.get("/auth/refresh");
        // if refresh returns user, update store
        const user = res.data?.data?.user || res.data?.user;
        if (user) {
          useAuthStore.getState().setUser(user);
        }
        return api(original);
      } catch (refreshErr) {
        // refresh also failed – clear auth state (user will be logged out)
        useAuthStore.getState().clearAuth();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
