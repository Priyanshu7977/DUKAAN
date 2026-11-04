import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useUIStore } from '../../store/useUIStore';
import { formatPrice } from '../../utils/formatters';
import { Heart, Eye } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  aspectRatio?: string;
  showQuickView?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectRatio = 'aspect-[3/4]',
  showQuickView = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { openQuickView, showToast } = useUIStore();

  const isFavorited = isInWishlist(product.id);
  const hasSecondaryImage = product.images.length > 1;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    showToast(
      added ? `Saved ${product.name} to wishlist` : `Removed ${product.name} from wishlist`,
      'info'
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Container - Sharp, Clean 5feet11 Style */}
      <div className={`relative overflow-hidden bg-[#F0ECE1] ${aspectRatio}`}>
        {/* Subtle Discount / Sale Badge if applicable */}
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#141414] text-[#FAF9F6] text-[9px] uppercase tracking-wider px-2 py-0.5 font-medium">
            Sale
          </span>
        )}

        {/* Wishlist Button - Clean Minimal Floating Heart */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#141414] hover:text-[#A7654A] transition-all opacity-90 group-hover:opacity-100 hover:scale-105 shadow-xs"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-[#A7654A] text-[#A7654A]' : 'text-[#141414]'
            }`}
          />
        </button>

        {/* Primary & Secondary Alternate Image Swap on Hover */}
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            aspectRatioClass="w-full h-full"
            className={`object-cover w-full h-full transition-opacity duration-500 ease-out ${
              isHovered && hasSecondaryImage ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {hasSecondaryImage && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
            />
          )}
        </Link>

        {/* Quick View Button on Desktop Hover */}
        {showQuickView && (
          <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
            <button
              onClick={handleQuickView}
              className="w-full h-10 bg-white/95 hover:bg-[#141414] hover:text-white text-[#141414] text-[10px] uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm rounded-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* Meta details - Clean & Minimal Typography */}
      <div className="pt-2.5 flex flex-col justify-between flex-1">
        <div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif text-[13px] sm:text-[14px] text-[#141414] group-hover:text-[#A7654A] transition-colors leading-snug line-clamp-1 font-normal">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] text-[#73706B] font-light line-clamp-1 mt-0.5">
            {product.subtitle || product.collection}
          </p>
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[13px] sm:text-[14px] font-medium text-[#141414]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-[#73706B] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
