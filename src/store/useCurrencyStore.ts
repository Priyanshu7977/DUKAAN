import { create } from 'zustand';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  locale: string;
  name: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rate: 1.0, locale: 'en-IN', name: 'INR (₹)' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, locale: 'en-US', name: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, locale: 'de-DE', name: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0095, locale: 'en-GB', name: 'GBP (£)' },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044, locale: 'en-AE', name: 'AED (د.إ)' },
};

interface CurrencyState {
  currentCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => {
  let initial: CurrencyCode = 'INR';
  try {
    const saved = localStorage.getItem('dukaan_currency');
    if (saved && saved in CURRENCIES) {
      initial = saved as CurrencyCode;
    }
  } catch {}

  return {
    currentCurrency: initial,
    setCurrency: (code) => {
      try {
        localStorage.setItem('dukaan_currency', code);
      } catch {}
      set({ currentCurrency: code });
    },
  };
});
