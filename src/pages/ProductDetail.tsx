import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useUIStore } from '../store/useUIStore';
import { formatPrice } from '../utils/formatters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Accordion } from '../components/common/Accordion';
import { ProductCard } from '../components/product/ProductCard';
import { Heart, Plus, Minus, Check, ShieldCheck, Truck, RotateCcw, Sparkles, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

const RECENTLY_VIEWED_KEY = 'forme_recently_viewed';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const product = PRODUCTS.find((p) => p.slug === slug);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { showToast, openSizeGuide } = useUIStore();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Sticky Mobile Bottom Bar
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Delivery Estimator State
  const [pincode, setPincode] = useState(() => {
    try {
      return localStorage.getItem('dukaan_pincode') || '';
    } catch {
      return '';
    }
  });
  const [deliveryInfo, setDeliveryInfo] = useState<{
    dateStr: string;
    cityStr: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('dukaan_pincode');
      if (saved && saved.length === 6) {
        return calculateDelivery(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [pincodeError, setPincodeError] = useState('');

  function calculateDelivery(pin: string) {
    const deliveryDate = new Date();
    // Fast 2-3 business days delivery
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const dateStr = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    let cityStr = 'India Express Hub';
    if (pin.startsWith('40') || pin.startsWith('41')) cityStr = 'Mumbai / Pune Region';
    else if (pin.startsWith('11') || pin.startsWith('12') || pin.startsWith('20')) cityStr = 'Delhi NCR Region';
    else if (pin.startsWith('56')) cityStr = 'Bengaluru Metro';
    else if (pin.startsWith('50')) cityStr = 'Hyderabad Metro';
    else if (pin.startsWith('60')) cityStr = 'Chennai Metro';
    else if (pin.startsWith('70')) cityStr = 'Kolkata Metro';
    else if (pin.startsWith('38')) cityStr = 'Ahmedabad';

    return { dateStr, cityStr };
  }

  const handleCheckPincode = (inputPin?: string) => {
    const pin = (inputPin || pincode).trim();
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code');
      setDeliveryInfo(null);
      return;
    }
    setPincodeError('');
    const info = calculateDelivery(pin);
    setDeliveryInfo(info);
    try {
      localStorage.setItem('dukaan_pincode', pin);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!ctaRef.current) return;
      const rect = ctaRef.current.getBoundingClientRect();
      setShowStickyBar(rect.bottom < 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      const firstAvailableSize = product.sizes.find((s) => s.inStock)?.size || product.sizes[0]?.size || '';
      setSelectedSize(firstAvailableSize);
      setQuantity(1);
      setActiveImageIdx(0);

      try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        const existing: string[] = stored ? JSON.parse(stored) : [];
        const updated = [product.id, ...existing.filter((id) => id !== product.id)].slice(0, 5);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));

        const recentProducts = PRODUCTS.filter((p) => updated.includes(p.id) && p.id !== product.id);
        setRecentlyViewed(recentProducts);
      } catch (e) {
        // ignore
      }
    }
  }, [product, slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-[#FAF9F6]">
        <h2 className="font-serif text-2xl text-[#141414]">Garment Not Located</h2>
        <p className="text-xs text-[#73706B] mt-1 mb-4">
          This piece may have retired to our permanent atelier archive.
        </p>
        <Link
          to="/shop"
          className="px-5 py-2 bg-[#141414] text-white text-[11px] uppercase tracking-widest inline-block"
        >
          Explore All Objects
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const relatedProducts = PRODUCTS.filter(
    (p) => (p.category === product.category || p.collectionSlug === product.collectionSlug) && p.id !== product.id
  ).slice(0, 4);

  const handleAddToBag = () => {
    if (!selectedSize) {
      showToast('Please select a size', 'error');
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    showToast(`Added ${quantity} × ${product.name} (${selectedSize}) to bag`, 'success');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      showToast('Please select a size first', 'error');
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleWishlistClick = () => {
    const added = toggleWishlist(product);
    showToast(
      added ? `Saved ${product.name} to wishlist` : `Removed ${product.name} from wishlist`,
      'info'
    );
  };

  const accordionItems = [
    {
      id: 'composition',
      title: 'Material & Craft Composition',
      content: (
        <div className="space-y-1.5 text-xs text-[#73706B]">
          <p className="font-medium text-[#141414]">{product.details.composition}</p>
          <p>{product.details.origin}</p>
          <p>Fabric density: {product.details.weight}</p>
        </div>
      ),
    },
    {
      id: 'fit',
      title: 'Fit & Volumetric Silhouette',
      content: (
        <div className="space-y-1.5 text-xs text-[#73706B]">
          <p>{product.details.fit}</p>
          <p>
            Unisex relaxed cut designed with architectural ease. For a closer fit, select one size smaller than your usual sizing.
          </p>
        </div>
      ),
    },
    {
      id: 'care',
      title: 'Artisanal Garment Care',
      content: (
        <div className="space-y-1.5 text-xs text-[#73706B]">
          <p>{product.details.washCare}</p>
          <p>
            Natural plant fibres soften and develop personal character with thoughtful handling. We recommend storing on contoured cedar hangers.
          </p>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Free Delivery Across India & Easy 7-Day Returns',
      content: (
        <div className="space-y-1.5 text-xs text-[#73706B]">
          <p>• Free express delivery across India on all orders above ₹1,999.</p>
          <p>• Fast dispatch within 24 to 48 hours via BlueDart and Delhivery Express.</p>
          <p>• Cash on Delivery (COD) and easy 7-day doorstep size exchange available.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      {/* Top Breadcrumb Header - Tight */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-2">
        <Breadcrumbs
          items={[
            { label: 'Wardrobe', href: '/shop' },
            { label: product.collection, href: `/collections/${product.collectionSlug}` },
            { label: product.name },
          ]}
        />
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-2.5 sm:gap-3">
            {/* Thumbnail Column */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-1.5 shrink-0 overflow-x-auto md:overflow-y-auto max-h-[580px] scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-12 h-16 sm:w-16 sm:h-20 overflow-hidden bg-[#ECE7DD] border transition-all shrink-0 ${
                      activeImageIdx === idx
                        ? 'border-[#141414] opacity-100 ring-1 ring-[#141414]'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`View garment angle ${idx + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image - Sharp 5feet11 rectangle */}
            <div className="flex-1 relative bg-[#ECE7DD] overflow-hidden group aspect-[3/4]">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="absolute top-2.5 left-2.5 z-10 bg-[#141414] text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-medium">
                  Sale
                </span>
              )}

              <button
                onClick={handleWishlistClick}
                className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#141414] hover:text-[#A7654A] transition-all"
                aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    isFavorited ? 'fill-[#A7654A] text-[#A7654A]' : 'text-[#141414]'
                  }`}
                />
              </button>

              <ImageWithFallback
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                aspectRatioClass="w-full h-full"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Commerce Actions (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-16 space-y-4">
            <div className="space-y-3.5">
              <div>
                <Link
                  to={`/collections/${product.collectionSlug}`}
                  className="text-[10px] uppercase tracking-[0.22em] text-[#A7654A] font-semibold hover:underline block"
                >
                  {product.collection}
                </Link>

                <h1 className="font-serif text-2xl sm:text-3xl text-[#141414] mt-1 font-normal leading-snug">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2.5 mt-2">
                  <span className="text-lg font-medium text-[#141414]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-[#73706B] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider text-[#73706B] bg-[#EAE7DF] px-2 py-0.5 font-medium rounded-xs">
                    Duties Included (DDP)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="pt-3 border-t border-[#141414]/8">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="uppercase tracking-wider text-[#73706B] text-[10px] font-medium">
                    Shade: <strong className="text-[#141414] font-medium">{selectedColor}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color.name);
                        if (color.imageIndex !== undefined && product.images[color.imageIndex]) {
                          setActiveImageIdx(color.imageIndex);
                        }
                      }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColor === color.name
                          ? 'border-[#141414] scale-110 shadow-xs'
                          : 'border-transparent hover:border-black/20'
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
              <div className="pt-3 border-t border-[#141414]/8">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="uppercase tracking-wider text-[#73706B] text-[10px] font-medium">
                    Select Size
                  </span>
                  <button
                    onClick={openSizeGuide}
                    className="text-[#A7654A] underline uppercase tracking-wider text-[10px] font-medium hover:text-[#141414] transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s.size;
                    return (
                      <button
                        key={s.size}
                        disabled={!s.inStock}
                        onClick={() => setSelectedSize(s.size)}
                        className={`h-11 text-xs uppercase font-medium tracking-wider border transition-all flex items-center justify-center rounded-sm ${
                          !s.inStock
                            ? 'border-black/10 text-black/25 line-through cursor-not-allowed bg-black/5'
                            : isSelected
                            ? 'border-[#141414] bg-[#141414] text-white shadow-xs'
                            : 'border-[#141414]/15 text-[#141414] hover:border-[#141414] bg-white'
                        }`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
                {product.sizes.find((s) => s.size === selectedSize && s.quantityRemaining) && (
                  <p className="text-[10px] text-[#A7654A] font-medium mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>
                      Low batch: Only {product.sizes.find((s) => s.size === selectedSize)?.quantityRemaining} left in size {selectedSize}.
                    </span>
                  </p>
                )}
              </div>

              {/* Quantity Selector & Purchase Actions */}
              <div ref={ctaRef} className="pt-3 border-t border-[#141414]/8 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-medium">
                    Qty
                  </span>
                  <div className="flex items-center border border-[#141414]/15 bg-white h-11 px-2 rounded-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-full flex items-center justify-center hover:text-[#A7654A] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#141414] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-full flex items-center justify-center hover:text-[#A7654A] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleAddToBag}
                    className="w-full h-12 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] rounded-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full h-12 border border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] text-[11px] uppercase tracking-[0.2em] font-medium flex items-center justify-center transition-all active:scale-[0.99] rounded-sm bg-white"
                  >
                    <span>Instant Checkout</span>
                  </button>
                </div>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-[#141414]/8 text-[10px] text-[#73706B]">
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#A7654A] shrink-0" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 text-[#A7654A] shrink-0" />
                  <span>7-Day Returns</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#A7654A] shrink-0" />
                  <span>100% Pure Fabric</span>
                </div>
              </div>

              {/* Live Indian PIN Code Delivery Estimator */}
              <div className="pt-3.5 border-t border-[#141414]/8 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-semibold block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A7654A]" />
                  <span>Delivery Speed & COD Check</span>
                </span>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCheckPincode();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setPincode(val);
                      setPincodeError('');
                      if (val.length === 6) {
                        handleCheckPincode(val);
                      }
                    }}
                    placeholder="Enter 6-digit PIN code"
                    className="flex-1 h-11 px-3 text-xs bg-white border border-[#141414]/15 rounded-sm focus:outline-none focus:border-[#141414] tabular-nums font-medium"
                  />
                  <button
                    type="submit"
                    className="h-11 px-5 bg-[#141414] text-white text-[11px] uppercase tracking-wider font-semibold hover:bg-[#A7654A] transition-colors rounded-sm shrink-0"
                  >
                    Check
                  </button>
                </form>

                {pincodeError && (
                  <p className="text-[11px] text-red-600 font-light">{pincodeError}</p>
                )}

                {deliveryInfo && (
                  <div className="p-3 bg-[#FAF8F5] border border-[#141414]/10 rounded-sm text-xs space-y-1">
                    <p className="text-[#141414] font-medium flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Estimated delivery by <strong className="text-emerald-800 font-semibold">{deliveryInfo.dateStr}</strong></span>
                    </p>
                    <p className="text-[11px] text-[#73706B]">
                      Express dispatch to <strong>{deliveryInfo.cityStr}</strong> ({pincode}) • Cash on Delivery (COD) & Doorstep Size Exchange available.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Accordion Specs */}
            <div className="mt-4 pt-2">
              <Accordion items={accordionItems} defaultOpenId="composition" />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
          <div className="flex justify-between items-end mb-4 pb-2 border-b border-[#141414]/8">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block">
                Harmonious Pairings
              </span>
              <h2 className="font-serif text-lg sm:text-xl text-[#141414]">
                Complete the Silhouette
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-[11px] uppercase tracking-wider text-[#73706B] hover:text-[#141414] transition-colors"
            >
              View Full Wardrobe
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products Section */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <div className="mb-4 pb-2 border-b border-[#141414]/8">
            <span className="text-[10px] uppercase tracking-widest text-[#73706B] font-semibold block">
              Atelier Memory
            </span>
            <h3 className="font-serif text-base sm:text-lg text-[#141414]">
              Recently Inspected
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Add to Bag Dock (Appears when scrolled past main purchase buttons) */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#141414]/10 px-4 py-2.5 sm:hidden transition-transform duration-300 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] safe-area-bottom ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-10 h-10 object-cover rounded-sm bg-[#FAF8F5] border border-[#141414]/10 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-serif text-[#141414] truncate font-medium">{product.name}</p>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-semibold text-[#141414] tabular-nums">{formatPrice(product.price)}</span>
                <span className="text-[#73706B]">•</span>
                <span className="text-[10px] uppercase font-semibold text-[#141414] bg-[#FAF8F5] px-1.5 py-0.5 border border-[#141414]/10 rounded-xs tabular-nums">
                  {selectedSize || 'Select Size'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToBag}
            className="h-11 px-5 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-wider font-semibold rounded-sm shrink-0 flex items-center gap-1.5 shadow-sm active:scale-98 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
};
