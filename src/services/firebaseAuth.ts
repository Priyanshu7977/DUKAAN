import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';

export interface AuthResponse {
  success: boolean;
  user?: FirebaseUser | null;
  error?: string;
}

export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  if (!isFirebaseConfigured) {
    return { success: false, error: 'Firebase is not yet configured with API credentials.' };
  }
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return { success: true, user: credential.user };
  } catch (err: any) {
    let message = 'Unable to sign in. Please verify your credentials.';
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      message = 'Invalid email or password. Please check your credentials.';
    } else if (err.code === 'auth/wrong-password') {
      message = 'Incorrect password.';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Please enter a valid email address.';
    } else if (err.code === 'auth/too-many-requests') {
      message = 'Access temporarily disabled due to many failed attempts. Try again later.';
    }
    return { success: false, error: message };
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<AuthResponse> => {
  if (!isFirebaseConfigured) {
    return { success: false, error: 'Firebase is not yet configured with API credentials.' };
  }
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName.trim()) {
      await updateProfile(credential.user, { displayName: displayName.trim() });
    }
    return { success: true, user: credential.user };
  } catch (err: any) {
    let message = 'Unable to create account. Please try again.';
    if (err.code === 'auth/email-already-in-use') {
      message = 'This email is already registered. Please sign in instead.';
    } else if (err.code === 'auth/weak-password') {
      message = 'Password must be at least 6 characters.';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Please enter a valid email address.';
    }
    return { success: false, error: message };
  }
};

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  if (!isFirebaseConfigured) {
    return { success: false, error: 'Firebase is not yet configured with API credentials.' };
  }
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    return { success: true, user: credential.user };
  } catch (err: any) {
    let message = 'Google sign-in was cancelled or failed.';
    if (err.code === 'auth/popup-closed-by-user') {
      message = 'Google sign-in window was closed before completion.';
    } else if (err.code === 'auth/network-request-failed') {
      message = 'Network error during Google sign-in. Please check your connection.';
    }
    return { success: false, error: message };
  }
};

export const resetPassword = async (email: string): Promise<AuthResponse> => {
  if (!isFirebaseConfigured) {
    return { success: false, error: 'Firebase is not yet configured with API credentials.' };
  }
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true };
  } catch (err: any) {
    let message = 'Could not send password reset email.';
    if (err.code === 'auth/user-not-found') {
      message = 'No account located with this email address.';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Please enter a valid email address.';
    }
    return { success: false, error: message };
  }
};

export const logoutFirebase = async (): Promise<void> => {
  if (!isFirebaseConfigured) return;
  try {
    await signOut(auth);
  } catch {}
};

export const subscribeToRealtimeAuth = (
  callback: (user: FirebaseUser | null) => void
): (() => void) => {
  if (!isFirebaseConfigured) {
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
