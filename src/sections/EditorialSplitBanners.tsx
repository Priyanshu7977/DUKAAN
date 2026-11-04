import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const EditorialSplitBanners: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 bg-[#FAF9F6] border-b border-[#141414]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Banner 1: The Vacation Edit */}
          <Link
            to="/collections/solstice-atelier"
            className="group relative overflow-hidden bg-[#ECE7DD] aspect-[4/3] sm:aspect-[16/10] flex items-end p-6 sm:p-8"
          >
            <img
              src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AWGauze1.jpg?v=1780592855"
              alt="The Vacation Edit"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="relative z-10 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#EAE7DF] font-semibold block">
                Summer Release
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                The Vacation Edit
              </h3>
              <p className="text-xs text-white/80 max-w-sm font-light">
                Airy double-gauze cotton shirts and relaxed co-ords made for balmy coastlines.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-white group-hover:text-[#FAF9F6]">
                <span>Discover Lookbook</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Banner 2: Architectural Linen */}
          <Link
            to="/shop?category=shirts"
            className="group relative overflow-hidden bg-[#ECE7DD] aspect-[4/3] sm:aspect-[16/10] flex items-end p-6 sm:p-8"
          >
            <img
              src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AlmondWhiteLinenCropped_1.jpg?v=1787463484"
              alt="Architectural Linen Luxe"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="relative z-10 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#EAE7DF] font-semibold block">
                Permanent Core
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                Architectural Linen Luxe
              </h3>
              <p className="text-xs text-white/80 max-w-sm font-light">
                Woven in raw Normandy flax with dropped shoulder geometries and fluid drape.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-white group-hover:text-[#FAF9F6]">
                <span>Shop Shirts</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
