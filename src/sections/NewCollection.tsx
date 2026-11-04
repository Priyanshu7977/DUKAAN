import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const NewCollection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F3F0E9] border-b border-[#211E1A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-1.5">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="relative group overflow-hidden rounded-2xl bg-[#E8E3D9] max-h-[520px]">
              <ImageWithFallback
                src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AWGauze1.jpg?v=1780592855"
                alt="Solstice Collection Gauze Holiday Shirt"
                aspectRatioClass="aspect-[4/5] max-h-[520px]"
                className="group-hover:scale-102 transition-transform duration-700 ease-out object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-3.5 sm:p-4 bg-[#211E1A]/85 backdrop-blur-md rounded-xl text-[#F3F0E9] flex items-center justify-between text-xs">
                <div>
                  <p className="font-serif text-sm sm:text-base">Plate IV: The Gauze Holiday Shirt</p>
                  <p className="text-[#A7654A] text-[10px] uppercase tracking-wider">Mediterranean Sun Campaign</p>
                </div>
                <Link
                  to="/product/almond-white-gauze-holiday-shirt"
                  className="px-3.5 py-1.5 rounded-full bg-[#F3F0E9] text-[#211E1A] hover:bg-[#A7654A] hover:text-[#F3F0E9] uppercase text-[10px] tracking-widest font-semibold transition-colors"
                >
                  Inspect
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="relative group overflow-hidden rounded-2xl bg-[#E8E3D9] max-h-[220px]">
              <ImageWithFallback
                src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE131_06d49f6a-e2c0-46a2-871e-12ba8fc4cbde.jpg?v=1775042151"
                alt="Raw Normandy Flax Tunic Pullover"
                aspectRatioClass="aspect-[16/10] max-h-[220px]"
                className="group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#F3F0E9]/95 text-[#211E1A] text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium shadow-sm">
                Macro Textile Study
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="border-l-2 border-[#A7654A] pl-4">
                <blockquote className="font-serif text-base sm:text-lg text-[#211E1A] italic leading-relaxed">
                  "We stripped every excess stitch to let the natural tension of the linen define its silhouette."
                </blockquote>
                <span className="text-[10px] uppercase tracking-widest text-[#777765] block mt-1.5">
                  — Atelier Studio Notes, Porto
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#777765] font-light leading-relaxed">
                Rather than forcing rigid internal structures into the clothes, Solstice balances weight and gravity. Dropped shoulders, expansive pleats, and unlined constructions invite sea breezes while maintaining a clean contour.
              </p>

              <div className="pt-1">
                <span className="text-[10px] uppercase tracking-widest text-[#777765] block mb-2 font-medium">
                  Collection Pigments
                </span>
                <div className="flex items-center gap-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#EDE8DF] border border-black/15 inline-block" />
                    <span className="text-xs text-[#211E1A]">Almond</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#A7654A] border border-black/15 inline-block" />
                    <span className="text-xs text-[#211E1A]">Terracotta</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#7E9B8D] border border-black/15 inline-block" />
                    <span className="text-xs text-[#211E1A]">Aqua</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#211E1A] border border-black/15 inline-block" />
                    <span className="text-xs text-[#211E1A]">Obsidian</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/collections/solstice-atelier"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#211E1A] text-[#F3F0E9] hover:bg-[#A7654A] text-xs uppercase tracking-[0.2em] font-semibold transition-all group shadow-sm"
                >
                  <span>Explore Solstice Atelier</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
