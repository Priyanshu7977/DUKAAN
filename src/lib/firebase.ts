import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCAp0ClK39rmp7SzwlDldr-GFPq-KhvOs4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dukaan-luxury.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dukaan-luxury',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dukaan-luxury.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '274319602968',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:274319602968:web:0e71583d7f73720627da6d',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-3SBFWKVTHS',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export type { FirebaseUser };
