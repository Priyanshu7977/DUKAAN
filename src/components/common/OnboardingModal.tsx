import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

const ONBOARDING_KEY = 'dukaan_onboarded_v1';

export const OnboardingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const showToast = useUIStore((state) => state.showToast);

  useEffect(() => {
    try {
      const onboarded = localStorage.getItem(ONBOARDING_KEY);
      if (!onboarded) {
        const timer = setTimeout(() => setIsOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
    }
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {
    }
    setIsOpen(false);
  };

  const copyCoupon = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('WELCOME500');
      showToast('Coupon "WELCOME500" copied to clipboard!', 'success');
    }
  };

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to DUKAAN',
      subtitle: 'Pure European Flax & 100% Breathable Cotton',
      description:
        'We craft quiet luxury garments engineered without synthetic polymers or polyester blends. Soft, breathable, and architecturally relaxed for everyday Indian summers.',
      badge: 'Atelier Foundations',
      icon: <Sparkles className="w-6 h-6 text-[#A7654A]" />,
    },
    {
      title: 'Relaxed Tailoring & Inclusive Fit',
      subtitle: 'Contemporary Unisex Geometry',
      description:
        'Our dropped-shoulder silhouettes and fluid pleats are calibrated for effortless drape across both men and women. If you desire a closer fit, select one size smaller.',
      badge: 'Universal Fit',
      icon: <ShieldCheck className="w-6 h-6 text-[#A7654A]" />,
    },
    {
      title: 'Your Atelier Welcome Gift',
      subtitle: 'Instant ₹500 Off Your First Wardrobe Piece',
      description:
        'Use exclusive promo code WELCOME500 at checkout on orders above ₹1,999. Includes nationwide express delivery and 7-day doorstep size exchange.',
      badge: 'Exclusive Privilege',
      icon: <Tag className="w-6 h-6 text-[#A7654A]" />,
      action: (
        <div className="pt-2">
          <div className="p-3 bg-[#FAF8F5] border border-dashed border-[#141414]/20 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#73706B] uppercase tracking-wider block">Your Welcome Code</span>
              <span className="font-serif text-base font-bold text-[#141414] tracking-wider">WELCOME500</span>
            </div>
            <button
              onClick={copyCoupon}
              className="h-9 px-4 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-wider font-semibold rounded-md transition-colors"
            >
              Copy Code
            </button>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#141414]/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF8F5] hover:bg-[#EAE5DF] flex items-center justify-center text-[#73706B] hover:text-[#141414] transition-colors"
          aria-label="Close onboarding"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-7 sm:p-9 space-y-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#A7654A]/10 text-[#A7654A] rounded-full text-[10px] uppercase tracking-widest font-semibold">
              {current.badge}
            </span>
            <div className="flex gap-1.5">
              {steps.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep ? 'w-5 bg-[#141414]' : 'bg-[#141414]/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#141414]">
              {current.title}
            </h2>
            <p className="text-xs text-[#A7654A] uppercase tracking-wider font-semibold">
              {current.subtitle}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
            {current.description}
          </p>

          {current.action}

          <div className="pt-3 border-t border-[#141414]/8 flex items-center justify-between gap-3">
            {currentStep > 0 ? (
              <button
                onClick={() => setCurrentStep((s) => s - 1)}
                className="h-11 px-4 text-xs font-semibold text-[#73706B] hover:text-[#141414] uppercase tracking-wider"
              >
                Back
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="h-11 px-4 text-xs font-semibold text-[#73706B] hover:text-[#141414] uppercase tracking-wider"
              >
                Skip Tour
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                className="h-11 px-6 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-wider font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="h-11 px-6 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-wider font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Explore Wardrobe</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
