import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import { Product } from '../types';
import { RotateCw, ShoppingBag, Eye, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

const RAIL_PRODUCT_IDS = [
  'fa-10495068274869',
  'fa-8167076036789',
  'fa-10495068569781',
  'fa-10495068471477',
  'fa-10495068438709',
  'fa-10495068373173',
  'fa-10495068537013',
  'fa-10495068504245',
];

export const AtelierRailShowcase: React.FC = () => {
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const [activeCenterIndex, setActiveCenterIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const openQuickView = useUIStore((state) => state.openQuickView);
  const showToast = useUIStore((state) => state.showToast);

  const railProducts = React.useMemo(() => {
    return RAIL_PRODUCT_IDS.map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, []);

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultColor = product.colors[0]?.name || 'Natural';
    const defaultSize = product.sizes.find((s) => s.inStock)?.size || 'M';
    addItem(product, defaultSize, defaultColor, 1);
    showToast(`Added ${product.name} (${defaultSize}) to bag`, 'success');
  };

  const handleOpenQuickView = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const scrollRail = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const distance = scrollRef.current.clientWidth * 0.65;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = 320;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveCenterIndex(Math.max(0, Math.min(index, railProducts.length - 1)));
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [railProducts.length]);

  return (
    <section className="relative w-full py-12 sm:py-20 bg-[#FAF9F6] overflow-hidden select-none border-y border-[#141414]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-bold">
                Kinetic Sartorial Rack
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#A7654A] animate-ping" />
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#141414] font-normal tracking-tight">
              The Atelier Clothes Rail
            </h2>
            <p className="text-xs sm:text-sm text-[#73706B] font-light max-w-xl">
              Tap any garment to turn it 180° and examine the silhouette from front to back. Slide along the parabolic rail to explore our limited seasonal run.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#141414]/10 shadow-xs text-[10px] uppercase tracking-wider text-[#73706B] font-semibold">
              <RotateCw className="w-3 h-3 text-[#A7654A] animate-spin" style={{ animationDuration: '8s' }} />
              <span>Tap piece to spin 180°</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollRail('left')}
                aria-label="Previous Garments"
                className="w-10 h-10 rounded-full bg-white hover:bg-[#141414] text-[#141414] hover:text-white border border-[#141414]/15 flex items-center justify-center transition-all shadow-xs active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail('right')}
                aria-label="Next Garments"
                className="w-10 h-10 rounded-full bg-white hover:bg-[#141414] text-[#141414] hover:text-white border border-[#141414]/15 flex items-center justify-center transition-all shadow-xs active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto pt-6 pb-4">
        <div className="absolute top-[28px] inset-x-4 sm:inset-x-8 h-8 pointer-events-none z-10">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-gradient-to-r from-[#8A7056] to-[#C5A079] rounded-l-md shadow-md border-r border-[#6B543F]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-gradient-to-l from-[#8A7056] to-[#C5A079] rounded-r-md shadow-md border-l border-[#6B543F]" />

          <svg
            className="w-full h-12 overflow-visible"
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M 0,16 Q 500,38 1000,16"
              stroke="rgba(0, 0, 0, 0.15)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 0,14 Q 500,36 1000,14"
              stroke="url(#brassRailGradient)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 0,12.5 Q 500,34.5 1000,12.5"
              stroke="rgba(255, 255, 255, 0.65)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="brassRailGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8A7056" />
                <stop offset="25%" stopColor="#C5A079" />
                <stop offset="50%" stopColor="#EAD8BA" />
                <stop offset="75%" stopColor="#C5A079" />
                <stop offset="100%" stopColor="#8A7056" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div
          ref={scrollRef}
          className="relative flex items-start gap-5 sm:gap-7 overflow-x-auto scrollbar-none px-6 sm:px-12 pt-8 pb-10 scroll-smooth snap-x snap-mandatory"
        >
          {railProducts.map((product, index) => {
            const isFlipped = !!flippedIds[product.id];
            const frontImg = product.images[0] || '';
            const backImg = product.images[1] || product.images[0] || '';
            const origPrice = product.originalPrice || 0;
            const discountPct = origPrice > product.price
              ? Math.round(((origPrice - product.price) / origPrice) * 100)
              : 0;

            const normalizedPos = (index - (railProducts.length - 1) / 2) / ((railProducts.length - 1) / 2);
            const curveDrop = Math.pow(normalizedPos, 2) * 14;
            const tiltAngle = normalizedPos * -2.2;

            return (
              <div
                key={product.id}
                className="group relative flex-none w-[260px] sm:w-[290px] snap-center transition-all duration-300"
                style={{
                  transform: `translateY(${curveDrop}px)`,
                }}
              >
                <div
                  className="flex flex-col items-center transition-transform duration-500 ease-out group-hover:-translate-y-2"
                  style={{
                    transform: `rotate(${tiltAngle}deg)`,
                  }}
                >
                  <div className="relative w-28 h-14 flex items-center justify-center pointer-events-none z-20">
                    <svg
                      viewBox="0 0 100 50"
                      className="w-full h-full overflow-visible drop-shadow-sm"
                      fill="none"
                    >
                      <path
                        d="M 50,26 C 50,14 56,8 54,4 C 52,0 48,0 46,4 C 44,8 50,14 50,26"
                        stroke="#B8966C"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 12,42 Q 50,24 88,42 L 86,46 Q 50,30 14,46 Z"
                        fill="#3C2A1E"
                        stroke="#261A13"
                        strokeWidth="1"
                      />
                      <circle cx="50" cy="28" r="2.5" fill="#B8966C" />
                    </svg>

                    <div className="absolute right-2 top-8 z-30 transition-transform duration-300 origin-top group-hover:rotate-6">
                      <div className="w-[1px] h-6 bg-[#A7654A]/60 mx-auto" />
                      <div className="bg-[#FAF8F5] border border-[#141414]/15 rounded-md px-2 py-1 shadow-sm text-center">
                        <span className="block text-[8px] uppercase tracking-wider text-[#A7654A] font-bold">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {discountPct > 0 && (
                          <span className="block text-[7px] text-[#73706B] line-through">
                            ₹{origPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className="relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 bg-[#ECE7DD]"
                    style={{ perspective: 1200 }}
                    onClick={(e) => toggleFlip(product.id, e)}
                  >
                    <div
                      className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      <div
                        className="absolute inset-0 w-full h-full"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <img
                          src={frontImg}
                          alt={`${product.name} Front`}
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          {discountPct > 0 && (
                            <span className="bg-[#A7654A] text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-xs">
                              -{discountPct}%
                            </span>
                          )}
                          <span className="bg-white/90 backdrop-blur-xs text-[#141414] text-[8px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full border border-[#141414]/10">
                            Front Drape
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => toggleFlip(product.id, e)}
                          aria-label="Spin to back"
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#141414] flex items-center justify-center shadow-sm backdrop-blur-xs transition-transform hover:scale-110 active:scale-95"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-[#141414]" />
                        </button>
                      </div>

                      <div
                        className="absolute inset-0 w-full h-full bg-[#ECE7DD]"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <img
                          src={backImg}
                          alt={`${product.name} Back`}
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute top-3 left-3">
                          <span className="bg-[#141414] text-white text-[8px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full">
                            Back Silhouette
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => toggleFlip(product.id, e)}
                          aria-label="Spin to front"
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#141414] flex items-center justify-center shadow-sm backdrop-blur-xs transition-transform hover:scale-110 active:scale-95"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-[#141414]" />
                        </button>
                      </div>
                    </div>

                    <div className="absolute inset-x-2.5 bottom-2.5 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={(e) => handleOpenQuickView(product, e)}
                        className="flex-1 h-9 bg-white/95 hover:bg-white text-[#141414] text-[10px] uppercase tracking-wider font-semibold rounded-lg shadow-md backdrop-blur-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#73706B]" />
                        <span>Quick View</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product, e)}
                        aria-label="Add to Wardrobe Bag"
                        className="w-9 h-9 bg-[#141414] hover:bg-[#2C2A29] text-white rounded-lg shadow-md transition-all flex items-center justify-center"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="w-full pt-3 px-1 space-y-1 text-center">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#A7654A] font-semibold block">
                      {product.subtitle || '100% Normandy Flax'}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base text-[#141414] font-normal leading-snug line-clamp-1">
                      <Link
                        to={`/product/${product.slug}`}
                        className="hover:text-[#A7654A] transition-colors"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-center gap-2 pt-0.5">
                      <span className="text-xs sm:text-sm font-semibold text-[#141414] tabular-nums">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {origPrice > product.price && (
                        <span className="text-[11px] text-[#8A8780] line-through tabular-nums">
                          ₹{origPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          {railProducts.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Scroll to garment ${idx + 1}`}
              onClick={() => {
                if (!scrollRef.current) return;
                const cardWidth = 310;
                scrollRef.current.scrollTo({
                  left: idx * cardWidth,
                  behavior: 'smooth',
                });
              }}
              className={`transition-all duration-300 rounded-full ${
                activeCenterIndex === idx
                  ? 'w-7 h-1.5 bg-[#141414]'
                  : 'w-1.5 h-1.5 bg-[#141414]/20 hover:bg-[#141414]/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="text-center pt-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] hover:text-[#A7654A] transition-colors border-b-2 border-[#141414] hover:border-[#A7654A] pb-0.5"
        >
          <span>Explore Complete {PRODUCTS.length}-Piece Atelier Archive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
};
