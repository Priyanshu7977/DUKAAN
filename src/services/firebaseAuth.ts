import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
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

let activeRecaptcha: RecaptchaVerifier | null = null;
let currentContainerId: string | null = null;
let containerCounter = 0;

export const clearRecaptcha = (_containerId?: string) => {
  if (typeof window === 'undefined') return;
  try {
    if (activeRecaptcha) {
      try {
        activeRecaptcha.clear();
      } catch {}
      activeRecaptcha = null;
    }
    if (currentContainerId) {
      const el = document.getElementById(currentContainerId);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
      currentContainerId = null;
    }
    const legacy = document.getElementById('recaptcha-container');
    if (legacy) {
      legacy.innerHTML = '';
    }
    const badges = document.querySelectorAll('.grecaptcha-badge');
    badges.forEach((b) => b.remove());
  } catch {}
};

export const setupRecaptcha = (_containerId?: string): RecaptchaVerifier | null => {
  if (!isFirebaseConfigured || typeof window === 'undefined') return null;
  try {
    clearRecaptcha();

    containerCounter += 1;
    const dynamicId = `recaptcha-container-${Date.now()}-${containerCounter}`;
    const dynamicDiv = document.createElement('div');
    dynamicDiv.id = dynamicId;
    dynamicDiv.setAttribute('aria-hidden', 'true');
    dynamicDiv.style.position = 'absolute';
    dynamicDiv.style.left = '-9999px';
    dynamicDiv.style.top = '-9999px';
    dynamicDiv.style.width = '1px';
    dynamicDiv.style.height = '1px';
    dynamicDiv.style.opacity = '0';
    dynamicDiv.style.pointerEvents = 'none';
    document.body.appendChild(dynamicDiv);

    currentContainerId = dynamicId;

    activeRecaptcha = new RecaptchaVerifier(auth, dynamicDiv, {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        clearRecaptcha();
      },
    });

    return activeRecaptcha;
  } catch {
    clearRecaptcha();
    return null;
  }
};

export const sendPhoneOtp = async (
  phoneNumber: string,
  verifier: RecaptchaVerifier
): Promise<{ success: boolean; confirmationResult?: ConfirmationResult; error?: string }> => {
  if (!isFirebaseConfigured) {
    return { success: false, error: 'Firebase is not yet configured with API credentials.' };
  }
  try {
    const confirmationResult = await Promise.race([
      signInWithPhoneNumber(auth, phoneNumber, verifier),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 30000)
      ),
    ]);
    return { success: true, confirmationResult };
  } catch (err: any) {
    clearRecaptcha();
    let message = 'Unable to send SMS verification code.';
    if (err.message === 'timeout') {
      message = 'SMS request timed out. Please check connection and try again.';
    } else if (err.code === 'auth/operation-not-allowed') {
      message = 'Phone provider is not enabled in Firebase Console.';
    } else if (err.code === 'auth/unauthorized-domain') {
      message = 'Domain not authorized. Please add dukaan-j5l5.vercel.app to Authorized Domains in Firebase Console.';
    } else if (err.code === 'auth/invalid-phone-number') {
      message = 'Invalid phone number. Please enter a valid Indian number (+91).';
    } else if (err.code === 'auth/quota-exceeded') {
      message = 'Daily SMS quota reached for this project. Please contact concierge or use Google login.';
    } else if (err.code === 'auth/captcha-check-failed') {
      message = 'Security verification failed. Please try again.';
    } else if (err.code === 'auth/too-many-requests') {
      message = 'Too many requests. Please wait a few moments before trying again.';
    } else if (err.message) {
      if (err.message.includes('reCAPTCHA has already been rendered')) {
        message = 'Security check refreshed. Please tap Get Verification Code again.';
      } else {
        message = err.message;
      }
    }
    return { success: false, error: message };
  }
};

export const confirmPhoneOtp = async (
  confirmationResult: ConfirmationResult,
  code: string,
  displayName?: string
): Promise<AuthResponse> => {
  try {
    const credential = await confirmationResult.confirm(code.trim());
    if (displayName && displayName.trim() && credential.user) {
      try {
        await updateProfile(credential.user, { displayName: displayName.trim() });
      } catch {}
    }
    return { success: true, user: credential.user };
  } catch (err: any) {
    let message = 'Incorrect verification code. Please check the SMS on your device.';
    if (err.code === 'auth/invalid-verification-code') {
      message = 'Invalid SMS code. Please re-check the 6-digit code received on your phone.';
    } else if (err.code === 'auth/code-expired') {
      message = 'This verification code has expired. Please request a new code.';
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

export type { ConfirmationResult };
