import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const EditorialCampaign: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-32 lg:py-40 bg-[#211E1A] text-[#F3F0E9] overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img
          src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE1118_1de102c2-2879-4d49-97d8-172066acae36.jpg?v=1763799127"
          alt="Monolithic Corduroy Shacket Silhouette"
          className="w-full h-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#211E1A] via-[#211E1A]/85 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 sm:gap-3">
            <span className="w-6 sm:w-8 h-[1px] bg-[#A7654A]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold text-[#A7654A]">
              Campaign Manifesto
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#F3F0E9] font-normal leading-[1.1]">
            The Quiet Power <br />
            <span className="italic">of</span> Proportion.
          </h2>

          <p className="text-xs sm:text-base text-[#F3F0E9]/80 font-light leading-relaxed">
            We reject the disposable cadence of fast-moving fashion. Dukaan approaches each silhouette as an architectural proposition: sculpted shoulder lines, balanced volumes, and organic plant fibres chosen to grow more noble with age.
          </p>

          <blockquote className="border-l-2 border-[#A7654A] pl-4 sm:pl-5 py-1.5 sm:py-2 font-serif text-lg sm:text-2xl text-[#F3F0E9] italic leading-snug">
            "A garment should never overpower the individual. It should frame their presence with quiet authority."
          </blockquote>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/about"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#F3F0E9] hover:bg-[#A7654A] hover:text-[#F3F0E9] text-[#211E1A] text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2.5 group shadow-md active:scale-95 text-center"
            >
              <span>Read The Atelier Manifesto</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/journal/conversations-on-unstructured-tailoring"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border border-white/25 hover:border-white text-[#F3F0E9] text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium transition-colors text-center flex items-center justify-center active:scale-95"
            >
              The Neapolitan Dialogue
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
