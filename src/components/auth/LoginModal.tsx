import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { X, Phone, Mail, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, isAuthenticated } = useAuthStore();
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('7977641125');
  const [fullName, setFullName] = useState('Priyanshu Singh');
  const [emailAddress, setEmailAddress] = useState('priyanshubipin2006@gmail.com');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['5', '8', '2', '1']);
  const [countdown, setCountdown] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  // 5-second automatic countdown for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpStep && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpStep, countdown]);

  if (!isLoginModalOpen || isAuthenticated) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpStep(true);
      setCountdown(30);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login({
        name: fullName || 'Priyanshu Singh',
        phone: '+91 ' + phoneNumber,
        email: emailAddress || 'priyanshubipin2006@gmail.com',
      });
    }, 600);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login({
        name: fullName || 'Priyanshu Singh',
        email: emailAddress,
        phone: '+91 ' + phoneNumber,
      });
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login({
        name: 'Priyanshu Singh',
        email: 'priyanshubipin2006@gmail.com',
        phone: '+91 7977641125',
      });
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={closeLoginModal}
    >
      <div
        className="relative w-full max-w-md bg-white border border-[#141414]/10 shadow-[0_25px_60px_rgba(0,0,0,0.25)] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close (Cut) Button - User can cut that and see whole website */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 z-20 p-2 text-[#73706B] hover:text-[#141414] hover:bg-[#F3EEEB] rounded-full transition-colors"
          aria-label="Close login dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Luxury Banner */}
        <div className="bg-[#FAF8F5] border-b border-[#141414]/8 p-6 text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#A7654A]/10 text-[#A7654A] rounded-full text-[10px] uppercase tracking-widest font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>DUKAAN Atelier Membership</span>
          </div>
          <h2 className="font-serif text-2xl text-[#141414] font-normal">
            Welcome to DUKAAN
          </h2>
          <p className="text-xs text-[#73706B] font-light max-w-xs mx-auto">
            Sign in to access your saved orders, tailored wishlist, and enjoy instant ₹500 discount on your first order.
          </p>
        </div>

        {/* Tab Toggle: Phone OTP vs Email */}
        <div className="flex border-b border-[#141414]/8 bg-[#FDFCFB]">
          <button
            type="button"
            onClick={() => {
              setAuthMode('phone');
              setOtpStep(false);
            }}
            className={`flex-1 py-3 text-[11px] uppercase tracking-wider font-medium text-center transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'phone'
                ? 'text-[#141414] border-b-2 border-[#141414] bg-white font-semibold'
                : 'text-[#73706B] hover:text-[#141414]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('email');
              setOtpStep(false);
            }}
            className={`flex-1 py-3 text-[11px] uppercase tracking-wider font-medium text-center transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'email'
                ? 'text-[#141414] border-b-2 border-[#141414] bg-white font-semibold'
                : 'text-[#73706B] hover:text-[#141414]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Login</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {authMode === 'phone' ? (
            !otpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#141414]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-lg focus:outline-none focus:border-[#141414] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#141414]">
                    Mobile Number (India)
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-[#141414]/15 focus-within:border-[#141414] bg-[#FAF8F5]">
                    <span className="px-3 py-2.5 text-xs text-[#73706B] bg-[#EAE5DF] font-mono border-r border-[#141414]/10 select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      required
                      className="flex-1 px-3 py-2.5 text-xs bg-transparent focus:outline-none font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-[#73706B]">
                    We will send a 4-digit verification code via SMS
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 10}
                  className="w-full py-3 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Sending Code...' : 'Get OTP Code'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center space-y-1 py-1">
                  <CheckCircle2 className="w-8 h-8 text-[#0F6B38] mx-auto" />
                  <p className="text-xs text-[#141414] font-medium">
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

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#141414] block text-center">
                    Enter 4-Digit Verification Code
                  </label>
                  <div className="flex items-center justify-center gap-3">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          const copy = [...otpCode];
                          copy[idx] = val;
                          setOtpCode(copy);
                        }}
                        className="w-12 h-12 text-center text-lg font-mono font-bold bg-[#FAF8F5] border border-[#141414]/20 rounded-lg focus:outline-none focus:border-[#141414]"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying...' : 'Verify & Sign In'}</span>
                </button>

                <div className="text-center">
                  {countdown > 0 ? (
                    <span className="text-[10px] text-[#73706B]">
                      Resend code in {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCountdown(30)}
                      className="text-[10px] text-[#141414] underline font-medium"
                    >
                      Resend OTP now
                    </button>
                  )}
                </div>
              </form>
            )
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#141414]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Priyanshu Singh"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-lg focus:outline-none focus:border-[#141414]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#141414]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="priyanshubipin2006@gmail.com"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-lg focus:outline-none focus:border-[#141414]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#141414]">
                  Password
                </label>
                <input
                  type="password"
                  defaultValue="dukaanPass@123"
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-lg focus:outline-none focus:border-[#141414]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In with Email'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Social One-Click Login */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#141414]/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-[#73706B] bg-white px-2">
              <span>Or sign in with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#EAE5DF] border border-[#141414]/15 rounded-lg text-xs font-medium text-[#141414] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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

        {/* Footer: Dismiss & Browse as Guest ("He can cut that an can see whole website") */}
        <div className="bg-[#FAF8F5] border-t border-[#141414]/8 px-6 py-3 text-center">
          <button
            type="button"
            onClick={closeLoginModal}
            className="text-[11px] text-[#73706B] hover:text-[#141414] font-medium underline"
          >
            Continue as Guest & Browse Website →
          </button>
        </div>
      </div>
    </div>
  );
};
