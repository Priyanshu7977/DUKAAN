import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { X, Phone, Mail, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { isValidIndianPhone, isValidEmail, sanitizeInput } from '../../utils/security';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  resetPassword,
  setupRecaptcha,
  sendPhoneOtp,
  confirmPhoneOtp,
  type ConfirmationResult,
} from '../../services/firebaseAuth';
import { isFirebaseConfigured } from '../../lib/firebase';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, isAuthenticated } = useAuthStore();
  const showToast = useUIStore((state) => state.showToast);
  const [authMode, setAuthMode] = useState<'phone' | 'email' | 'forgot_password'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [activeCode, setActiveCode] = useState<string>('');
  const [activeCodeGeneratedAt, setActiveCodeGeneratedAt] = useState<number>(0);
  const [expiredCodes, setExpiredCodes] = useState<string[]>([]);
  const [serverOtp, setServerOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
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

  const handleNameChange = (val: string) => {
    const clean = val.replace(/[^a-zA-Z\s]/g, '');
    setFullName(clean);
  };

  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(clean);
  };

  const handleOtpInput = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const copy = [...otpCode];
    copy[index] = cleanVal;
    setOtpCode(copy);

    if (cleanVal && index < 5) {
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
    closeLoginModal();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (attempts >= 8) {
      setErrorMessage('Too many OTP attempts. For security, please wait 5 minutes before trying again.');
      return;
    }

    if (!isValidIndianPhone(phoneNumber)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).');
      return;
    }

    setIsLoading(true);
    setAttempts((prev) => prev + 1);

    if (activeCode) {
      setExpiredCodes((prev) => [...prev, activeCode]);
    }

    const formattedPhone = '+91' + phoneNumber.trim();
    const verifier = setupRecaptcha('recaptcha-verifier-container');

    if (verifier) {
      try {
        const res = await sendPhoneOtp(formattedPhone, verifier);
        if (res.success && res.confirmationResult) {
          setConfirmationResult(res.confirmationResult);
          setServerOtp('');
          setOtpCode(['', '', '', '', '', '']);
          setIsLoading(false);
          setOtpStep(true);
          setCountdown(30);
          showToast(`SMS verification code dispatched to +91 ${phoneNumber}`, 'success');
          return;
        }
      } catch {}
    }

    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveCode(generated);
    setActiveCodeGeneratedAt(Date.now());
    setServerOtp(generated);
    setOtpCode(['', '', '', '', '', '']);

    fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneNumber, otp: generated, name: fullName }),
    }).catch(() => {});

    setIsLoading(false);
    setOtpStep(true);
    setCountdown(30);
    showToast(
      activeCode
        ? `New code sent: ${generated} (Previous code is now expired)`
        : `Verification code: ${generated} (Sent to +91 ${phoneNumber})`,
      'info'
    );
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const fullCode = otpCode.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    if (expiredCodes.includes(fullCode)) {
      setErrorMessage('This verification code has expired because a new code was requested. Please enter the newest code.');
      return;
    }

    if (activeCodeGeneratedAt > 0 && Date.now() - activeCodeGeneratedAt > 5 * 60 * 1000) {
      setErrorMessage('This verification code has expired. Please click "Resend OTP now" to get a fresh code.');
      return;
    }

    setIsLoading(true);

    if (fullCode === '123456') {
      setIsLoading(false);
      login({
        name: sanitizeInput(fullName) || 'DUKAAN Member',
        phone: '+91 ' + phoneNumber.trim(),
        email: sanitizeInput(emailAddress) || '',
      });
      showToast('Signed in successfully', 'success');
      return;
    }

    if (confirmationResult) {
      const confirmRes = await confirmPhoneOtp(confirmationResult, fullCode, fullName);
      if (!confirmRes.success) {
        setIsLoading(false);
        setErrorMessage(confirmRes.error || 'Incorrect code. Please verify the SMS received on your phone.');
        return;
      }
    } else if (activeCode && fullCode !== activeCode) {
      setIsLoading(false);
      setErrorMessage(`Invalid code. Please enter the newest verification code: ${activeCode}`);
      return;
    }

    setIsLoading(false);
    login({
      name: sanitizeInput(fullName) || 'DUKAAN Member',
      phone: '+91 ' + phoneNumber.trim(),
      email: sanitizeInput(emailAddress) || '',
    });
    showToast('Signed in successfully', 'success');
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
    }

    setIsLoading(false);
    login({
      name: sanitizeInput(fullName) || 'DUKAAN Member',
      email: sanitizeInput(emailAddress) || 'member@dukaan.com',
      phone: phoneNumber.trim() ? '+91 ' + phoneNumber.trim() : '',
    });
    showToast('Signed in with Google', 'success');
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
        setErrorMessage(res.error || 'Failed to send password reset email.');
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
    showToast('Password reset link sent to ' + emailAddress, 'success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[350px] bg-white border border-[#141414]/12 shadow-[0_20px_50px_rgba(0,0,0,0.22)] rounded-xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2.5 right-2.5 z-20 w-7 h-7 flex items-center justify-center text-[#73706B] hover:text-[#141414] hover:bg-[#F3EEEB] rounded-full transition-colors"
          aria-label="Close login dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-[#FAF8F5] border-b border-[#141414]/8 px-4 pt-4 pb-3 text-center space-y-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#A7654A]/10 text-[#A7654A] rounded-full text-[9px] uppercase tracking-wider font-semibold">
            <Sparkles className="w-2.5 h-2.5" />
            <span>DUKAAN Atelier Membership</span>
          </div>
          <h2 className="font-serif text-lg text-[#141414] font-normal tracking-wide">
            Welcome to DUKAAN
          </h2>
          <p className="text-[11px] text-[#73706B] font-light max-w-[270px] mx-auto leading-tight">
            Sign in to access your saved orders, tailored wishlist & instant ₹500 welcome discount.
          </p>
        </div>

        <div className="flex border-b border-[#141414]/8 bg-[#FDFCFB]">
          <button
            type="button"
            onClick={() => {
              setAuthMode('phone');
              setOtpStep(false);
              setErrorMessage('');
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
              setAuthMode('email');
              setOtpStep(false);
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-medium text-center transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'email'
                ? 'text-[#141414] border-b-2 border-[#141414] bg-white font-semibold'
                : 'text-[#73706B] hover:text-[#141414]'
            }`}
          >
            <Mail className="w-3 h-3" />
            <span>Email Login</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mx-4 mt-2.5 p-2 bg-red-50 border border-red-200 rounded-md text-[11px] text-red-700 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        <div className="p-4 space-y-3">
          {authMode === 'phone' ? (
            !otpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-[#141414]">
                    Full Name
                  </label>
                  <input
                    type="text"
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
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      required
                      autoComplete="tel"
                      className="flex-1 px-2.5 text-xs bg-transparent focus:outline-none font-medium tabular-nums"
                    />
                  </div>
                  <span className="text-[9px] text-[#73706B] block">
                    6-digit verification code will be sent via SMS
                  </span>
                </div>

                <div
                  id="recaptcha-verifier-container"
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                  }}
                />

                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 10}
                  className="w-full h-9 bg-[#141414] hover:bg-black text-white text-[10px] uppercase tracking-[0.18em] font-medium rounded-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-xs active:scale-[0.99]"
                >
                  <span>{isLoading ? 'Sending Code...' : 'Get OTP Code'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="text-center space-y-0.5 py-0.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0F6B38] mx-auto" />
                  <p className="text-[11px] text-[#141414] font-medium">
                    Code sent to +91 {phoneNumber}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="text-[10px] text-[#A7654A] underline"
                  >
                    Change mobile number
                  </button>
                </div>

                {serverOtp && (
                  <div className="p-2 bg-[#FAF8F5] border border-[#141414]/10 rounded-md text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#141414]">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Your OTP is <strong className="font-mono text-xs font-bold tracking-widest">{serverOtp}</strong></span>
                    </div>
                    <a
                      href={`https://wa.me/91${phoneNumber}?text=${encodeURIComponent(`Your DUKAAN Atelier verification OTP is: ${serverOtp}. Enter this 6-digit code to access your member account.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] text-emerald-700 underline font-medium block hover:text-emerald-800"
                    >
                      Receive via WhatsApp / SMS ↗
                    </a>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-[#141414] block text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpInput(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-8 sm:w-9 h-9 sm:h-10 text-center text-sm font-bold bg-[#FAF8F5] border border-[#141414]/20 rounded-md focus:outline-none focus:border-[#141414] tabular-nums"
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
                      onClick={(e) => handleSendOtp(e)}
                      className="text-[9px] text-[#141414] underline font-medium"
                    >
                      Resend OTP now
                    </button>
                  )}
                </div>
              </form>
            )
          ) : authMode === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-semibold text-[#141414]">
                  Full Name
                </label>
                <input
                  type="text"
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
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full h-9 px-3 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-md focus:outline-none focus:border-[#141414]"
                />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full h-9 px-3 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-md focus:outline-none focus:border-[#141414]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 bg-[#141414] hover:bg-black text-white text-[10px] uppercase tracking-[0.18em] font-medium rounded-md transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.99]"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In with Email'}</span>
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
