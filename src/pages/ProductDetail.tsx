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
import { Heart, Plus, Minus, Check, ShieldCheck, Truck, RotateCcw, Sparkles, MapPin, Star, ThumbsUp, X, Sparkle } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { FitAdvisorModal } from '../components/product/FitAdvisorModal';
import { useInventoryStore } from '../store/useInventoryStore';

const RECENTLY_VIEWED_KEY = 'dukaan_recently_viewed';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const product = PRODUCTS.find((p) => p.slug === slug);

  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { showToast, openSizeGuide, setHasStickyBottomBar } = useUIStore();
  const getEffectiveSizes = useInventoryStore((state) => state.getEffectiveSizes);
  const syncWithFirestore = useInventoryStore((state) => state.syncWithFirestore);
  const inventoryOverrides = useInventoryStore((state) => state.overrides);

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isFitAdvisorOpen, setIsFitAdvisorOpen] = useState<boolean>(false);

  useEffect(() => {
    syncWithFirestore();
  }, [syncWithFirestore]);

  const effectiveSizes = product ? getEffectiveSizes(product.id, product.sizes) : [];
  const selectedSizeData = effectiveSizes.find((s) => s.size === selectedSize);
  const isSelectedSizeAvailable = Boolean(
    selectedSizeData &&
      selectedSizeData.inStock &&
      (selectedSizeData.quantityRemaining === undefined || selectedSizeData.quantityRemaining > 0)
  );
  const availableStockUnits = selectedSizeData?.quantityRemaining ?? 10;

  const ctaRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      name: 'Arjun Mehta',
      city: 'Mumbai',
      rating: 5,
      date: '2 days ago',
      size: 'L',
      fit: 'True to Size',
      comment: 'The organic linen texture has exceptional drape. Cut allows relaxed breathing room in Indian humidity without looking baggy.',
    },
    {
      id: 'rev-2',
      name: 'Rhea Kapoor',
      city: 'Bengaluru',
      rating: 5,
      date: '1 week ago',
      size: 'M',
      fit: 'True to Size',
      comment: 'Incredible handfeel. Hand-stitched collar details and natural buttons make it feel bespoke. Exactly what I was looking for.',
    },
    {
      id: 'rev-3',
      name: 'Kabir Singhania',
      city: 'Delhi NCR',
      rating: 4,
      date: '2 weeks ago',
      size: 'XL',
      fit: 'Runs Slightly Relaxed',
      comment: 'Premium craftsmanship. Delivered cleanly in the linen dust bag. Fits slightly relaxed which gives it a modern architectural flow.',
    },
  ]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewFit, setNewReviewFit] = useState('True to Size');
  const [newReviewComment, setNewReviewComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;
    const newRev = {
      id: `rev-${Date.now()}`,
      name: newReviewName.trim(),
      city: newReviewCity.trim() || 'Verified Patron',
      rating: newReviewRating,
      date: 'Just now',
      size: selectedSize || 'M',
      fit: newReviewFit,
      comment: newReviewComment.trim(),
    };
    setReviews([newRev, ...reviews]);
    setShowReviewModal(false);
    setNewReviewName('');
    setNewReviewCity('');
    setNewReviewComment('');
    showToast('Thank you! Your verified review has been published.', 'success');
  };

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
    }
    return null;
  });
  const [pincodeError, setPincodeError] = useState('');

  function calculateDelivery(pin: string) {
    const deliveryDate = new Date();
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
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!ctaRef.current) return;
      const rect = ctaRef.current.getBoundingClientRect();
      const isVisible = rect.bottom < 60;
      setShowStickyBar(isVisible);
      setHasStickyBottomBar(isVisible);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      setHasStickyBottomBar(false);
    };
  }, [setHasStickyBottomBar]);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      const eff = getEffectiveSizes(product.id, product.sizes);
      const firstAvailableSize =
        eff.find((s) => s.inStock && (s.quantityRemaining === undefined || s.quantityRemaining > 0))?.size ||
        eff[0]?.size ||
        '';
      setSelectedSize(firstAvailableSize);
      setQuantity(1);
      setActiveImageIdx(0);

      try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        let existing: string[] = [];
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) existing = parsed;
        }
        const updated = [product.id, ...existing.filter((id) => typeof id === 'string' && id !== product.id)].slice(0, 5);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));

        const recentProducts = PRODUCTS.filter((p) => updated.includes(p.id) && p.id !== product.id);
        setRecentlyViewed(recentProducts);
      } catch (e) {
      }
    }
  }, [product, slug, inventoryOverrides]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-[#FAF9F6]">
        <h2 className="font-serif text-2xl text-[#141414]">Garment Not Located</h2>
        <p className="text-xs text-[#73706B] mt-1 mb-4">
          This piece may have retired to our permanent archive.
        </p>
        <Link
          to="/shop"
          className="h-12 px-8 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold inline-flex items-center justify-center rounded-lg shadow-md transition-all active:scale-[0.99]"
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
    if (!isSelectedSizeAvailable) {
      showToast(`Size ${selectedSize} is currently sold out. Please select an available size.`, 'error');
      return;
    }
    const currentItem = items.find(
      (it) => it.product.id === product.id && it.selectedSize === selectedSize && it.selectedColor === selectedColor
    );
    const inBag = currentItem?.quantity || 0;
    if (inBag >= 5) {
      showToast('Maximum 5 pieces allowed per garment. You already have 5 in your bag.', 'info');
      return;
    }
    if (inBag + quantity > availableStockUnits) {
      showToast(`Only ${availableStockUnits} units available in size ${selectedSize}.`, 'info');
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
    if (!isSelectedSizeAvailable) {
      showToast(`Size ${selectedSize} is currently sold out. Please select an available size.`, 'error');
      return;
    }
    const currentItem = items.find(
      (it) => it.product.id === product.id && it.selectedSize === selectedSize && it.selectedColor === selectedColor
    );
    const inBag = currentItem?.quantity || 0;
    if (inBag + quantity > availableStockUnits) {
      showToast(`Only ${availableStockUnits} units available in size ${selectedSize}.`, 'info');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-2">
        <Breadcrumbs
          items={[
            { label: 'Wardrobe', href: '/shop' },
            { label: product.collection, href: `/collections/${product.collectionSlug}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-2.5 sm:gap-3">
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
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
                    />
                  </button>
                ))}
              </div>
            )}

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
                    <span className="text-xs text-[#73706B] line-through tabular-nums">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider text-[#73706B] bg-[#EAE7DF] px-2 py-0.5 font-medium rounded-xs">
                    Duties Included (DDP)
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
                {product.description}
              </p>

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

              <div className="pt-3 border-t border-[#141414]/8">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="uppercase tracking-wider text-[#73706B] text-[10px] font-medium">
                    Select Size
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsFitAdvisorOpen(true)}
                      className="text-[#141414] underline uppercase tracking-wider text-[10px] font-semibold hover:text-[#A7654A] transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#A7654A]" />
                      <span>Fit Advisor</span>
                    </button>
                    <button
                      type="button"
                      onClick={openSizeGuide}
                      className="text-[#A7654A] underline uppercase tracking-wider text-[10px] font-medium hover:text-[#141414] transition-colors"
                    >
                      Size Guide
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {effectiveSizes.map((s) => {
                    const isSelected = selectedSize === s.size;
                    const isAvailable = s.inStock && (s.quantityRemaining === undefined || s.quantityRemaining > 0);
                    return (
                      <button
                        key={s.size}
                        disabled={!isAvailable}
                        onClick={() => {
                          setSelectedSize(s.size);
                          setQuantity(1);
                        }}
                        className={`h-11 text-xs uppercase font-medium tracking-wider border transition-all flex flex-col items-center justify-center rounded-lg ${
                          !isAvailable
                            ? 'border-black/10 text-black/25 line-through cursor-not-allowed bg-black/5'
                            : isSelected
                            ? 'border-[#141414] bg-[#141414] text-white shadow-xs'
                            : 'border-[#141414]/15 text-[#141414] hover:border-[#141414] bg-white'
                        }`}
                      >
                        <span>{s.size}</span>
                        {isAvailable && s.quantityRemaining !== undefined && s.quantityRemaining <= 5 && (
                          <span
                            className={`text-[8px] leading-none mt-0.5 font-semibold ${
                              isSelected ? 'text-amber-200' : 'text-amber-700'
                            }`}
                          >
                            {s.quantityRemaining} left
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedSizeData && (
                  <div>
                    {!isSelectedSizeAvailable ? (
                      <p className="text-[10px] text-red-600 font-medium mt-1.5 flex items-center gap-1">
                        <span>Size {selectedSize} is currently sold out. Inquire via Concierge for bespoke atelier queue.</span>
                      </p>
                    ) : selectedSizeData.quantityRemaining !== undefined && selectedSizeData.quantityRemaining <= 5 ? (
                      <p className="text-[10px] text-[#A7654A] font-medium mt-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>
                          Low batch: Only {selectedSizeData.quantityRemaining} units left in size {selectedSize}.
                        </span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
                        <span>In Stock • Ready to dispatch from atelier</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div ref={ctaRef} className="pt-3 border-t border-[#141414]/8 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-medium">
                    Qty
                  </span>
                  <div className="flex items-center border border-[#141414]/15 bg-white h-11 px-2 rounded-lg">
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
                      onClick={() => {
                        const maxLimit = Math.min(5, availableStockUnits);
                        if (quantity >= maxLimit) {
                          showToast(`Maximum ${maxLimit} units available for size ${selectedSize}.`, 'info');
                          return;
                        }
                        setQuantity((q) => Math.min(maxLimit, q + 1));
                      }}
                      className={`w-7 h-full flex items-center justify-center transition-colors ${
                        quantity >= Math.min(5, availableStockUnits)
                          ? 'opacity-30 cursor-not-allowed text-[#73706B]'
                          : 'hover:text-[#A7654A]'
                      }`}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {quantity >= Math.min(5, availableStockUnits) && (
                    <span className="text-[10px] text-[#A7654A] font-medium">
                      Max {Math.min(5, availableStockUnits)} units per order
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleAddToBag}
                    disabled={!isSelectedSizeAvailable}
                    className={`w-full h-12 text-[11px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] rounded-lg font-semibold ${
                      !isSelectedSizeAvailable
                        ? 'bg-[#141414]/30 text-white/60 cursor-not-allowed'
                        : 'bg-[#141414] hover:bg-black text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{!isSelectedSizeAvailable ? 'Size Sold Out' : 'Add to Bag'}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!isSelectedSizeAvailable}
                    className={`w-full h-12 border text-[11px] uppercase tracking-[0.2em] font-medium flex items-center justify-center transition-all active:scale-[0.99] rounded-lg font-semibold ${
                      !isSelectedSizeAvailable
                        ? 'border-[#141414]/20 text-[#141414]/30 cursor-not-allowed bg-transparent'
                        : 'border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] bg-white'
                    }`}
                  >
                    <span>{!isSelectedSizeAvailable ? 'Sold Out' : 'Instant Checkout'}</span>
                  </button>
                </div>
              </div>

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
                    id="product-pincode-input"
                    name="pincode"
                    autoComplete="postal-code"
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

            <div className="mt-4 pt-2">
              <Accordion items={accordionItems} defaultOpenId="composition" />
            </div>
          </div>
        </div>
      </div>

      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-[#141414]/8 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#141414]/10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-1">
                Patron Impressions
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#141414] font-medium">
                Client Reviews & Sizing Insights
              </h3>
              <p className="text-xs text-[#73706B] font-light mt-1">
                Real feedback from verified purchasers on material drape, tactile comfort, and fit accuracy.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#141414] mt-0.5 block">
                  4.9 out of 5.0 ({reviews.length + 45} Verified Patrons)
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="px-5 py-3 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md transition-all active:scale-[0.99] shrink-0"
              >
                Write a Review
              </button>
            </div>
          </div>

          
          <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-xl border border-[#141414]/10 space-y-3 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-semibold text-[#141414]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A7654A]" />
                <span>True to Size Rating</span>
              </span>
              <span className="text-emerald-800 font-semibold text-[11px] sm:text-xs">92% say: Fits True to Size</span>
            </div>

            <div className="space-y-2 text-[#73706B]">
              <div className="h-2 w-full bg-[#141414]/10 rounded-full overflow-hidden flex">
                <div style={{ width: '4%' }} className="bg-amber-600 h-full" title="Runs Small (4%)" />
                <div style={{ width: '92%' }} className="bg-emerald-700 h-full" title="True to Size (92%)" />
                <div style={{ width: '4%' }} className="bg-blue-600 h-full" title="Runs Relaxed (4%)" />
              </div>
              <div className="flex items-center justify-between gap-1 pt-0.5 text-[9px] sm:text-[10px] uppercase font-medium">
                <div className="text-left shrink-0">
                  <span className="text-[#73706B]">Runs Small</span>
                  <span className="text-[#73706B]/70 ml-1 font-normal">(4%)</span>
                </div>
                <div className="text-center font-bold text-[#141414] px-1 truncate">
                  <span className="text-[#141414]">True to Size</span>
                  <span className="text-emerald-700 ml-1 font-semibold">(92%)</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[#73706B]">Runs Relaxed</span>
                  <span className="text-[#73706B]/70 ml-1 font-normal">(4%)</span>
                </div>
              </div>
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-[#FAF9F6] rounded-xl border border-[#141414]/8 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#73706B]">{rev.date}</span>
                </div>

                <p className="text-xs text-[#141414] font-light leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-2 border-t border-[#141414]/8 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-semibold text-[#141414] block">{rev.name}</span>
                    <span className="text-[#73706B] text-[10px]">{rev.city}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span>Verified Buyer</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF9F6] border border-[#141414]/15 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-white border-b border-[#141414]/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
                  Client Feedback
                </span>
                <h3 className="font-serif text-lg text-[#141414] font-medium">
                  Review {product.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 text-[#73706B] hover:text-[#141414] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewReviewRating(st)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          st <= newReviewRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    id="review-name-input"
                    name="author"
                    required
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                    placeholder="e.g. Priyanshu S."
                    className="w-full h-11 px-3 bg-white border border-[#141414]/15 rounded-xl text-xs focus:outline-none focus:border-[#141414]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    id="review-city-input"
                    name="city"
                    value={newReviewCity}
                    onChange={(e) => setNewReviewCity(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full h-11 px-3 bg-white border border-[#141414]/15 rounded-xl text-xs focus:outline-none focus:border-[#141414]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                  How Does It Fit?
                </label>
                <select
                  id="review-fit-select"
                  name="fit"
                  value={newReviewFit}
                  onChange={(e) => setNewReviewFit(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-[#141414]/15 rounded-xl text-xs focus:outline-none focus:border-[#141414]"
                >
                  <option value="True to Size">True to Size (Recommended)</option>
                  <option value="Runs Slightly Small">Runs Slightly Small</option>
                  <option value="Runs Slightly Large">Runs Slightly Large / Relaxed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#73706B] font-semibold mb-1">
                  Your Thoughts & Material Review *
                </label>
                <textarea
                  id="review-comment-input"
                  name="comment"
                  required
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Describe the fabric touch, comfort, and silhouette..."
                  className="w-full p-3 bg-white border border-[#141414]/15 rounded-xl text-xs focus:outline-none focus:border-[#141414]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md transition-all active:scale-[0.99]"
              >
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}

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

      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <div className="mb-4 pb-2 border-b border-[#141414]/8">
            <span className="text-[10px] uppercase tracking-widest text-[#73706B] font-semibold block">
              Wardrobe Memory
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

      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#141414]/8 px-4 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+0.6rem)] sm:hidden transition-transform duration-300 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={product.images[0]}
              alt={product.name}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-10 h-10 object-cover rounded-lg bg-[#FAF8F5] border border-[#141414]/10 shrink-0"
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
            disabled={!isSelectedSizeAvailable}
            className={`h-11 px-5 text-[11px] uppercase tracking-wider font-semibold rounded-lg shrink-0 flex items-center gap-1.5 shadow-sm active:scale-98 transition-all ${
              !isSelectedSizeAvailable
                ? 'bg-[#141414]/30 text-white/60 cursor-not-allowed'
                : 'bg-[#141414] hover:bg-black text-white'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{!isSelectedSizeAvailable ? 'Sold Out' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>

      <FitAdvisorModal
        isOpen={isFitAdvisorOpen}
        onClose={() => setIsFitAdvisorOpen(false)}
        productName={product.name}
        availableSizes={effectiveSizes}
        onSelectSize={(sz) => setSelectedSize(sz)}
      />
    </div>
  );
};
