import { create } from 'zustand';
import { Product } from '../types';
import { safeStorage } from '../utils/security';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleWishlist: (product: Product) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const STORAGE_KEY = 'dukaan_wishlist';
const LEGACY_STORAGE_KEY = 'forme_atelier_wishlist';

const loadSavedWishlist = (): Product[] => {
  try {
    const raw = safeStorage.getItem<Product[]>(STORAGE_KEY, []);
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.filter((p) => p && typeof p.id === 'string');
    }
    const legacy = safeStorage.getItem<Product[]>(LEGACY_STORAGE_KEY, []);
    if (Array.isArray(legacy) && legacy.length > 0) {
      const valid = legacy.filter((p) => p && typeof p.id === 'string');
      safeStorage.setItem(STORAGE_KEY, valid);
      safeStorage.removeItem(LEGACY_STORAGE_KEY);
      return valid;
    }
    return [];
  } catch {
    return [];
  }
};

const saveWishlist = (items: Product[]) => {
  safeStorage.setItem(STORAGE_KEY, items);
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
