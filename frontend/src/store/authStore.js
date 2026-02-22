import { create } from "zustand";
import { authService } from "../api/authService";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

  clearAuth: () =>
    set({ user: null, isAuthenticated: false, isLoading: false }),

  // try to refresh tokens / fetch profile on app load
  refreshUser: async () => {
    try {
      const res = await authService.refresh();
      const user = res.data?.user || res.data;
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));

export default useAuthStore;
