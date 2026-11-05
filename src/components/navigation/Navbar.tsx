import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Search, ShoppingBag, Heart, Menu, User } from 'lucide-react';
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
  const { isAuthenticated, user, openLoginModal } = useAuthStore();

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    setActiveMegaMenu(null);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Shop', to: '/shop', megaMenu: 'shop' },
    { label: 'Men', to: '/men', megaMenu: null },
    { label: 'Women', to: '/women', megaMenu: null },
    { label: 'Collections', to: '/collections/solstice-atelier', megaMenu: 'collections' },
    { label: 'Track', to: '/track', megaMenu: null },
    { label: 'Journal', to: '/journal', megaMenu: null },
  ];

  return (
    <div className="relative w-full max-w-6xl pointer-events-auto">
      <header
        className={cn(
          'w-full transition-all duration-200',
          'rounded-full bg-[#FAF9F6]/95 backdrop-blur-md border border-[#141414]/12 shadow-[0_4px_24px_rgba(0,0,0,0.06)]',
          'px-4 sm:px-8 h-12 sm:h-14 flex items-center justify-between'
        )}
      >
        <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="inline-block group"
              onMouseEnter={() => setActiveMegaMenu(null)}
            >
              <span className="font-serif text-lg sm:text-2xl tracking-[0.2em] sm:tracking-[0.25em] font-medium uppercase text-[#141414] group-hover:opacity-70 transition-opacity">
                DUKAAN
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-6">
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

            <div className="hidden lg:block h-4 w-[1px] bg-[#141414]/15" />

            <div
              className="flex items-center gap-1.5 sm:gap-2.5"
              onMouseEnter={() => setActiveMegaMenu(null)}
            >
              <button
                onClick={openSearch}
                className="p-1.5 text-[#141414] hover:text-[#A7654A] transition-colors"
                aria-label="Search garments"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
              </button>

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

              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="p-1.5 text-[#141414] hover:text-[#A7654A] transition-colors relative flex items-center justify-center group"
                  aria-label={`Account of ${user?.name || 'User'}`}
                  title={`Profile: ${user?.name}`}
                >
                  <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#141414] text-white text-[10px] font-medium flex items-center justify-center group-hover:bg-[#A7654A] transition-colors shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </Link>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="p-1.5 text-[#141414] hover:text-[#A7654A] transition-colors"
                  aria-label="Sign in to your account"
                  title="Sign In / Register"
                >
                  <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
                </button>
              )}

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

      <MegaMenu
        isOpen={activeMegaMenu !== null}
        onClose={() => setActiveMegaMenu(null)}
        activeMenu={activeMegaMenu}
      />
    </div>
  );
};
