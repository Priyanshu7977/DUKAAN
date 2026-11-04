import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const GenderCollections: React.FC = () => {
  return (
    <section className="py-12 sm:py-24 lg:py-32 bg-[#F3F0E9] border-b border-[#211E1A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-[#E8E3D9] flex flex-col justify-end min-h-[420px] sm:min-h-[540px] lg:min-h-[660px] shadow-sm">
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE733-scaled.jpg?v=1740307050"
                alt="Dukaan Men's Tailoring"
                aspectRatioClass="w-full h-full"
                className="group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211E1A]/95 via-[#211E1A]/40 to-transparent" />
            </div>

            <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-[#F3F0E9] space-y-2.5 sm:space-y-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
                Wardrobe Edit
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#F3F0E9] leading-tight">
                Men's Silhouette
              </h3>
              <p className="text-xs sm:text-sm text-[#F3F0E9]/80 font-light max-w-md leading-relaxed">
                Relaxed corduroy trousers, unbleached Irish linen shirts, and unstructured overshirts tailored with understated rigor.
              </p>
              <div className="pt-1.5 sm:pt-2">
                <Link
                  to="/men"
                  className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#F3F0E9] hover:bg-[#A7654A] hover:text-[#F3F0E9] text-[#211E1A] text-[11px] sm:text-xs uppercase tracking-widest font-semibold transition-all group/btn shadow-md active:scale-95"
                >
                  <span>Explore Men</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-[#E8E3D9] flex flex-col justify-end min-h-[420px] sm:min-h-[540px] lg:min-h-[660px] shadow-sm">
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/Amethyst-DrapeShirt_1.jpg?v=1790957049"
                alt="Dukaan Women's Fluid Drape"
                aspectRatioClass="w-full h-full"
                className="group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211E1A]/95 via-[#211E1A]/40 to-transparent" />
            </div>

            <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-[#F3F0E9] space-y-2.5 sm:space-y-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
                Wardrobe Edit
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#F3F0E9] leading-tight">
                Women's Silhouette
              </h3>
              <p className="text-xs sm:text-sm text-[#F3F0E9]/80 font-light max-w-md leading-relaxed">
                Liquid drape shirts, expansive baggy pleated trousers, and cropped linen overshirts engineered for natural volume.
              </p>
              <div className="pt-1.5 sm:pt-2">
                <Link
                  to="/women"
                  className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#F3F0E9] hover:bg-[#A7654A] hover:text-[#F3F0E9] text-[#211E1A] text-[11px] sm:text-xs uppercase tracking-widest font-semibold transition-all group/btn shadow-md active:scale-95"
                >
                  <span>Explore Women</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
