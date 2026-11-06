import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const NewCollection: React.FC = () => {
  return (
    <section className="py-8 sm:py-16 bg-[#FAF9F6] border-b border-[#141414]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-1">
              Recent Work • Edition 04
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#211E1A] leading-tight">
              Solstice: The Architecture <br className="hidden sm:inline" />
              <span className="italic font-normal">of</span> Natural Light
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#777765] max-w-sm font-light leading-relaxed">
            Summer pieces engineered from unbleached Normandy flax, double-crinkle cotton gauze, and fluid pull-on trousers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="relative group overflow-hidden rounded-2xl bg-[#E8E3D9] max-h-[520px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80"
                alt="Solstice Collection Gauze Holiday Shirt"
                aspectRatioClass="aspect-[4/5] max-h-[520px]"
                className="group-hover:scale-102 transition-transform duration-700 ease-out object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 p-3 sm:p-4 bg-[#211E1A]/85 backdrop-blur-md rounded-xl text-[#F3F0E9] flex items-center justify-between text-xs gap-2">
                <div className="min-w-0 flex-1 pr-1">
                  <p className="font-serif text-xs sm:text-base truncate">Plate IV: The Gauze Holiday Shirt</p>
                  <p className="text-[#A7654A] text-[9px] sm:text-[10px] uppercase tracking-wider truncate">Mediterranean Sun Campaign</p>
                </div>
                <Link
                  to="/product/almond-white-gauze-holiday-shirt"
                  className="px-3 sm:px-3.5 py-1.5 rounded-full bg-[#F3F0E9] text-[#211E1A] hover:bg-[#A7654A] hover:text-[#F3F0E9] uppercase text-[9px] sm:text-[10px] tracking-widest font-semibold transition-colors shrink-0"
                >
                  Inspect
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 sm:space-y-6">
            <div className="relative group overflow-hidden rounded-2xl bg-[#E8E3D9] max-h-[220px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80"
                alt="Raw Normandy Flax Tunic Pullover"
                aspectRatioClass="aspect-[16/10] max-h-[220px]"
                className="group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#F3F0E9]/95 text-[#211E1A] text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium shadow-sm">
                Macro Textile Study
              </span>
            </div>

            <div className="space-y-3 sm:space-y-3.5">
              <div className="border-l-2 border-[#A7654A] pl-3.5 sm:pl-4">
                <blockquote className="font-serif text-sm sm:text-lg text-[#211E1A] italic leading-relaxed">
                  "We stripped every excess stitch to let the natural tension of the linen define its silhouette."
                </blockquote>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#777765] block mt-1.5">
                  — Atelier Studio Notes, Porto
                </span>
              </div>

              <div className="pt-1 sm:pt-2">
                <Link
                  to="/collections/solstice-atelier"
                  className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#211E1A] hover:text-[#A7654A] transition-colors"
                >
                  <span>Explore Solstice Lookbook</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
