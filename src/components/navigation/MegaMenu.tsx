import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLLECTIONS } from '../../data/collections';
import { ArrowRight } from 'lucide-react';

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
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onMouseLeave={onClose}
        className="absolute top-full left-4 right-4 mt-2 mx-auto max-w-5xl w-full bg-white/98 backdrop-blur-md border border-[#141414]/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] py-7 px-8 z-50 pointer-events-auto"
      >
        <div className="grid grid-cols-12 gap-8">
          {/* Column 1: Core Categories */}
          <div className="col-span-4 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#73706B] block font-semibold">
              Clothing
            </span>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="font-serif text-base text-[#141414] hover:text-[#A7654A] transition-colors"
                >
                  All Clothes
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=shirts"
                  onClick={onClose}
                  className="text-xs text-[#73706B] hover:text-[#141414] transition-colors block"
                >
                  Pure Linen & Cotton Shirts
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=trousers"
                  onClick={onClose}
                  className="text-xs text-[#73706B] hover:text-[#141414] transition-colors block"
                >
                  Pleated & Baggy Trousers
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=co-ords"
                  onClick={onClose}
                  className="text-xs text-[#73706B] hover:text-[#141414] transition-colors block"
                >
                  Co-Ord Sets
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=outerwear"
                  onClick={onClose}
                  className="text-xs text-[#73706B] hover:text-[#141414] transition-colors block"
                >
                  Jackets & Overshirts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Editions / Collections */}
          <div className="col-span-4 space-y-3 border-l border-[#141414]/8 pl-6">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#73706B] block font-semibold">
              Collections
            </span>
            <ul className="space-y-2">
              {COLLECTIONS.map((col) => (
                <li key={col.id}>
                  <Link
                    to={`/collections/${col.slug}`}
                    onClick={onClose}
                    className="group block"
                  >
                    <div className="text-sm font-medium text-[#141414] group-hover:text-[#A7654A] transition-colors">
                      {col.title}
                    </div>
                    <div className="text-[10px] text-[#73706B]">
                      {col.season} {col.year}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Visual Campaign Feature */}
          <div className="col-span-4 border-l border-[#141414]/8 pl-6">
            <Link
              to="/collections/solstice-atelier"
              onClick={onClose}
              className="group block"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#ECE7DD] mb-2">
                <img
                  src="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AlmondWhiteLinenCropped_1.jpg?v=1787463484"
                  alt="Solstice Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[9px] uppercase tracking-widest text-[#A7654A] font-semibold block">
                Featured Campaign
              </span>
              <div className="text-xs font-serif text-[#141414] group-hover:text-[#A7654A] flex items-center justify-between mt-0.5">
                <span>The Solstice Flax Series</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
