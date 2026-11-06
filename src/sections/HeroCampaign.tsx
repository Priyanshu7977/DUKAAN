import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  desktop: string;
  mobile: string;
  alt: string;
  objectPosition?: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    desktop: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=85',
    mobile: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=85',
    alt: 'Dukaan High Summer Mediterranean Campaign',
    objectPosition: 'object-[center_25%]',
  },
  {
    id: 2,
    desktop: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85',
    mobile: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85',
    alt: 'Dukaan Architectural Linen Edit',
    objectPosition: 'object-[center_20%]',
  },
];

export const HeroCampaign: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-[#FAF9F6] flex items-end justify-center pb-8 sm:pb-12 select-none">
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-x-0 bottom-0 top-[56px] sm:top-[72px] w-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-0 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <picture className="w-full h-full block">
              <source
                media="(max-width: 767px)"
                srcSet={slide.mobile}
              />
              <source
                media="(min-width: 768px)"
                srcSet={slide.desktop}
              />
              <img
                src={slide.desktop}
                alt={slide.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                className={`w-full h-full object-cover ${slide.objectPosition || 'object-[center_top]'} pointer-events-none`}
              />
            </picture>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-52 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none z-10" />

      <button
        onClick={prevSlide}
        aria-label="Previous Banner"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-black/25 hover:bg-black/55 text-white backdrop-blur-md transition-all shadow-md"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Banner"
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-black/25 hover:bg-black/55 text-white backdrop-blur-md transition-all shadow-md"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-24 lg:bottom-28 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === idx
                ? 'w-7 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      <div className="relative z-20 flex flex-row items-center justify-center gap-2.5 sm:gap-4 px-4 w-full max-w-sm sm:max-w-md mx-auto">
        <Link
          to="/shop"
          className="flex-1 sm:flex-initial h-12 px-6 sm:px-8 bg-white hover:bg-[#FAF8F5] text-[#141414] text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 shadow-xl hover:scale-105 active:scale-95 rounded-sm"
        >
          <span>Explore Clothes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to="/collections/solstice-atelier"
          className="flex-1 sm:flex-initial h-12 px-6 sm:px-8 bg-black/45 hover:bg-black/65 border border-white/60 hover:border-white text-white text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium backdrop-blur-sm transition-all shadow-xl flex items-center justify-center active:scale-95 rounded-sm"
        >
          <span>Summer Edit</span>
        </Link>
      </div>
    </section>
  );
};
