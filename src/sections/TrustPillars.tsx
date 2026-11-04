import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  const pillars = [
    {
      icon: Truck,
      title: 'Free Delivery Across India',
      description: 'Enjoy free express shipping on all orders above ₹1,999 to 19,000+ PIN codes.',
    },
    {
      icon: ShieldCheck,
      title: 'Cash on Delivery Available',
      description: 'Pay easily at your doorstep or through UPI (GPay/PhonePe), NetBanking & Cards.',
    },
    {
      icon: RotateCcw,
      title: '7-Day Easy Returns & Exchanges',
      description: 'Simple doorstep pickup and size exchanges with zero hassle.',
    },
    {
      icon: Sparkles,
      title: '100% Pure Natural Fabrics',
      description: 'Crafted from breathable European linen and soft cotton gauze; zero polyester.',
    },
  ];

  return (
    <section className="py-7 sm:py-9 bg-white border-b border-[#141414]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex flex-col space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-[#141414]">
                  <Icon className="w-4 h-4 text-[#A7654A] shrink-0" />
                  <h4 className="font-serif text-xs sm:text-sm font-normal text-[#141414]">
                    {p.title}
                  </h4>
                </div>
                <p className="text-[11px] text-[#73706B] font-light leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
