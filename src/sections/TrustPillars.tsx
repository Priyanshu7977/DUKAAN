import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  const pillars = [
    {
      icon: Truck,
      title: 'Free Delivery Across India',
      description: 'Free express shipping on all orders above ₹1,999 to 19,000+ PIN codes.',
    },
    {
      icon: ShieldCheck,
      title: 'Cash on Delivery Available',
      description: 'Pay easily at doorstep or via UPI (GPay/PhonePe), NetBanking & Cards.',
    },
    {
      icon: RotateCcw,
      title: '7-Day Easy Returns & Size Exchange',
      description: 'Complimentary doorstep size exchange and hassle-free pickup.',
    },
    {
      icon: Sparkles,
      title: '100% Pure Natural Fabrics',
      description: 'Breathable European flax linen and organic cotton gauze; zero polyester.',
    },
  ];

  return (
    <section className="py-6 sm:py-9 bg-white border-b border-[#141414]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3.5 sm:p-0 bg-[#FAF9F6] sm:bg-transparent rounded-xl sm:rounded-none border border-[#141414]/5 sm:border-none text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-white sm:bg-[#FAF9F6] border border-[#141414]/10 flex items-center justify-center shrink-0 text-[#A7654A] shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h4 className="font-serif text-xs sm:text-sm font-medium text-[#141414] leading-snug">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-[#73706B] font-light leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
