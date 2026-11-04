import React, { useState } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useCartStore } from '../../store/useCartStore';
import { Link } from 'react-router-dom';
import { X, Check, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { AnimatePresence, motion } from 'framer-motion';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, showToast, openSizeGuide } = useUIStore();
  const addItem = useCartStore((state) => state.addItem);

  const product = quickViewProduct;

  const [selectedColor, setSelectedColor] = useState(
    product ? product.colors[0]?.name : ''
  );
  const [selectedSize, setSelectedSize] = useState(
    product ? product.sizes.find((s) => s.inStock)?.size || product.sizes[0]?.size : ''
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(product.sizes.find((s) => s.inStock)?.size || product.sizes[0]?.size || '');
      setActiveImageIdx(0);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToBag = () => {
    if (!selectedSize) {
      showToast('Please select a size', 'error');
      return;
    }
    addItem(product, selectedSize, selectedColor, 1);
    showToast(`Added ${product.name} (${selectedSize}) to bag`, 'success');
    closeQuickView();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white border border-[#141414]/10 shadow-2xl max-w-3xl w-full my-8 relative overflow-hidden rounded-2xl grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#141414]/10 shadow-xs flex items-center justify-center text-[#141414] hover:text-[#A7654A] transition-all"
            aria-label="Close quick view"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left Column: Image Gallery */}
          <div className="relative bg-[#ECE7DD] flex flex-col justify-between p-4">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnail dots/selectors */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3 justify-center">
                {product.images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-10 h-14 overflow-hidden rounded-md border transition-all ${
                      activeImageIdx === idx ? 'border-[#141414]' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold">
                {product.collection}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl text-[#141414] mt-1 leading-snug font-normal">
                {product.name}
              </h2>
              <p className="text-base font-semibold text-[#141414] mt-1.5 tabular-nums">
                {formatPrice(product.price)}
              </p>
              <p className="text-xs text-[#73706B] mt-2 line-clamp-3 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="mt-4 pt-3 border-t border-[#141414]/8">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="uppercase tracking-wider text-[#73706B] text-[10px]">Shade: {selectedColor}</span>
                </div>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColor === color.name ? 'border-[#141414] scale-110' : 'border-transparent'
                      }`}
                      title={color.name}
                    >
                      <span
                        className="w-4 h-4 rounded-full inline-block border border-black/10"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-3.5 pt-3 border-t border-[#141414]/8">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="uppercase tracking-wider text-[#73706B] text-[10px]">Size</span>
                  <button
                    onClick={openSizeGuide}
                    className="text-[#A7654A] underline uppercase tracking-wider text-[10px]"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      disabled={!s.inStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`h-10 px-4 text-xs uppercase font-medium tracking-wider border rounded-lg transition-all flex items-center justify-center ${
                        !s.inStock
                          ? 'border-black/10 text-black/25 line-through cursor-not-allowed bg-black/5'
                          : selectedSize === s.size
                          ? 'border-[#141414] bg-[#141414] text-white shadow-xs'
                          : 'border-[#141414]/15 text-[#141414] hover:border-[#141414] bg-white'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-[#141414]/8 space-y-2">
              <button
                onClick={handleAddToBag}
                className="w-full h-12 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] rounded-lg font-semibold"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>

              <Link
                to={`/product/${product.slug}`}
                onClick={closeQuickView}
                className="block text-center text-[10px] uppercase tracking-widest text-[#73706B] hover:text-[#141414] transition-colors py-1"
              >
                View Full Garment Dossier →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
