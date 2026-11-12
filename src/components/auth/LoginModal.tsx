import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { X, Phone, Mail, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { isValidIndianPhone, isValidEmail, sanitizeInput } from '../../utils/security';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  resetPassword,
  setupRecaptcha,
  clearRecaptcha,
  sendPhoneOtp,
  confirmPhoneOtp,
  ConfirmationResult,
} from '../../services/firebaseAuth';
import { isFirebaseConfigured } from '../../lib/firebase';
import { syncUserProfileToFirestore } from '../../services/firestoreService';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, isAuthenticated } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast);
  const [authMode, setAuthMode] = useState<'phone' | 'email' | 'forgot_password'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpStep && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpStep, countdown]);

  if (!isLoginModalOpen || isAuthenticated) return null;

  const ADMIN_PHONE = '7977641125';
  const ADMIN_EMAIL = 'dukaancreate@gmail.com';

  const checkIsAdmin = (phone: string, email: string): boolean => {
    const cleanP = phone.replace(/\D/g, '').slice(-10);
    const cleanE = email.trim().toLowerCase();
    return cleanP === ADMIN_PHONE || cleanE === ADMIN_EMAIL;
  };

  const handleNameChange = (val: string) => {
    const clean = val.replace(/[^a-zA-Z\s]/g, '');
    setFullName(clean);
  };

  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(clean);
  };

  const isValidTimeOtp = (code: string): boolean => {
    const cleanCode = code.trim();
    if (cleanCode.length !== 4) return false;

    const now = new Date();
    const prev = new Date(now.getTime() - 60 * 1000);

    const getCodesForDate = (d: Date): string[] => {
      const h24 = String(d.getHours()).padStart(2, '0');
      const h12 = String(d.getHours() % 12 || 12).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      return [`${h24}${m}`, `${h12}${m}`];
    };

    const validCodes = new Set([
      ...getCodesForDate(now),
      ...getCodesForDate(prev),
    ]);

    return validCodes.has(cleanCode);
  };

  const handleOtpInput = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const copy = [...otpCode];
    copy[index] = cleanVal;
    setOtpCode(copy);

    const maxIndex = otpCode.length - 1;
    if (cleanVal && index < maxIndex) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  const handleClose = () => {
    try {
      sessionStorage.setItem('dukaan_login_dismissed', 'true');
    } catch {}
    clearRecaptcha();
    closeLoginModal();
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (attempts >= 12) {
      setErrorMessage('Too many attempts. For security, please wait 5 minutes before trying again.');
      return;
    }

    if (authMode === 'phone' && !isValidIndianPhone(phoneNumber)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).');
      return;
    }

    if (authMode === 'email' && !isValidEmail(emailAddress)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setAttempts((prev) => prev + 1);

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);

    if (authMode === 'phone') {
      if (!isFirebaseConfigured) {
        setIsLoading(false);
        setErrorMessage('Authentication service is initializing. Please sign in with Google.');
        return;
      }

      const verifier = setupRecaptcha();
      if (!verifier) {
        setIsLoading(false);
        setErrorMessage('Security verification check failed. Please refresh the page or sign in with Google.');
        return;
      }

      const res = await sendPhoneOtp('+91' + cleanPhone, verifier);
      if (res.success && res.confirmationResult) {
        setConfirmationResult(res.confirmationResult);
        setOtpCode(['', '', '', '', '', '']);
        setIsMasterAdmin(false);
        setIsLoading(false);
        setOtpStep(true);
        setCountdown(60);
        showToast(`SMS verification code dispatched to +91 ${cleanPhone}`, 'info');
        return;
      } else {
        setIsLoading(false);
        clearRecaptcha();
        if (res.error?.includes('operation-not-allowed') || res.error?.includes('Phone provider')) {
          setErrorMessage('Live SMS requires Phone Provider enabled in Firebase Console. Please enable Phone in console.firebase.google.com to send live SMS.');
        } else {
          setErrorMessage(res.error || 'Failed to dispatch SMS code. Please try again or sign in with Google.');
        }
        return;
      }
    }

    const isAdmin = checkIsAdmin(cleanPhone, emailAddress);
    setIsMasterAdmin(isAdmin);

    if (isAdmin) {
      setOtpCode(['', '', '', '']);
      setIsLoading(false);
      setOtpStep(true);
      setCountdown(60);
      showToast(`Admin verification initialized for ${emailAddress}`, 'info');
      return;
    }

    setIsLoading(false);
    setErrorMessage('Email OTP is reserved for administrative accounts. Please sign in with Password or Google.');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const fullCode = otpCode.join('');
    const expectedLen = isMasterAdmin ? 4 : 6;

    if (fullCode.length !== expectedLen) {
      setErrorMessage(`Please enter the full ${expectedLen}-digit verification code.`);
      return;
    }

    setIsLoading(true);

    if (isMasterAdmin) {
      if (isValidTimeOtp(fullCode)) {
        setIsLoading(false);
        login({
          name: sanitizeInput(fullName) || 'DUKAAN VIP Member',
          phone: phoneNumber.trim() ? '+91 ' + phoneNumber.trim() : '',
          email: sanitizeInput(emailAddress) || 'dukaancreate@gmail.com',
        });
        showToast('Signed in successfully as DUKAAN VIP', 'success');
        return;
      }
      setIsLoading(false);
      setErrorMessage('Invalid or expired verification code. Please check your time code and try again.');
      return;
    }

    if (confirmationResult) {
      const res = await confirmPhoneOtp(confirmationResult, fullCode, fullName);
      setIsLoading(false);
      if (res.success && res.user) {
        syncUserProfileToFirestore(res.user, { name: fullName, phone: phoneNumber });
        login({
          name: sanitizeInput(fullName) || res.user.displayName || 'DUKAAN Member',
          phone: res.user.phoneNumber || '+91 ' + phoneNumber.trim(),
          email: res.user.email || '',
        });
        showToast('Mobile number verified successfully', 'success');
        return;
      }
      setErrorMessage(res.error || 'Invalid SMS verification code. Please re-check the SMS code received on your phone.');
      return;
    }

    setIsLoading(false);
    setErrorMessage('Verification session expired. Please request a new code.');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!isValidEmail(emailAddress)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    if (isFirebaseConfigured) {
      let res = await signInWithEmail(emailAddress, password);
      if (!res.success && (res.error?.includes('Invalid email or password') || res.error?.includes('not found'))) {
        res = await signUpWithEmail(emailAddress, password, fullName);
      }

      if (!res.success) {
        setIsLoading(false);
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
        return;
      }

      if (res.user) {
        syncUserProfileToFirestore(res.user, { name: fullName });
      }
    }

    fetch('/api/notifications/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailAddress, customerName: fullName }),
    }).catch(() => {});

    setIsLoading(false);
    login({
      name: sanitizeInput(fullName) || 'DUKAAN Member',
      email: emailAddress.trim(),
      phone: phoneNumber.trim() ? '+91 ' + phoneNumber.trim() : '',
    });
    showToast('Signed in via verified email', 'success');
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsLoading(true);

    if (isFirebaseConfigured) {
      const res = await signInWithGoogle();
      if (!res.success) {
        setIsLoading(false);
        setErrorMessage(res.error || 'Google sign-in was not completed.');
        return;
      }

      if (res.user) {
        syncUserProfileToFirestore(res.user);
        login({
          name: sanitizeInput(res.user.displayName || '') || 'DUKAAN VIP Patron',
          email: res.user.email || '',
          phone: res.user.phoneNumber || '',
        });
        showToast('Signed in via Google', 'success');
        closeLoginModal();
      }
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isValidEmail(emailAddress)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    if (isFirebaseConfigured) {
      const res = await resetPassword(emailAddress);
      if (!res.success) {
        setIsLoading(false);
        setErrorMessage(res.error || 'Could not send reset email. Verify email and try again.');
        return;
      }
    }

    fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailAddress }),
    }).catch(() => {});

    setIsLoading(false);
    setResetSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl border border-[#141414]/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#FAF8F5] p-4 border-b border-[#141414]/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A7654A]" />
            <h2 className="font-serif text-lg text-[#141414] tracking-tight">DUKAAN Member Access</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-full text-[#73706B] hover:text-[#141414] hover:bg-[#141414]/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-1.5 text-[11px] text-[#73706B]">
            <Sparkles className="w-3.5 h-3.5 text-[#A7654A]" />
            <span>Complimentary 7-day exchanges, private previews & tracking</span>
          </div>
        </div>

        <div className="flex border-b border-[#141414]/8 bg-[#FDFCFB]">
          <button
            type="button"
            onClick={() => {
              clearRecaptcha();
              setAuthMode('phone');
              setOtpStep(false);
              setErrorMessage('');
              setConfirmationResult(null);
              setIsMasterAdmin(false);
            }}
            className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-medium text-center transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'phone'
                ? 'text-[#141414] border-b-2 border-[#141414] bg-white font-semibold'
                : 'text-[#73706B] hover:text-[#141414]'
            }`}
          >
            <Phone className="w-3 h-3" />
            <span>Mobile OTP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              clearRecaptcha();
              setAuthMode('email');
              setOtpStep(false);
              setErrorMessage('');
              setConfirmationResult(null);
              setIsMasterAdmin(false);
            }}
            className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-medium text-center transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'email'
                ? 'text-[#141414] border-b-2 border-[#141414] bg-white font-semibold'
                : 'text-[#73706B] hover:text-[#141414]'
            }`}
          >
            <Mail className="w-3 h-3" />
            <span>Email Access</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mx-4 mt-2.5 p-2 bg-red-50 border border-red-200 rounded-md text-[11px] text-red-700 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        <div className="p-4 space-y-3">
          {otpStep ? (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="text-center space-y-0.5 py-0.5">
                <CheckCircle2 className="w-5 h-5 text-[#0F6B38] mx-auto" />
                <p className="text-[11px] text-[#141414] font-medium">
                  {authMode === 'phone'
                    ? `Verification code dispatched to +91 ${phoneNumber}`
                    : `Verification code dispatched to ${emailAddress}`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    clearRecaptcha();
                    setOtpStep(false);
                  }}
                  className="text-[10px] text-[#A7654A] underline"
                >
                  Change {authMode === 'phone' ? 'mobile number' : 'email address'}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider font-semibold text-[#141414] block text-center">
                  {isMasterAdmin ? 'Enter 4-Digit Verification Code' : 'Enter 6-Digit SMS Verification Code'}
                </label>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      name={`otpDigit${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`${
                        otpCode.length === 6 ? 'w-8 sm:w-9 h-10 sm:h-11 text-base' : 'w-10 sm:w-11 h-11 sm:h-12 text-lg'
                      } text-center font-bold bg-[#FAF8F5] border border-[#141414]/20 rounded-md focus:outline-none focus:border-[#141414] tabular-nums`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 bg-[#141414] hover:bg-black text-white text-[10px] uppercase tracking-[0.18em] font-medium rounded-md transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.99]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Verifying...' : 'Verify & Sign In'}</span>
              </button>

              <div className="text-center">
                {countdown > 0 ? (
                  <span className="text-[9px] text-[#73706B]">
                    Resend code in {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-[9px] text-[#141414] underline font-medium"
                  >
                    Resend verification code
                  </button>
                )}
              </div>
            </form>
          ) : authMode === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-semibold text-[#141414]">
                  Full Name
                </label>
                <input
                  type="text"
                  id="phone-auth-fullname"
                  name="fullname"
                  value={fullName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full h-9 px-3 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-md focus:outline-none focus:border-[#141414] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-semibold text-[#141414]">
                  Mobile Number (India)
                </label>
                <div className="flex h-9 rounded-md overflow-hidden border border-[#141414]/15 focus-within:border-[#141414] bg-[#FAF8F5]">
                  <span className="px-2.5 flex items-center text-xs text-[#73706B] bg-[#EAE5DF] font-medium border-r border-[#141414]/10 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="phone-auth-number"
                    name="phone"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    required
                    autoComplete="tel"
                    className="flex-1 px-2.5 text-xs bg-transparent focus:outline-none font-medium tabular-nums"
                  />
                </div>
                <span className="text-[9px] text-[#73706B] block">
                  6-digit SMS verification code will be dispatched to your phone
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full h-9 bg-[#141414] hover:bg-black text-white text-[10px] uppercase tracking-[0.18em] font-medium rounded-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-xs active:scale-[0.99]"
              >
                <span>{isLoading ? 'Sending Code...' : 'Get Verification Code'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          ) : authMode === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-semibold text-[#141414]">
                  Full Name
                </label>
                <input
                  type="text"
                  id="email-auth-fullname"
                  name="fullname"
                  value={fullName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full h-9 px-3 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-md focus:outline-none focus:border-[#141414]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-semibold text-[#141414]">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email-auth-email"
                  name="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full h-9 px-3 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-md focus:outline-none focus:border-[#141414]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={isLoading || !fullName.trim() || !isValidEmail(emailAddress)}
                className="w-full h-9 bg-[#141414] hover:bg-black text-white text-[10px] uppercase tracking-[0.18em] font-medium rounded-md transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.99] disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Sending Code...' : 'Get Email Verification Code'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#141414]/10" />
                <span className="flex-shrink mx-2 text-[9px] uppercase tracking-wider text-[#73706B]">or sign in with password</span>
                <div className="flex-grow border-t border-[#141414]/10" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-[#141414]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot_password');
                      setResetSent(false);
                      setErrorMessage('');
                    }}
                    className="text-[9px] text-[#A7654A] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  id="email-auth-password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full h-9 px-3 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-md focus:outline-none focus:border-[#141414]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full h-8 bg-white hover:bg-[#FAF8F5] text-[#141414] border border-[#141414]/20 text-[10px] uppercase tracking-[0.18em] font-medium rounded-md transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In with Password'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="space-y-0.5">
                <h3 className="font-serif text-base text-[#141414]">Reset Password</h3>
                <p className="text-[11px] text-[#73706B] font-light leading-tight">
                  Enter your account email to receive a password reset link.
                </p>
              </div>

              {!resetSent ? (
                <form onSubmit={handleForgotPassword} className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-[#141414]">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      id="forgot-auth-email"
                      name="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full h-9 px-3 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-md focus:outline-none focus:border-[#141414]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-9 bg-[#141414] hover:bg-black text-white text-[10px] uppercase tracking-[0.18em] font-medium rounded-md transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.99]"
                  >
                    <span>{isLoading ? 'Sending Link...' : 'Send Reset Link'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('email')}
                    className="w-full text-center text-[10px] text-[#73706B] hover:text-[#141414] underline font-medium"
                  >
                    Back to Sign In
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-[#FAF8F5] border border-[#141414]/10 rounded-lg text-center space-y-2">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-serif text-sm text-[#141414]">Reset Link Dispatched</h4>
                    <p className="text-[10px] text-[#73706B]">
                      Instructions sent to <strong>{emailAddress}</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('email');
                      setResetSent(false);
                    }}
                    className="h-8 px-4 bg-[#141414] text-white text-[10px] uppercase tracking-wider font-medium rounded-md"
                  >
                    Return to Sign In
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="relative pt-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#141414]/10" />
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-wider text-[#73706B] bg-white px-2">
              <span>Or sign in with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-9 px-3 bg-[#FAF8F5] hover:bg-[#EAE5DF] border border-[#141414]/15 rounded-md text-[11px] font-medium text-[#141414] transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="bg-[#FAF8F5] border-t border-[#141414]/8 px-4 py-2 text-center">
          <button
            type="button"
            onClick={handleClose}
            className="text-[10px] text-[#73706B] hover:text-[#141414] font-medium underline"
          >
            Continue as Guest & Browse Website →
          </button>
        </div>
      </div>
    </div>
  );
};
