import { create } from 'zustand';
import { ProductSize } from '../types';
import { PRODUCTS } from '../data/products';
import {
  syncInventoryOverrideToFirestore,
  fetchAllInventoryOverridesFromFirestore,
} from '../services/firestoreService';

export interface SizeStock {
  inStock: boolean;
  quantityRemaining: number;
}

export interface ProductInventory {
  status: 'In Stock' | 'Low Batch' | 'Made to Order';
  sizes: Record<string, SizeStock>;
}

interface InventoryStoreState {
  overrides: Record<string, ProductInventory>;
  updateProductStatus: (productId: string, status: 'In Stock' | 'Low Batch' | 'Made to Order') => void;
  updateSizeStock: (productId: string, size: string, inStock: boolean, quantity?: number) => void;
  updateProductSizes: (productId: string, sizes: Record<string, SizeStock>) => void;
  getProductInventory: (productId: string, defaultSizes?: ProductSize[]) => ProductInventory;
  getEffectiveSizes: (productId: string, defaultSizes: ProductSize[]) => ProductSize[];
  isSizeAvailable: (productId: string, size: string) => boolean;
  getSizeQuantity: (productId: string, size: string) => number;
  syncWithFirestore: () => Promise<void>;
}

const STORAGE_KEY = 'dukaan_inventory_overrides';

const loadSavedOverrides = (): Record<string, ProductInventory> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveOverrides = (data: Record<string, ProductInventory>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

export const useInventoryStore = create<InventoryStoreState>((set, get) => ({
  overrides: loadSavedOverrides(),

  updateProductStatus: (productId, status) => {
    const current = get().overrides;
    const existing = current[productId] || {
      status: 'In Stock',
      sizes: {},
    };

    const updated: Record<string, ProductInventory> = {
      ...current,
      [productId]: {
        ...existing,
        status,
      },
    };

    saveOverrides(updated);
    set({ overrides: updated });
    syncInventoryOverrideToFirestore(productId, updated[productId]);
  },

  updateSizeStock: (productId, size, inStock, quantity) => {
    const current = get().overrides;
    const defaultProduct = PRODUCTS.find((p) => p.id === productId);
    const existing = current[productId] || {
      status: 'In Stock',
      sizes: {},
    };

    const currentQty =
      quantity !== undefined
        ? quantity
        : existing.sizes?.[size]?.quantityRemaining ??
          (defaultProduct?.sizes.find((s) => s.size === size)?.quantityRemaining ?? 10);

    const updatedSizes = {
      ...existing.sizes,
      [size]: {
        inStock: inStock && currentQty > 0,
        quantityRemaining: currentQty,
      },
    };

    const hasAnyInStock = Object.values(updatedSizes).some((s) => s.inStock);
    const totalRemaining = Object.values(updatedSizes).reduce(
      (sum, s) => sum + s.quantityRemaining,
      0
    );

    let calculatedStatus: 'In Stock' | 'Low Batch' | 'Made to Order' = existing.status;
    if (!hasAnyInStock) {
      calculatedStatus = 'Made to Order';
    } else if (totalRemaining <= 10) {
      calculatedStatus = 'Low Batch';
    } else if (existing.status === 'Made to Order' && hasAnyInStock) {
      calculatedStatus = 'In Stock';
    }

    const updated: Record<string, ProductInventory> = {
      ...current,
      [productId]: {
        ...existing,
        status: calculatedStatus,
        sizes: updatedSizes,
      },
    };

    saveOverrides(updated);
    set({ overrides: updated });
    syncInventoryOverrideToFirestore(productId, updated[productId]);
  },

  updateProductSizes: (productId, newSizes) => {
    const current = get().overrides;
    const existing = current[productId] || {
      status: 'In Stock',
      sizes: {},
    };

    const hasAnyInStock = Object.values(newSizes).some((s) => s.inStock);
    const totalRemaining = Object.values(newSizes).reduce(
      (sum, s) => sum + s.quantityRemaining,
      0
    );

    let calculatedStatus: 'In Stock' | 'Low Batch' | 'Made to Order' = existing.status;
    if (!hasAnyInStock) {
      calculatedStatus = 'Made to Order';
    } else if (totalRemaining <= 10) {
      calculatedStatus = 'Low Batch';
    } else if (existing.status === 'Made to Order' && hasAnyInStock) {
      calculatedStatus = 'In Stock';
    }

    const updated: Record<string, ProductInventory> = {
      ...current,
      [productId]: {
        ...existing,
        status: calculatedStatus,
        sizes: newSizes,
      },
    };

    saveOverrides(updated);
    set({ overrides: updated });
    syncInventoryOverrideToFirestore(productId, updated[productId]);
  },

  getProductInventory: (productId, defaultSizes) => {
    const override = get().overrides[productId];
    if (override && Object.keys(override.sizes || {}).length > 0) {
      return override;
    }

    const masterProduct = PRODUCTS.find((p) => p.id === productId);
    const sizesToUse = defaultSizes || masterProduct?.sizes || [];
    const sizesMap: Record<string, SizeStock> = {};

    sizesToUse.forEach((s) => {
      sizesMap[s.size] = {
        inStock: s.inStock,
        quantityRemaining: s.quantityRemaining ?? (s.inStock ? 10 : 0),
      };
    });

    return {
      status: override?.status || 'In Stock',
      sizes: sizesMap,
    };
  },

  getEffectiveSizes: (productId, defaultSizes) => {
    const inv = get().getProductInventory(productId, defaultSizes);
    return defaultSizes.map((s) => {
      const live = inv.sizes[s.size];
      if (!live) return s;
      return {
        ...s,
        inStock: live.inStock && live.quantityRemaining > 0,
        quantityRemaining: live.quantityRemaining,
      };
    });
  },

  isSizeAvailable: (productId, size) => {
    const inv = get().getProductInventory(productId);
    const live = inv.sizes[size];
    if (!live) return true;
    return live.inStock && live.quantityRemaining > 0;
  },

  getSizeQuantity: (productId, size) => {
    const inv = get().getProductInventory(productId);
    return inv.sizes[size]?.quantityRemaining ?? 10;
  },

  syncWithFirestore: async () => {
    try {
      const cloudOverrides = await fetchAllInventoryOverridesFromFirestore();
      if (cloudOverrides && Object.keys(cloudOverrides).length > 0) {
        const merged = { ...get().overrides, ...cloudOverrides };
        saveOverrides(merged);
        set({ overrides: merged });
      }
    } catch {}
  },
}));
