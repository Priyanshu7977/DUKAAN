import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useCurrencyStore, CURRENCIES, CurrencyCode } from '../store/useCurrencyStore';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: unknown, overrideCode?: string): string {
  const num = typeof amount === 'number' && !isNaN(amount) && isFinite(amount) ? amount : (Number(amount) || 0);
  let activeCode = overrideCode;
  if (!activeCode) {
    try {
      activeCode = useCurrencyStore.getState().currentCurrency;
    } catch {
      activeCode = 'INR';
    }
  }

  const curr = CURRENCIES[(activeCode as CurrencyCode)] || CURRENCIES.INR;
  const converted = Math.round(num * curr.rate);

  return new Intl.NumberFormat(curr.locale, {
    style: 'currency',
    currency: curr.code,
    maximumFractionDigits: 0,
  }).format(converted);
}

export function formatDate(dateStr: unknown): string {
  try {
    if (!dateStr) return 'Recently';
    const d = new Date(String(dateStr));
    if (isNaN(d.getTime())) return String(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return String(dateStr || '');
  }
}
