import React from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { X, ArrowRight, Heart, Search, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, closeMobileMenu, openSearch } = useUIStore();
  const { isAuthenticated, user, openLoginModal } = useAuthStore();

  if (!isMobileMenuOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF9F6] overflow-y-auto">
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#141414]/8 bg-[#FAF8F5]">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="font-serif text-lg sm:text-xl tracking-[0.25em] text-[#141414] uppercase font-medium"
          >
            DUKAAN
          </Link>
          <button
            onClick={closeMobileMenu}
            className="p-1.5 text-[#141414] hover:text-[#A7654A] transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 border-b border-[#141414]/8 bg-[#FAF8F5]">
          <button
            onClick={() => {
              closeMobileMenu();
              openSearch();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#FAF9F6] border border-[#141414]/15 text-[#73706B] text-xs"
          >
            <span className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5" />
              <span>Search garments...</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold">Instant</span>
          </button>
        </div>

        <div className="px-5 py-6 flex-1">
          <ul className="space-y-4">
            {[
              { label: 'All Clothes', path: '/shop' },
              { label: '✨ Lookbook Styler', path: '/lookbook' },
              { label: "Men's Collection", path: '/men' },
              { label: "Women's Collection", path: '/women' },
              { label: 'Summer Collections', path: '/collections/solstice-edition' },
              { label: 'About Us', path: '/about' },
              { label: 'Style Stories & Journal', path: '/journal' },
              { label: 'Help & Contact', path: '/contact' },
            ].map((item, idx) => (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link
                  to={item.path}
                  onClick={closeMobileMenu}
                  className="font-serif text-xl text-[#141414] hover:text-[#A7654A] transition-colors flex items-center justify-between py-1"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#73706B]" />
                </Link>
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-[#141414]/8 space-y-3">
            {isAuthenticated ? (
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="flex items-center gap-2.5 text-xs text-[#141414] hover:text-[#A7654A] transition-colors font-semibold"
              >
                <div className="w-5 h-5 rounded-full bg-[#141414] text-white text-[10px] flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>My Profile ({user?.name})</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  closeMobileMenu();
                  openLoginModal();
                }}
                className="flex items-center gap-2.5 text-xs text-[#141414] hover:text-[#A7654A] transition-colors font-medium w-full text-left"
              >
                <User className="w-3.5 h-3.5 text-[#141414]" />
                <span>Sign In / Membership</span>
              </button>
            )}

            <Link
              to="/wishlist"
              onClick={closeMobileMenu}
              className="flex items-center gap-2.5 text-xs text-[#141414] hover:text-[#A7654A] transition-colors font-medium"
            >
              <Heart className="w-3.5 h-3.5 text-[#A7654A]" />
              <span>Saved Items (Wishlist)</span>
            </Link>
            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="block text-xs text-[#73706B] hover:text-[#141414] transition-colors"
            >
              Customer Support (Call / WhatsApp: +91 7977641125)
            </Link>
            <Link
              to="/faq"
              onClick={closeMobileMenu}
              className="block text-xs text-[#73706B] hover:text-[#141414] transition-colors"
            >
              Help & FAQs
            </Link>
          </div>
        </div>

        <div className="p-4 bg-[#FAF8F5] border-t border-[#141414]/8 text-[11px] text-[#73706B] flex items-center justify-between">
          <span>Free Delivery Across India on ₹1,999+</span>
          <span>© DUKAAN</span>
        </div>
      </div>
    </AnimatePresence>
  );
};
