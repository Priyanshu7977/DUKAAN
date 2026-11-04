import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const GenderCollections: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-[#F3F0E9] border-b border-[#211E1A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Men's Collection Block */}
          <div className="relative group overflow-hidden rounded-3xl bg-[#E8E3D9] flex flex-col justify-end min-h-[560px] sm:min-h-[640px] lg:min-h-[720px]">
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE733-scaled.jpg?v=1740307050"
                alt="Dukaan Men's Tailoring"
                aspectRatioClass="w-full h-full"
                className="group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211E1A]/95 via-[#211E1A]/35 to-transparent" />
            </div>

            <div className="relative z-10 p-8 sm:p-12 text-[#F3F0E9] space-y-4">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
                Wardrobe Edit
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F3F0E9]">
                Men's Silhouette
              </h3>
              <p className="text-xs sm:text-sm text-[#F3F0E9]/80 font-light max-w-md leading-relaxed">
                Relaxed corduroy trousers, unbleached Irish linen shirts, and unstructured overshirts tailored with understated rigor.
              </p>
              <div className="pt-2">
                <Link
                  to="/men"
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#F3F0E9] hover:bg-[#A7654A] hover:text-[#F3F0E9] text-[#211E1A] text-xs uppercase tracking-widest font-semibold transition-all group/btn shadow-md"
                >
                  <span>Explore Men</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Women's Collection Block */}
          <div className="relative group overflow-hidden rounded-3xl bg-[#E8E3D9] flex flex-col justify-end min-h-[560px] sm:min-h-[640px] lg:min-h-[720px]">
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/Amethyst-DrapeShirt_1.jpg?v=1790957049"
                alt="Dukaan Women's Fluid Drape"
                aspectRatioClass="w-full h-full"
                className="group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211E1A]/95 via-[#211E1A]/35 to-transparent" />
            </div>

            <div className="relative z-10 p-8 sm:p-12 text-[#F3F0E9] space-y-4">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
                Wardrobe Edit
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F3F0E9]">
                Women's Silhouette
              </h3>
              <p className="text-xs sm:text-sm text-[#F3F0E9]/80 font-light max-w-md leading-relaxed">
                Liquid drape shirts, expansive baggy pleated trousers, and cropped linen overshirts engineered for natural volume.
              </p>
              <div className="pt-2">
                <Link
                  to="/women"
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#F3F0E9] hover:bg-[#A7654A] hover:text-[#F3F0E9] text-[#211E1A] text-xs uppercase tracking-widest font-semibold transition-all group/btn shadow-md"
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
