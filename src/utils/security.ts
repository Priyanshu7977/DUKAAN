/**
 * Security & Defense Utilities for DUKAAN E-Commerce Platform
 * Protects against XSS, Parameter Tampering, Injection, and Corrupted Storage.
 */

// HTML entity escaping for XSS prevention
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Plain text sanitizer for form inputs (strips HTML tags and controls)
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/[<>'";\\]/g, '') // Strip script/injection control characters
    .trim();
}

// Validates 10-digit Indian Mobile Numbers (TRAI standard: starts with 6, 7, 8, or 9)
export function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

// Validates 6-digit Indian Postal PIN codes
export function isValidPincode(pin: string): boolean {
  const cleaned = pin.replace(/\D/g, '');
  return /^\d{6}$/.test(cleaned);
}

// Validates standard email structure
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

// Validates and bounds numerical values against tampering (e.g., negative prices or NaN)
export function sanitizeNumeric(value: unknown, fallback = 0, min = 0, max = Infinity): number {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return fallback;
  return Math.min(Math.max(num, min), max);
}

// Safe localStorage wrapper with try/catch and error isolation
export const safeStorage = {
  getItem<T>(key: string, fallback: T): T {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return fallback;
      const item = window.localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`[Security] Corrupted or blocked localStorage read for key: ${key}`);
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[Security] Failed localStorage write for key: ${key}`);
      return false;
    }
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  },
};
