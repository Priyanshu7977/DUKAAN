import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { AnimatePresence, motion } from 'framer-motion';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getCartTotal,
    freeShippingThreshold,
  } = useCartStore();

  const subtotal = getCartTotal();
  const diff = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col border-l border-[#141414]/10"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#141414]/8 flex items-center justify-between bg-white">
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-[#141414]">Shopping Bag</h3>
                <span className="text-[11px] uppercase tracking-widest text-[#73706B]">
                  {items.length} {items.length === 1 ? 'object' : 'objects'}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 text-[#141414] hover:text-[#A7654A] transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            <div className="px-5 py-3 bg-[#EAE7DF] text-xs border-b border-[#141414]/8">
              {diff > 0 ? (
                <p className="text-[#141414] font-light text-[11px]">
                  Add <strong className="font-medium text-[#A7654A]">{formatPrice(diff)}</strong> more to get <strong className="font-medium text-[#141414]">FREE Delivery</strong> across India.
                </p>
              ) : (
                <p className="text-[#141414] font-medium flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#A7654A] inline-block" />
                  You have unlocked FREE express delivery across India!
                </p>
              )}
              <div className="w-full h-1 bg-black/10 mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#141414] transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-[#141414]/8">
              {items.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <p className="font-serif text-xl text-[#141414]">Your bag is currently empty</p>
                  <p className="text-xs text-[#73706B] max-w-xs mx-auto font-light">
                    Explore our foundational garments engineered with raw organic fibres and relaxed geometries.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="inline-flex items-center justify-center h-12 px-8 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-md transition-all active:scale-[0.99] mt-3"
                  >
                    Explore Wardrobe
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="py-3.5 flex gap-3.5">
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="w-16 h-22 shrink-0 bg-[#ECE7DD] overflow-hidden rounded-lg block"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="font-serif text-sm text-[#141414] hover:text-[#A7654A] transition-colors truncate block font-normal"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#73706B] hover:text-[#A7654A] transition-colors ml-2 p-0.5"
                            aria-label={`Remove ${item.product.name} from bag`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-[#73706B] mt-0.5 space-y-0.5">
                          <p>Color: {item.selectedColor}</p>
                          <p>Size: {item.selectedSize}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-[#141414]/15 bg-white px-1.5 py-0.5 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-0.5 hover:text-[#A7654A] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-[#141414] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-0.5 hover:text-[#A7654A] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-serif text-sm font-semibold text-[#141414] tabular-nums">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subtotal & Checkout Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[#141414]/8 bg-white space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#73706B]">
                    <span>Subtotal</span>
                    <span className="text-sm text-[#141414] font-semibold tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#73706B]">
                    <span>Estimated Shipping</span>
                    <span className="font-medium text-[#141414]">{diff <= 0 ? 'FREE Delivery' : '₹150'}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#73706B]">
                    <span>All Indian Taxes (GST)</span>
                    <span className="text-emerald-700 font-medium">Included</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  className="w-full h-12 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] rounded-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#73706B]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A7654A]" />
                  <span>Secure 256-bit SSL encrypted checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
