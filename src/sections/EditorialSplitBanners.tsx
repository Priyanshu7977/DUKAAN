import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const EditorialSplitBanners: React.FC = () => {
  return (
    <section className="py-8 sm:py-16 bg-[#FAF9F6] border-b border-[#141414]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          <Link
            to="/collections/solstice-atelier"
            className="group block bg-white border border-[#141414]/10 rounded-2xl overflow-hidden hover:border-[#141414]/30 transition-all duration-300 shadow-2xs hover:shadow-lg flex flex-col justify-between"
          >
            <div className="relative overflow-hidden aspect-[16/11] bg-[#ECE7DD]">
              <img
                src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AWGauze1.jpg?v=1780592855"
                alt="The Vacation Edit"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md text-[#141414] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#141414]/10 shadow-xs">
                Summer Release
              </span>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between flex-1 space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal text-[#141414] group-hover:text-[#A7654A] transition-colors leading-snug">
                  The Vacation Edit
                </h3>
                <p className="text-xs sm:text-sm text-[#73706B] font-light mt-1 sm:mt-1.5 leading-relaxed">
                  Airy double-gauze cotton shirts and relaxed co-ords tailored for effortless warmth and balmy coastlines.
                </p>
              </div>
              <div className="pt-1 flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] group-hover:text-[#A7654A] transition-colors">
                <span>Discover Lookbook</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            to="/shop?category=shirts"
            className="group block bg-white border border-[#141414]/10 rounded-2xl overflow-hidden hover:border-[#141414]/30 transition-all duration-300 shadow-2xs hover:shadow-lg flex flex-col justify-between"
          >
            <div className="relative overflow-hidden aspect-[16/11] bg-[#ECE7DD]">
              <img
                src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AlmondWhiteLinenCropped_1.jpg?v=1787463484"
                alt="Architectural Linen Luxe"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md text-[#141414] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#141414]/10 shadow-xs">
                Permanent Core
              </span>
            </div>
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between flex-1 space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal text-[#141414] group-hover:text-[#A7654A] transition-colors leading-snug">
                  Architectural Linen Luxe
                </h3>
                <p className="text-xs sm:text-sm text-[#73706B] font-light mt-1 sm:mt-1.5 leading-relaxed">
                  Woven in raw Normandy flax with dropped shoulder geometries and fluid, breathable drape.
                </p>
              </div>
              <div className="pt-1 flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] group-hover:text-[#A7654A] transition-colors">
                <span>Shop Shirts</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
