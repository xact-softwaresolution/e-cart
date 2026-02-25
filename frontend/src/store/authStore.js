import { create } from "zustand";
import { authService } from "../api/authService";
import useCartStore from "./cartStore";

const AUTH_TOKEN_KEY = "ecart_access_token";

const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
const storeToken = (token) => {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
};
const clearStoredToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

const clearSessionState = () => {
  clearStoredToken();
  useCartStore.getState().clearCartCount();
};

const useAuthStore = create((set) => ({
  user: null,
  token: getStoredToken(),
  isLoading: true,
  isAuthenticated: false,

  setUser: (user, token) => {
    if (token) {
      storeToken(token);
    }

    set((state) => ({
      user,
      token: token || state.token,
      isAuthenticated: true,
      isLoading: false,
    }));
  },

  setToken: (token) => {
    if (token) {
      storeToken(token);
      set({ token });
      return;
    }

    clearStoredToken();
    set({ token: null });
  },

  clearAuth: () => {
    clearSessionState();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  refreshUser: async () => {
    try {
      const res = await authService.refresh();
      const payload = res?.data || res;
      const user = payload?.user || null;
      const token = payload?.accessToken || null;

      if (token) {
        storeToken(token);
      }

      set({
        user,
        token: token || getStoredToken(),
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch {
      clearSessionState();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }

    clearSessionState();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));

export default useAuthStore;
