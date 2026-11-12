import { create } from 'zustand';
import { UserProfile, UserAddress, UserOrder } from '../types';
import { safeStorage, sanitizeInput } from '../utils/security';
import { logoutFirebase, subscribeToRealtimeAuth } from '../services/firebaseAuth';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  hasAutoPrompted: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (userData: { name: string; email: string; phone: string }) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (order: UserOrder) => void;
}

const DEFAULT_ORDERS: UserOrder[] = [];

const DEFAULT_ADDRESSES: UserAddress[] = [];

const STORAGE_KEY = 'dukaan_auth_user';

const loadStoredUser = (): UserProfile | null => {
  const user = safeStorage.getItem<UserProfile | null>(STORAGE_KEY, null);
  if (!user) return null;
  const filteredAddresses = (user.addresses || []).filter((a) => !a.street?.includes('Sea Green Heights'));
  const filteredOrders = (user.orders || []).filter((o) => o.id !== 'DUK-88219' && o.id !== 'DUK-77104');
  return {
    ...user,
    addresses: filteredAddresses,
    orders: filteredOrders,
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: loadStoredUser(),
  isAuthenticated: Boolean(loadStoredUser()),
  isLoginModalOpen: false,
  hasAutoPrompted: false,

  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => {
    try {
      sessionStorage.setItem('dukaan_login_dismissed', 'true');
    } catch {}
    set({ isLoginModalOpen: false, hasAutoPrompted: true });
  },

  login: (userData) => {
    const existing = get().user;
    const cleanName = sanitizeInput(userData.name) || 'DUKAAN Member';
    const cleanEmail = sanitizeInput(userData.email) || '';
    const cleanPhone = sanitizeInput(userData.phone) || '';

    const newUser: UserProfile = {
      id: existing?.id || 'usr-' + Date.now().toString(36),
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      memberSince: existing?.memberSince || 'May 2025',
      tier: 'DUKAAN VIP Member',
      walletBalance: 500,
      addresses: existing?.addresses?.length ? existing.addresses : DEFAULT_ADDRESSES,
      orders: existing?.orders?.length ? existing.orders : DEFAULT_ORDERS,
    };

    safeStorage.setItem(STORAGE_KEY, newUser);
    set({
      user: newUser,
      isAuthenticated: true,
      isLoginModalOpen: false,
      hasAutoPrompted: true,
    });
  },

  logout: () => {
    logoutFirebase().catch(() => {});
    safeStorage.removeItem(STORAGE_KEY);
    set({
      user: null,
      isAuthenticated: false,
      isLoginModalOpen: false,
    });
  },

  updateProfile: (data) => {
    const current = get().user;
    if (!current) return;
    const sanitizedData: Partial<UserProfile> = {};
    if (data.name) sanitizedData.name = sanitizeInput(data.name);
    if (data.email) sanitizedData.email = sanitizeInput(data.email);
    if (data.phone) sanitizedData.phone = sanitizeInput(data.phone);

    const updated = { ...current, ...data, ...sanitizedData };
    safeStorage.setItem(STORAGE_KEY, updated);
    set({ user: updated });
  },

  addAddress: (addrData) => {
    const current = get().user;
    if (!current) return;
    const newAddress: UserAddress = {
      fullName: sanitizeInput(addrData.fullName),
      phone: sanitizeInput(addrData.phone),
      street: sanitizeInput(addrData.street),
      apartment: addrData.apartment ? sanitizeInput(addrData.apartment) : '',
      city: sanitizeInput(addrData.city),
      state: sanitizeInput(addrData.state),
      pincode: sanitizeInput(addrData.pincode),
      id: 'addr-' + Date.now().toString(36),
      isDefault: current.addresses.length === 0,
    };
    const updated = {
      ...current,
      addresses: [...current.addresses, newAddress],
    };
    safeStorage.setItem(STORAGE_KEY, updated);
    set({ user: updated });
  },

  deleteAddress: (id) => {
    const current = get().user;
    if (!current) return;
    const updated = {
      ...current,
      addresses: current.addresses.filter((a) => a.id !== id),
    };
    safeStorage.setItem(STORAGE_KEY, updated);
    set({ user: updated });
  },

  setDefaultAddress: (id) => {
    const current = get().user;
    if (!current) return;
    const updated = {
      ...current,
      addresses: current.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    };
    safeStorage.setItem(STORAGE_KEY, updated);
    set({ user: updated });
  },

  addOrder: (newOrder) => {
    const current = get().user;
    if (current) {
      const updatedUser: UserProfile = {
        ...current,
        orders: [newOrder, ...current.orders.filter((o) => o.id !== newOrder.id)],
      };
      safeStorage.setItem(STORAGE_KEY, updatedUser);
      set({ user: updatedUser });
    }
    
    try {
      const stored = localStorage.getItem('dukaan_guest_orders');
      let existing: UserOrder[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(existing)) existing = [];
      const updated = [newOrder, ...existing.filter((o) => o.id !== newOrder.id)];
      localStorage.setItem('dukaan_guest_orders', JSON.stringify(updated));
    } catch {}
  },
}));

let hasInitializedFirebase = false;

export const initAuthRealtimeListener = () => {
  if (hasInitializedFirebase) return () => {};
  hasInitializedFirebase = true;
  return subscribeToRealtimeAuth((firebaseUser) => {
    if (firebaseUser) {
      const state = useAuthStore.getState();
      const existing = state.user;
      const cleanName = firebaseUser.displayName || existing?.name || 'DUKAAN Member';
      const cleanEmail = firebaseUser.email || existing?.email || '';
      const cleanPhone = firebaseUser.phoneNumber || existing?.phone || '';

      const updatedUser: UserProfile = {
        id: firebaseUser.uid || existing?.id || 'usr-' + Date.now().toString(36),
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        memberSince: existing?.memberSince || 'May 2025',
        tier: 'DUKAAN VIP Member',
        walletBalance: existing?.walletBalance || 500,
        addresses: existing?.addresses?.length ? existing.addresses : DEFAULT_ADDRESSES,
        orders: existing?.orders?.length ? existing.orders : DEFAULT_ORDERS,
      };

      safeStorage.setItem(STORAGE_KEY, updatedUser);
      useAuthStore.setState({
        user: updatedUser,
        isAuthenticated: true,
        isLoginModalOpen: false,
      });
    }
  });
};
