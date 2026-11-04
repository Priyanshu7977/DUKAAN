import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const EditorialCampaign: React.FC = () => {
  return (
    <section className="relative py-28 sm:py-36 lg:py-44 bg-[#211E1A] text-[#F3F0E9] overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 opacity-30">
        <img
          src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE1118_1de102c2-2879-4d49-97d8-172066acae36.jpg?v=1763799127"
          alt="Monolithic Corduroy Shacket Silhouette"
          className="w-full h-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#211E1A] via-[#211E1A]/85 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="max-w-2xl space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#A7654A]" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#A7654A]">
              Campaign Manifesto
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-[#F3F0E9] font-normal leading-[1.05]">
            The Quiet Power <br />
            <span className="italic">of</span> Proportion.
          </h2>

          <p className="text-sm sm:text-base text-[#F3F0E9]/80 font-light leading-relaxed">
            We reject the disposable cadence of fast-moving fashion. Dukaan approaches each silhouette as an architectural proposition: sculpted shoulder lines, balanced volumes, and organic plant fibres chosen to grow more noble with age.
          </p>

          <blockquote className="border-l-2 border-[#A7654A] pl-5 py-2 font-serif text-xl sm:text-2xl text-[#F3F0E9] italic">
            "A garment should never overpower the individual. It should frame their presence with quiet authority."
          </blockquote>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/about"
              className="px-8 py-4 rounded-full bg-[#F3F0E9] hover:bg-[#A7654A] hover:text-[#F3F0E9] text-[#211E1A] text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center gap-3 group shadow-md"
            >
              <span>Read The Atelier Manifesto</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/journal/conversations-on-unstructured-tailoring"
              className="px-8 py-4 rounded-full border border-white/25 hover:border-white text-[#F3F0E9] text-xs uppercase tracking-[0.2em] font-medium transition-colors"
            >
              The Neapolitan Dialogue
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
