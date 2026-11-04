import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useUIStore } from '../../store/useUIStore';
import { Search, ShoppingBag, Heart, Menu } from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { cn } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const location = useLocation();

  const getItemCount = useCartStore((state) => state.getItemCount);
  const openCart = useCartStore((state) => state.openCart);
  const wishlistItems = useWishlistStore((state) => state.items);
  const openSearch = useUIStore((state) => state.openSearch);
  const openMobileMenu = useUIStore((state) => state.openMobileMenu);

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  // Close mega menu on route change
  useEffect(() => {
    setActiveMegaMenu(null);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Shop', to: '/shop', megaMenu: 'shop' },
    { label: 'Men', to: '/men', megaMenu: null },
    { label: 'Women', to: '/women', megaMenu: null },
    { label: 'Collections', to: '/collections/solstice-atelier', megaMenu: 'collections' },
    { label: 'Journal', to: '/journal', megaMenu: null },
  ];

  return (
    <div className="relative w-full max-w-6xl pointer-events-auto">
      <header
        className={cn(
          'w-full transition-all duration-200',
          'rounded-full bg-white/95 backdrop-blur-md border border-[#141414]/10 shadow-[0_4px_24px_rgba(0,0,0,0.06)]',
          'px-5 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between'
        )}
      >
        {/* FULL LEFT: Brand Wordmark Logo */}
        <div className="flex items-center shrink-0">
          <Link
            to="/"
            className="inline-block group"
            onMouseEnter={() => setActiveMegaMenu(null)}
          >
            <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] font-medium uppercase text-[#141414] group-hover:opacity-70 transition-opacity">
              DUKAAN
            </span>
          </Link>
        </div>

        {/* REST ON RIGHT SIDE: Desktop Nav Links + Actions + Mobile Hamburger */}
        <div className="flex items-center justify-end gap-3 sm:gap-6">
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[11px] uppercase tracking-[0.18em] font-medium">
            {navLinks.map((link) => (
              <div
                key={link.to}
                className="relative"
                onMouseEnter={() => setActiveMegaMenu(link.megaMenu)}
              >
                <Link
                  to={link.to}
                  className={cn(
                    'py-1 transition-colors duration-150',
                    location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
                      ? 'text-[#141414] font-semibold'
                      : 'text-[#73706B] hover:text-[#141414]'
                  )}
                >
                  {link.label}
                </Link>
                {(location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#141414]" />
                )}
              </div>
            ))}
          </nav>

          {/* Vertical Divider for Desktop */}
          <div className="hidden lg:block h-4 w-[1px] bg-[#141414]/15" />

          {/* Action Icons (Search, Wishlist, Bag, and Mobile Hamburger on far right) */}
          <div
            className="flex items-center gap-1.5 sm:gap-2.5"
            onMouseEnter={() => setActiveMegaMenu(null)}
          >
            {/* Search */}
            <button
              onClick={openSearch}
              className="p-1.5 text-[#141414] hover:text-[#A7654A] transition-colors"
              aria-label="Search garments"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-1.5 text-[#141414] hover:text-[#A7654A] transition-colors relative"
              aria-label="Saved wishlist"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#A7654A] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart / Bag */}
            <button
              onClick={openCart}
              className="p-1.5 text-[#141414] hover:text-[#A7654A] transition-colors relative flex items-center gap-1.5"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#141414] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-serif italic text-[#73706B] ml-0.5">
                Bag {cartCount > 0 && `(${cartCount})`}
              </span>
            </button>

            {/* Mobile Hamburger Menu on Full Right */}
            <button
              onClick={openMobileMenu}
              className="lg:hidden p-1.5 text-[#141414] hover:text-[#A7654A] transition-colors ml-0.5"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mega Menu Dropdown */}
      <MegaMenu
        isOpen={Boolean(activeMegaMenu)}
        activeMenu={activeMegaMenu}
        onClose={() => setActiveMegaMenu(null)}
      />
    </div>
  );
};
