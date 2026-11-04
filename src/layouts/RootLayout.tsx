import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SiteHeader } from '../components/navigation/SiteHeader';
import { Footer } from '../components/footer/Footer';
import { SearchOverlay } from '../components/navigation/SearchOverlay';
import { MobileMenu } from '../components/navigation/MobileMenu';
import { CartDrawer } from '../components/cart/CartDrawer';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { ToastContainer } from '../components/common/ToastContainer';
import { cn } from '../utils/formatters';

export const RootLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#141414] relative selection:bg-[#141414] selection:text-white">
      {/* Sleek Floating Capsule Header (Zero unnecessary bars) */}
      <SiteHeader />

      {/* Main Body with clean, uniform padding */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          isHomePage ? 'pt-0' : 'pt-[64px] sm:pt-[70px]'
        )}
      >
        <Outlet />
      </main>

      <Footer />

      {/* Global Modals & Overlays */}
      <SearchOverlay />
      <MobileMenu />
      <CartDrawer />
      <QuickViewModal />
      <SizeGuideModal />
      <ToastContainer />
    </div>
  );
};
