import { create } from 'zustand';
import { Product, CartItem } from '../types';
import { PRODUCTS } from '../data/products';
import { safeStorage, sanitizeNumeric } from '../utils/security';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemSize: (itemId: string, newSize: string) => boolean;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  freeShippingThreshold: number;
}

const STORAGE_KEY = 'dukaan_cart';
const LEGACY_STORAGE_KEY = 'forme_legacy_cart';
export const MAX_ITEM_QUANTITY = 5;

const sanitizeCartItems = (rawItems: CartItem[]): CartItem[] => {
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .map((item) => {
      const masterProduct = PRODUCTS.find((p) => p.id === item.product?.id);
      if (!masterProduct) return null;

      const safeQuantity = sanitizeNumeric(item.quantity, 1, 1, MAX_ITEM_QUANTITY);

      return {
        ...item,
        product: {
          ...item.product,
          price: masterProduct.price,
          name: masterProduct.name,
        },
        quantity: safeQuantity,
      };
    })
    .filter((item): item is CartItem => item !== null);
};

const loadSavedCart = (): CartItem[] => {
  const current = safeStorage.getItem<CartItem[]>(STORAGE_KEY, []);
  if (current && current.length > 0) {
    return sanitizeCartItems(current);
  }
  const legacy = safeStorage.getItem<CartItem[]>(LEGACY_STORAGE_KEY, []);
  if (legacy && legacy.length > 0) {
    const sanitized = sanitizeCartItems(legacy);
    safeStorage.setItem(STORAGE_KEY, sanitized);
    try { localStorage.removeItem(LEGACY_STORAGE_KEY); } catch {}
    return sanitized;
  }
  return [];
};

const saveCart = (items: CartItem[]) => {
  safeStorage.setItem(STORAGE_KEY, items);
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: loadSavedCart(),
  isOpen: false,
  freeShippingThreshold: 1999,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (product: Product, size: string, color: string, quantity = 1) => {
    const masterProduct = PRODUCTS.find((p) => p.id === product.id) || product;
    const safeQty = sanitizeNumeric(quantity, 1, 1, MAX_ITEM_QUANTITY);

    const items = get().items;
    const itemId = `${masterProduct.id}-${size}-${color}`;
    const existingIndex = items.findIndex((item) => item.id === itemId);

    let updatedItems: CartItem[];
    if (existingIndex > -1) {
      updatedItems = [...items];
      updatedItems[existingIndex].quantity = Math.min(
        MAX_ITEM_QUANTITY,
        updatedItems[existingIndex].quantity + safeQty
      );
    } else {
      updatedItems = [
        ...items,
        {
          id: itemId,
          product: {
            ...product,
            price: masterProduct.price,
          },
          selectedColor: color,
          selectedSize: size,
          quantity: safeQty,
        },
      ];
    }

    saveCart(updatedItems);
    set({ items: updatedItems, isOpen: true });
  },

  removeItem: (itemId: string) => {
    const updatedItems = get().items.filter((item) => item.id !== itemId);
    saveCart(updatedItems);
    set({ items: updatedItems });
  },

  updateQuantity: (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    const safeQty = sanitizeNumeric(quantity, 1, 1, MAX_ITEM_QUANTITY);
    const updatedItems = get().items.map((item) =>
      item.id === itemId ? { ...item, quantity: safeQty } : item
    );
    saveCart(updatedItems);
    set({ items: updatedItems });
  },

  updateItemSize: (itemId: string, newSize: string) => {
    const items = get().items;
    const targetItem = items.find((i) => i.id === itemId);
    if (!targetItem || targetItem.selectedSize === newSize) return false;

    const newId = `${targetItem.product.id}-${newSize}-${targetItem.selectedColor}`;
    const existingTargetIndex = items.findIndex((i) => i.id === newId && i.id !== itemId);

    let updatedItems: CartItem[];
    if (existingTargetIndex > -1) {
      updatedItems = items
        .filter((i) => i.id !== itemId)
        .map((i) =>
          i.id === newId
            ? { ...i, quantity: Math.min(MAX_ITEM_QUANTITY, i.quantity + targetItem.quantity) }
            : i
        );
    } else {
      updatedItems = items.map((i) =>
        i.id === itemId
          ? { ...i, id: newId, selectedSize: newSize }
          : i
      );
    }

    saveCart(updatedItems);
    set({ items: updatedItems });
    return true;
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  getCartTotal: () => {
    return get().items.reduce((sum, item) => {
      const masterProduct = PRODUCTS.find((p) => p.id === item.product.id);
      const verifiedPrice = masterProduct ? masterProduct.price : item.product.price;
      return sum + verifiedPrice * item.quantity;
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
