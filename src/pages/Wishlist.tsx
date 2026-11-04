import React from 'react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const Wishlist: React.FC = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useUIStore((state) => state.showToast);

  const handleMoveToBag = (product: any) => {
    const defaultSize = product.sizes.find((s: any) => s.inStock)?.size || product.sizes[0]?.size || 'M';
    const defaultColor = product.colors[0]?.name || 'Standard';
    addItem(product, defaultSize, defaultColor, 1);
    removeItem(product.id);
    showToast(`Transferred ${product.name} to shopping bag`, 'success');
  };

  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      {/* Header */}
      <section className="pt-4 pb-5 bg-white border-b border-[#141414]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Saved Wishlist' }]} className="mb-2" />
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
                Personal Archive
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl text-[#141414] font-normal">
                Saved Objects
              </h1>
            </div>
            {items.length > 0 && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#73706B]">
                  {items.length} {items.length === 1 ? 'object saved' : 'objects saved'}
                </span>
                <button
                  onClick={clearWishlist}
                  className="text-[#A7654A] underline hover:text-[#141414] transition-colors uppercase tracking-wider text-[10px]"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {items.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto space-y-3">
            <h3 className="font-serif text-xl text-[#141414]">No Objects in Wishlist</h3>
            <p className="text-xs text-[#73706B] font-light leading-relaxed">
              You haven't saved any garments yet. Click the heart icon on any product to preserve pieces for future orders.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#141414] text-white text-[11px] uppercase tracking-widest font-medium"
              >
                <span>Explore Wardrobe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {items.map((product) => (
              <div key={product.id} className="group relative flex flex-col justify-between">
                <div>
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE7DD] mb-2.5">
                    <Link to={`/product/${product.slug}`} className="block w-full h-full">
                      <ImageWithFallback
                        src={product.images[0]}
                        alt={product.name}
                        aspectRatioClass="w-full h-full"
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <button
                      onClick={() => {
                        removeItem(product.id);
                        showToast(`Removed ${product.name} from wishlist`, 'info');
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#73706B] hover:text-[#A7654A] transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-[#73706B]">
                      {product.category}
                    </p>
                    <Link to={`/product/${product.slug}`}>
                      <h4 className="font-serif text-sm text-[#141414] group-hover:text-[#A7654A] transition-colors font-normal line-clamp-1">
                        {product.name}
                      </h4>
                    </Link>
                    <p className="text-xs font-serif text-[#141414] font-medium pt-0.5">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>

                {/* Move to bag button */}
                <div className="mt-3">
                  <button
                    onClick={() => handleMoveToBag(product)}
                    className="w-full py-2 bg-[#141414] text-white hover:bg-[#A7654A] text-[10px] uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
