import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import { Product } from '../types';
import { ShoppingBag, Eye, ArrowUpRight } from 'lucide-react';

const RAIL_PRODUCT_IDS = [
  'fa-10495068274869',
  'fa-8167076036789',
  'fa-10455941480629',
  'fa-10562152497333',
  'fa-10400848445621',
  'fa-10363057733813',
  'fa-8167092322485',
  'fa-8167088750773',
  'fa-10618904871093',
  'fa-8167088095413',
  'fa-8167092355253',
  'fa-10655700877493',
];

export const AtelierRailShowcase: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const reqIdRef = useRef<number | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const openQuickView = useUIStore((state) => state.openQuickView);
  const showToast = useUIStore((state) => state.showToast);

  const baseProducts = useMemo(() => {
    return RAIL_PRODUCT_IDS.map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, []);

  const loopedProducts = useMemo(() => {
    return [...baseProducts, ...baseProducts];
  }, [baseProducts]);

  const toggleFlip = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleQuickAdd = useCallback((product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultColor = product.colors[0]?.name || 'Natural';
    const defaultSize = product.sizes.find((s) => s.inStock)?.size || 'M';
    addItem(product, defaultSize, defaultColor, 1);
    showToast(`Added ${product.name} (${defaultSize}) to bag`, 'success');
  }, [addItem, showToast]);

  const handleOpenQuickView = useCallback((product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  }, [openQuickView]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let lastTime = performance.now();
    const speed = 0.65;

    const step = (time: number) => {
      const delta = Math.min(time - lastTime, 32);
      lastTime = time;

      if (!isHovered && !isDragging && el) {
        el.scrollLeft += speed * (delta / 16);
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }

      reqIdRef.current = requestAnimationFrame(step);
    };

    reqIdRef.current = requestAnimationFrame(step);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, [isHovered, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollStart(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative w-full py-12 sm:py-20 bg-[#FAF9F6] overflow-hidden select-none border-y border-[#141414]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#A7654A] font-bold">
            Kinetic Sartorial Rack
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#A7654A] animate-ping" />
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#141414] font-normal tracking-tight mb-2">
          The Atelier Clothes Rail
        </h2>
        <p className="text-xs sm:text-sm text-[#73706B] font-light max-w-xl mx-auto">
          Suspended European tailoring in kinetic motion. Hover any garment to inspect the 180° back drape silhouette.
        </p>
      </div>

      <div
        className="relative w-full pt-4 pb-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseUpOrLeave();
        }}
      >
        <div className="absolute top-[24px] inset-x-0 h-8 pointer-events-none z-10">
          <div className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-9 bg-gradient-to-r from-[#8A7056] to-[#C5A079] rounded-l-md shadow-md border-r border-[#6B543F] z-20" />
          <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-4 h-9 bg-gradient-to-l from-[#8A7056] to-[#C5A079] rounded-r-md shadow-md border-l border-[#6B543F] z-20" />

          <svg
            className="w-full h-12 overflow-visible"
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M 0,16 Q 500,38 1000,16"
              stroke="rgba(0, 0, 0, 0.12)"
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className={`relative flex items-start gap-4 sm:gap-6 overflow-x-auto scrollbar-none px-6 sm:px-12 pt-7 pb-8 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {loopedProducts.map((product, index) => {
            const isFlipped = hoveredCardId === `${product.id}-${index}` || !!flippedIds[`${product.id}-${index}`];
            const frontImg = product.images[0] || '';
            const backImg = product.images[1] || product.images[0] || '';
            const origPrice = product.originalPrice || 0;
            const discountPct = origPrice > product.price
              ? Math.round(((origPrice - product.price) / origPrice) * 100)
              : 0;

            return (
              <div
                key={`${product.id}-${index}`}
                className="group relative flex-none w-[200px] sm:w-[230px] md:w-[250px] transition-all duration-300"
                onMouseEnter={() => setHoveredCardId(`${product.id}-${index}`)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <div className="flex flex-col items-center transition-transform duration-500 ease-out group-hover:-translate-y-2">
                  <div className="relative w-24 sm:w-28 h-12 flex items-center justify-center pointer-events-none z-20">
                    <svg
                      viewBox="0 0 100 46"
                      className="w-full h-full overflow-visible drop-shadow-sm"
                      fill="none"
                    >
                      <path
                        d="M 50,22 C 50,12 56,6 54,2 C 52,-2 48,-2 46,2 C 44,6 50,12 50,22"
                        stroke="#B8966C"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 12,38 Q 50,22 88,38 L 86,42 Q 50,26 14,42 Z"
                        fill="#3C2A1E"
                        stroke="#261A13"
                        strokeWidth="1"
                      />
                      <circle cx="50" cy="24" r="2.2" fill="#B8966C" />
                    </svg>

                    <div className="absolute right-1 top-7 z-30 transition-transform duration-300 origin-top group-hover:rotate-6">
                      <div className="w-[1px] h-5 bg-[#A7654A]/60 mx-auto" />
                      <div className="bg-[#FAF8F5] border border-[#141414]/15 rounded-xs px-1.5 py-0.5 shadow-xs text-center whitespace-nowrap">
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
                    className="relative w-full aspect-[3/4.2] rounded-xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500 bg-[#ECE7DD] border border-[#141414]/8"
                    style={{ perspective: 1200 }}
                    onClick={(e) => toggleFlip(`${product.id}-${index}`, e)}
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          {discountPct > 0 && (
                            <span className="bg-[#A7654A] text-white text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                              -{discountPct}%
                            </span>
                          )}
                          <span className="bg-white/90 backdrop-blur-xs text-[#141414] text-[7.5px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full border border-[#141414]/10">
                            Front
                          </span>
                        </div>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute top-2.5 left-2.5">
                          <span className="bg-[#141414] text-white text-[7.5px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full">
                            Back Silhouette
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-white drop-shadow-sm text-left">
                        <h3 className="font-serif text-xs line-clamp-1 text-white">
                          {product.name}
                        </h3>
                        <p className="text-[10px] text-white/80 font-medium">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleOpenQuickView(product, e)}
                          className="flex-1 py-1.5 px-2 bg-white/90 hover:bg-white text-[#141414] text-[9px] uppercase tracking-wider font-bold rounded-md flex items-center justify-center gap-1 shadow-sm backdrop-blur-xs transition-colors"
                        >
                          <Eye className="w-3 h-3 text-[#141414]" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="flex-1 py-1.5 px-2 bg-[#141414] hover:bg-[#A7654A] text-white text-[9px] uppercase tracking-wider font-bold rounded-md flex items-center justify-center gap-1 shadow-sm transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3 text-white" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 text-center w-full px-1">
                    <Link
                      to={`/product/${product.slug}`}
                      className="inline-flex items-center gap-1 font-serif text-xs text-[#141414] hover:text-[#A7654A] transition-colors line-clamp-1 font-medium"
                    >
                      <span>{product.name}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </Link>
                    <div className="text-[10px] text-[#73706B] font-light mt-0.5">
                      ₹{product.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
