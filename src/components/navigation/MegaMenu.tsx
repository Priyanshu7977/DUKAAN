import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLLECTIONS } from '../../data/collections';
import { ArrowRight, X, Sparkles } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenu: string | null;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, activeMenu }) => {
  if (!isOpen || !activeMenu) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        onMouseLeave={onClose}
        className="absolute top-full left-4 right-4 mt-2 mx-auto max-w-5xl w-full bg-white border border-[#141414]/12 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.14)] py-6 px-8 z-50 pointer-events-auto before:content-[''] before:absolute before:-top-3 before:inset-x-0 before:h-4"
      >
        {/* Top bar with category badge & quick close */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#141414]/8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A7654A]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#141414]">
              {activeMenu === 'shop' ? 'DUKAAN Wardrobe Catalog' : 'Seasonal Editions & Lookbooks'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#73706B] hover:text-[#141414] hover:bg-[#FAF8F5] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* Column 1: Core Garment Categories */}
          <div className="col-span-4 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#73706B] block font-semibold mb-2">
              Categories
            </span>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="px-3 py-2 -mx-2 rounded-lg hover:bg-[#FAF8F5] text-[#141414] hover:text-[#A7654A] transition-all flex items-center justify-between group font-serif text-base font-medium"
                >
                  <span>All Clothes</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#A7654A]" />
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=shirts"
                  onClick={onClose}
                  className="px-3 py-2 -mx-2 rounded-lg hover:bg-[#FAF8F5] text-[#141414] hover:text-[#A7654A] transition-all flex items-center justify-between group text-xs font-medium"
                >
                  <span>Pure Linen & Cotton Shirts</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#A7654A]" />
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=trousers"
                  onClick={onClose}
                  className="px-3 py-2 -mx-2 rounded-lg hover:bg-[#FAF8F5] text-[#141414] hover:text-[#A7654A] transition-all flex items-center justify-between group text-xs font-medium"
                >
                  <span>Pleated & Baggy Trousers</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#A7654A]" />
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=co-ords"
                  onClick={onClose}
                  className="px-3 py-2 -mx-2 rounded-lg hover:bg-[#FAF8F5] text-[#141414] hover:text-[#A7654A] transition-all flex items-center justify-between group text-xs font-medium"
                >
                  <span>Co-Ord Sets</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#A7654A]" />
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=outerwear"
                  onClick={onClose}
                  className="px-3 py-2 -mx-2 rounded-lg hover:bg-[#FAF8F5] text-[#141414] hover:text-[#A7654A] transition-all flex items-center justify-between group text-xs font-medium"
                >
                  <span>Jackets & Overshirts</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#A7654A]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Editions / Collections */}
          <div className="col-span-4 space-y-2 border-l border-[#141414]/8 pl-6">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#73706B] block font-semibold mb-2">
              Editions Archive
            </span>
            <ul className="space-y-1.5">
              {COLLECTIONS.map((col) => (
                <li key={col.id}>
                  <Link
                    to={`/collections/${col.slug}`}
                    onClick={onClose}
                    className="p-2.5 -mx-2 rounded-lg hover:bg-[#FAF8F5] border border-transparent hover:border-[#141414]/8 transition-all block group"
                  >
                    <div className="text-xs font-semibold text-[#141414] group-hover:text-[#A7654A] transition-colors flex items-center justify-between">
                      <span>{col.title}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#A7654A]" />
                    </div>
                    <div className="text-[10px] text-[#73706B] font-light mt-0.5">
                      {col.season} • {col.year}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Visual Campaign Feature */}
          <div className="col-span-4 border-l border-[#141414]/8 pl-6 flex flex-col justify-between">
            <Link
              to="/collections/solstice-atelier"
              onClick={onClose}
              className="group block"
            >
              <div className="aspect-[16/11] overflow-hidden rounded-lg bg-[#ECE7DD] mb-2.5 shadow-xs">
                <img
                  src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AlmondWhiteLinenCropped_1.jpg?v=1787463484"
                  alt="Solstice Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#A7654A] font-semibold mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>Featured Campaign</span>
              </div>
              <div className="text-sm font-serif text-[#141414] group-hover:text-[#A7654A] flex items-center justify-between transition-colors">
                <span>The Solstice Flax Series</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-[#73706B] font-light mt-1">
                Explore hand-finished crinkle gauze and 100% natural European linen.
              </p>
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
