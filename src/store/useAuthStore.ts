import { create } from 'zustand';
import { UserProfile, UserAddress, UserOrder } from '../types';

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
}

const DEFAULT_ORDERS: UserOrder[] = [
  {
    id: 'DUK-88219',
    date: 'Oct 28, 2026',
    status: 'Delivered',
    total: 3890,
    paymentMethod: 'Prepaid Online',
    trackingNumber: 'DTDC-884910283',
    estimatedDelivery: 'Oct 31, 2026',
    items: [
      {
        id: 'item-1',
        name: 'Almond White Gauze Holiday Shirt',
        price: 3890,
        size: 'L',
        color: 'Natural Cream',
        image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AWGauze1.jpg?v=1780592855',
        quantity: 1,
      },
    ],
  },
  {
    id: 'DUK-77104',
    date: 'Nov 02, 2026',
    status: 'In Transit',
    total: 3589,
    paymentMethod: 'COD',
    trackingNumber: 'BLUEDART-7719284',
    estimatedDelivery: 'Tomorrow, Nov 05',
    items: [
      {
        id: 'item-2',
        name: 'Beige Baggy Fit Trousers',
        price: 3490,
        size: '32',
        color: 'Oatmeal Beige',
        image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/BeigeBaggyFitTrousers_1.jpg?v=1790961467',
        quantity: 1,
      },
    ],
  },
];

const DEFAULT_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Priyanshu Singh',
    phone: '+91 7977641125',
    street: 'Flat 402, Sea Green Heights, Bandra West',
    apartment: 'Near Carter Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    isDefault: true,
  },
];

const STORAGE_KEY = 'dukaan_auth_user';

const loadStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored user', e);
  }
  return null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: loadStoredUser(),
  isAuthenticated: Boolean(loadStoredUser()),
  isLoginModalOpen: false,
  hasAutoPrompted: false,

  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false, hasAutoPrompted: true }),

  login: (userData) => {
    const existing = get().user;
    const newUser: UserProfile = {
      id: existing?.id || 'usr-' + Date.now().toString(36),
      name: userData.name || 'Priyanshu Singh',
      email: userData.email || 'priyanshubipin2006@gmail.com',
      phone: userData.phone || '+91 7977641125',
      memberSince: existing?.memberSince || 'May 2025',
      tier: 'DUKAAN Atelier Member',
      walletBalance: 500,
      addresses: existing?.addresses?.length ? existing.addresses : DEFAULT_ADDRESSES,
      orders: existing?.orders?.length ? existing.orders : DEFAULT_ORDERS,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    set({
      user: newUser,
      isAuthenticated: true,
      isLoginModalOpen: false,
      hasAutoPrompted: true,
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      user: null,
      isAuthenticated: false,
      isLoginModalOpen: false,
    });
  },

  updateProfile: (data) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ user: updated });
  },

  addAddress: (addrData) => {
    const current = get().user;
    if (!current) return;
    const newAddress: UserAddress = {
      ...addrData,
      id: 'addr-' + Date.now().toString(36),
      isDefault: current.addresses.length === 0,
    };
    const updated = {
      ...current,
      addresses: [...current.addresses, newAddress],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ user: updated });
  },

  deleteAddress: (id) => {
    const current = get().user;
    if (!current) return;
    const updated = {
      ...current,
      addresses: current.addresses.filter((a) => a.id !== id),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ user: updated });
  },
}));
