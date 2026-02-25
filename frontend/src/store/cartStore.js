import { create } from "zustand";

const CART_COUNT_KEY = "ecart_cart_count";

const readCartCount = () => {
  const raw = localStorage.getItem(CART_COUNT_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const writeCartCount = (count) => {
  localStorage.setItem(CART_COUNT_KEY, String(Math.max(0, Number(count) || 0)));
};

const clearCartCount = () => {
  localStorage.removeItem(CART_COUNT_KEY);
};

const useCartStore = create((set) => ({
  cartCount: readCartCount(),

  setCartCount: (count) => {
    const safeCount = Math.max(0, Number(count) || 0);
    writeCartCount(safeCount);
    set({ cartCount: safeCount });
  },

  incrementCart: () =>
    set((state) => {
      const next = state.cartCount + 1;
      writeCartCount(next);
      return { cartCount: next };
    }),

  decrementCart: () =>
    set((state) => {
      const next = Math.max(0, state.cartCount - 1);
      writeCartCount(next);
      return { cartCount: next };
    }),

  clearCartCount: () => {
    clearCartCount();
    set({ cartCount: 0 });
  },
}));

export default useCartStore;
