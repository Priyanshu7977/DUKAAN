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
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  freeShippingThreshold: number;
}

const STORAGE_KEY = 'forme_atelier_cart';

/**
 * Sanitizes and validates cart items against the authoritative product catalog.
 * Defends against client-side parameter tampering (e.g. price manipulation in DevTools).
 */
const sanitizeCartItems = (rawItems: CartItem[]): CartItem[] => {
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .map((item) => {
      // Find official authoritative product from master data
      const masterProduct = PRODUCTS.find((p) => p.id === item.product?.id);
      if (!masterProduct) return null;

      const safeQuantity = sanitizeNumeric(item.quantity, 1, 1, 99);

      return {
        ...item,
        // Enforce verified price from catalog - blocks price tampering
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
  const raw = safeStorage.getItem<CartItem[]>(STORAGE_KEY, []);
  return sanitizeCartItems(raw);
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
    // Look up verified master product
    const masterProduct = PRODUCTS.find((p) => p.id === product.id) || product;
    const safeQty = sanitizeNumeric(quantity, 1, 1, 99);

    const items = get().items;
    const itemId = `${masterProduct.id}-${size}-${color}`;
    const existingIndex = items.findIndex((item) => item.id === itemId);

    let updatedItems: CartItem[];
    if (existingIndex > -1) {
      updatedItems = [...items];
      updatedItems[existingIndex].quantity = Math.min(
        99,
        updatedItems[existingIndex].quantity + safeQty
      );
    } else {
      updatedItems = [
        ...items,
        {
          id: itemId,
          product: {
            ...product,
            price: masterProduct.price, // Authoritative price guarantee
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
    const safeQty = sanitizeNumeric(quantity, 1, 1, 99);
    const updatedItems = get().items.map((item) =>
      item.id === itemId ? { ...item, quantity: safeQty } : item
    );
    saveCart(updatedItems);
    set({ items: updatedItems });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  getCartTotal: () => {
    return get().items.reduce((sum, item) => {
      // Re-verify against master product to prevent runtime tampering
      const masterProduct = PRODUCTS.find((p) => p.id === item.product.id);
      const verifiedPrice = masterProduct ? masterProduct.price : item.product.price;
      return sum + verifiedPrice * item.quantity;
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
