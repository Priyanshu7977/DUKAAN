import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import { formatPrice } from '../utils/formatters';
import {
  Sparkles,
  ShoppingBag,
  Check,
  ArrowRight,
  RefreshCw,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';

export const LookbookStyler: React.FC = () => {
  const tops = PRODUCTS.filter((p: Product) => p.category === 'shirts' || p.category === 'knitwear');
  const bottoms = PRODUCTS.filter((p: Product) => p.category === 'trousers' || p.category === 'co-ords');

  const [selectedTopIndex, setSelectedTopIndex] = useState(0);
  const [selectedBottomIndex, setSelectedBottomIndex] = useState(0);

  const currentTop: Product = tops[selectedTopIndex] || tops[0];
  const currentBottom: Product = bottoms[selectedBottomIndex] || bottoms[0];

  const [topSize, setTopSize] = useState('M');
  const [bottomSize, setBottomSize] = useState('M');

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const showToast = useUIStore((state) => state.showToast);

  const combinedPrice = currentTop.price + currentBottom.price;
  const bundleDiscount = Math.round(combinedPrice * 0.1);
  const finalBundlePrice = combinedPrice - bundleDiscount;

  const handleNextTop = () => {
    setSelectedTopIndex((prev) => (prev + 1) % tops.length);
  };
  const handlePrevTop = () => {
    setSelectedTopIndex((prev) => (prev - 1 + tops.length) % tops.length);
  };

  const handleNextBottom = () => {
    setSelectedBottomIndex((prev) => (prev + 1) % bottoms.length);
  };
  const handlePrevBottom = () => {
    setSelectedBottomIndex((prev) => (prev - 1 + bottoms.length) % bottoms.length);
  };

  const handleRandomize = () => {
    const randomTop = Math.floor(Math.random() * tops.length);
    const randomBottom = Math.floor(Math.random() * bottoms.length);
    setSelectedTopIndex(randomTop);
    setSelectedBottomIndex(randomBottom);
    showToast('Randomized Atelier Ensemble', 'info');
  };

  const handleAddEnsembleToBag = () => {
    addItem(currentTop, currentTop.colors[0]?.name || 'Botanical Natural', topSize, 1);
    addItem(currentBottom, currentBottom.colors[0]?.name || 'Obsidian Noir', bottomSize, 1);
    openCart();
    showToast(`Ensemble added to bag with 10% pairing privilege`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#141414] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-amber-900 text-[10px] font-semibold uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#A7654A]" />
            <span>Atelier Lookbook Canvas</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#141414] font-normal tracking-tight">
            The Ensemble Styler
          </h1>
          <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
            Mix, match, and curate your signature silhouette. Pair pure European linen shirts with architectural trousers to visualize your complete outfit before tailoring.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleRandomize}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#141414]/15 hover:border-[#141414] text-xs uppercase tracking-wider font-semibold rounded-sm transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Surprise Ensemble</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-[#141414]/10 rounded-sm shadow-xs space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#73706B] font-semibold block">
                    Garment 01 • Upper Silhouette
                  </span>
                  <h3 className="font-serif text-lg text-[#141414] font-medium">
                    {currentTop.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevTop}
                    aria-label="Previous shirt"
                    className="w-8 h-8 rounded-full border border-[#141414]/15 flex items-center justify-center hover:bg-[#FAF9F6] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-[#73706B] tabular-nums px-2">
                    {selectedTopIndex + 1} / {tops.length}
                  </span>
                  <button
                    onClick={handleNextTop}
                    aria-label="Next shirt"
                    className="w-8 h-8 rounded-full border border-[#141414]/15 flex items-center justify-center hover:bg-[#FAF9F6] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative aspect-4/3 sm:aspect-16/9 bg-[#ECE7DD] rounded-sm overflow-hidden border border-[#141414]/8">
                <img
                  src={currentTop.images[0]}
                  alt={currentTop.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-[#141414]/90 backdrop-blur-xs text-white px-3 py-1.5 text-xs rounded-sm flex items-center gap-2">
                  <span className="font-serif">{formatPrice(currentTop.price)}</span>
                  <span className="text-[#ECE7DD]">•</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#FAF9F6]/80">{currentTop.collection}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-semibold">
                  Upper Size:
                </span>
                <div className="flex gap-1.5">
                  {currentTop.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setTopSize(s.size)}
                      className={`w-8 h-7 text-[10px] font-semibold border rounded-sm transition-all ${
                        topSize === s.size
                          ? 'border-[#141414] bg-[#141414] text-white'
                          : 'border-[#141414]/15 hover:border-[#141414] bg-white text-[#141414]'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#141414]/10 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#73706B] font-semibold block">
                    Garment 02 • Lower Silhouette
                  </span>
                  <h3 className="font-serif text-lg text-[#141414] font-medium">
                    {currentBottom.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevBottom}
                    aria-label="Previous bottom"
                    className="w-8 h-8 rounded-full border border-[#141414]/15 flex items-center justify-center hover:bg-[#FAF9F6] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-[#73706B] tabular-nums px-2">
                    {selectedBottomIndex + 1} / {bottoms.length}
                  </span>
                  <button
                    onClick={handleNextBottom}
                    aria-label="Next bottom"
                    className="w-8 h-8 rounded-full border border-[#141414]/15 flex items-center justify-center hover:bg-[#FAF9F6] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative aspect-4/3 sm:aspect-16/9 bg-[#ECE7DD] rounded-sm overflow-hidden border border-[#141414]/8">
                <img
                  src={currentBottom.images[0]}
                  alt={currentBottom.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-[#141414]/90 backdrop-blur-xs text-white px-3 py-1.5 text-xs rounded-sm flex items-center gap-2">
                  <span className="font-serif">{formatPrice(currentBottom.price)}</span>
                  <span className="text-[#ECE7DD]">•</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#FAF9F6]/80">{currentBottom.collection}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-semibold">
                  Lower Size:
                </span>
                <div className="flex gap-1.5">
                  {currentBottom.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setBottomSize(s.size)}
                      className={`w-8 h-7 text-[10px] font-semibold border rounded-sm transition-all ${
                        bottomSize === s.size
                          ? 'border-[#141414] bg-[#141414] text-white'
                          : 'border-[#141414]/15 hover:border-[#141414] bg-white text-[#141414]'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="bg-white p-6 border border-[#141414]/10 rounded-sm shadow-xs space-y-5">
              <div className="border-b border-[#141414]/10 pb-4">
                <div className="flex items-center gap-2 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-emerald-700" />
                  <span>Curated Ensemble Privilege</span>
                </div>
                <h2 className="font-serif text-2xl text-[#141414] font-normal mt-1">
                  Ensemble Summary
                </h2>
                <p className="text-xs text-[#73706B] mt-0.5">
                  Pairing discount automatically applied at checkout.
                </p>
              </div>

              <div className="space-y-3 text-xs text-[#73706B]">
                <div className="flex justify-between items-center">
                  <span className="line-clamp-1">{currentTop.name} ({topSize})</span>
                  <span className="font-medium text-[#141414]">{formatPrice(currentTop.price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="line-clamp-1">{currentBottom.name} ({bottomSize})</span>
                  <span className="font-medium text-[#141414]">{formatPrice(currentBottom.price)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-700 font-medium">
                  <span>Ensemble Pairing Benefit (10% OFF)</span>
                  <span>-{formatPrice(bundleDiscount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Express Insured Air Delivery</span>
                  <span className="text-emerald-700 font-semibold">FREE</span>
                </div>

                <div className="pt-3 border-t border-[#141414]/10 flex justify-between items-baseline font-semibold text-base text-[#141414]">
                  <div>
                    <span className="font-serif text-lg">Ensemble Total:</span>
                    <p className="text-[10px] text-[#73706B] font-light">All GST & taxes included</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#73706B] line-through block font-normal">
                      {formatPrice(combinedPrice)}
                    </span>
                    <span className="font-serif text-2xl text-[#141414]">
                      {formatPrice(finalBundlePrice)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddEnsembleToBag}
                className="w-full h-12 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 rounded-sm transition-all shadow-md active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Complete Ensemble to Bag</span>
              </button>

              <div className="p-3.5 bg-[#FAF9F6] border border-[#141414]/10 rounded-sm space-y-2 text-[11px] text-[#73706B]">
                <div className="flex items-center gap-2 text-[#141414] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A7654A]" />
                  <span>Atelier Complimentary Alterations</span>
                </div>
                <p className="leading-relaxed">
                  Both garments ship together in our signature archival gift box with wax-sealed certification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};