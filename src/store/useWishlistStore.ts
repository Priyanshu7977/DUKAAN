import { create } from 'zustand';
import { Product } from '../types';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleWishlist: (product: Product) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const STORAGE_KEY = 'forme_atelier_wishlist';

const loadSavedWishlist = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveWishlist = (items: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // ignore
  }
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: loadSavedWishlist(),

  addItem: (product: Product) => {
    const items = get().items;
    if (!items.some((i) => i.id === product.id)) {
      const updated = [...items, product];
      saveWishlist(updated);
      set({ items: updated });
    }
  },

  removeItem: (productId: string) => {
    const updated = get().items.filter((i) => i.id !== productId);
    saveWishlist(updated);
    set({ items: updated });
  },

  toggleWishlist: (product: Product) => {
    const inList = get().isInWishlist(product.id);
    if (inList) {
      get().removeItem(product.id);
      return false;
    } else {
      get().addItem(product);
      return true;
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some((i) => i.id === productId);
  },

  clearWishlist: () => {
    saveWishlist([]);
    set({ items: [] });
  },
}));
