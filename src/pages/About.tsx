import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      {/* Editorial Header - Pure, Clean & Luminous */}
      <section className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-white border-b border-[#141414]/10 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: 'Our Story' }]}
            className="mb-3"
          />
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              About The Brand
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal tracking-tight leading-tight">
              Objects of Everyday Expression
            </h1>
            <p className="text-xs sm:text-sm text-[#73706B] font-light mt-1 leading-relaxed">
              Contemporary unisex clothing crafted with 100% pure European linen, soft cotton gauze, and timeless relaxed silhouettes.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 1: The Origin */}
      <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#141414]/8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              Our Vision
            </span>
            <h2 className="font-serif text-xl sm:text-3xl text-[#141414] leading-snug font-normal">
              Saying No to Fast Fashion & Synthetic Blends
            </h2>
            <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
              Dukaan was founded with a straightforward goal: to craft modern, effortless clothing that feels incredible on your skin. Fast fashion has flooded Indian wardrobes with cheap polyester blends that trap sweat, lose shape, and fade after just a few washes.
            </p>
            <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
              We do things differently. We work exclusively with pure, breathable natural fabrics: pure European linen, airy double-gauze cotton, and soft micro-waffle corduroy. Every piece is built to breathe easily in warm Indian weather and age gracefully over time.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden bg-[#ECE7DD] aspect-[4/5] max-h-[420px]">
              <ImageWithFallback
                src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE733-scaled.jpg?v=1740307050"
                alt="Natural Linen Craftsmanship"
                aspectRatioClass="w-full h-full"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: The Three Pillars */}
      <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#141414]/8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
            Quality Principles
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#141414] font-normal">
            What Makes Dukaan Special
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-[#141414]/8 space-y-2">
            <span className="text-xs text-[#A7654A] font-bold tabular-nums tracking-wider">01</span>
            <h3 className="font-serif text-lg text-[#141414]">100% Pure Natural Fibres</h3>
            <p className="text-xs text-[#73706B] font-light leading-relaxed">
              No plastic or synthetic blends. Only organic linen and soft combed cotton that keep you naturally cool, comfortable, and fresh all day long.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#141414]/8 space-y-2">
            <span className="text-xs text-[#A7654A] font-bold tabular-nums tracking-wider">02</span>
            <h3 className="font-serif text-lg text-[#141414]">Relaxed Unisex Tailoring</h3>
            <p className="text-xs text-[#73706B] font-light leading-relaxed">
              Flattering dropped shoulders, airy volume, and comfortable pull-on waists designed to look effortlessly sharp on all body types.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#141414]/8 space-y-2">
            <span className="text-xs text-[#A7654A] font-bold tabular-nums tracking-wider">03</span>
            <h3 className="font-serif text-lg text-[#141414]">Direct-to-Customer Value</h3>
            <p className="text-xs text-[#73706B] font-light leading-relaxed">
              By designing, producing, and delivering directly to you, we provide international luxury fashion quality at fair, transparent Indian prices.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Contact Banner */}
      <section className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-white border border-[#141414]/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-base text-[#141414]">Have questions about our fabrics or fit?</h4>
            <p className="text-xs text-[#73706B] font-light">
              Chat directly with our styling team on WhatsApp: +91 7977641125 / Email: priyanshubipin2006@gmail.com
            </p>
          </div>
          <Link
            to="/shop"
            className="h-12 px-8 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold transition-all rounded-lg shadow-md flex items-center justify-center shrink-0 active:scale-[0.99]"
          >
            Explore Wardrobe
          </Link>
        </div>
      </section>
    </div>
  );
};
