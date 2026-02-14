import { create } from 'zustand';

const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setFeaturedProducts: (featuredProducts) => set({ featuredProducts }),
  setCategories: (categories) => set({ categories }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useProductStore;
