import React from 'react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const BrandPhilosophy: React.FC = () => {
  const pillars = [
    {
      number: '01',
      title: '100% Natural Fabrics',
      description:
        'We use pure European flax linen, breathable double-crinkle cotton, and textured corduroy. No synthetic blends; only natural fabrics that breathe freely in Indian climates.',
      image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AlmondWhiteLinenCropped_4.jpg?v=1787463484',
    },
    {
      number: '02',
      title: 'Comfortable Modern Fit',
      description:
        'Relaxed dropped shoulder silhouettes and comfortable pull-on waistbands that look effortlessly stylish while giving you complete freedom of movement.',
      image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE383.jpg?v=1771397938',
    },
    {
      number: '03',
      title: 'Built to Last',
      description:
        'Crafted in limited batches with reinforced French seams and premium buttons so each shirt and trouser outlasts fast-fashion cycles.',
      image: 'https://www.5feet11.com/cdn/shop/files/desktopbanner5.png',
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-[#FAF9F6] border-b border-[#141414]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-1">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
            Our Quality Promise
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#141414] font-normal">
            The Dukaan Philosophy
          </h2>
          <p className="text-xs text-[#73706B] font-light leading-relaxed">
            Contemporary clothing crafted from pure, breathable natural fabrics: linen and cotton designed to look sharp, feel comfortable, and last for years.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {pillars.map((pillar) => (
            <div key={pillar.number} className="flex flex-col space-y-2.5 group">
              <div className="overflow-hidden bg-[#ECE7DD] aspect-[4/5] relative">
                <ImageWithFallback
                  src={pillar.image}
                  alt={pillar.title}
                  aspectRatioClass="w-full h-full"
                  className="group-hover:scale-105 transition-transform duration-500 ease-out object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-[#141414] text-white text-[10px] tabular-nums font-semibold px-2 py-0.5">
                  {pillar.number}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-base sm:text-lg text-[#141414] group-hover:text-[#A7654A] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#73706B] font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
