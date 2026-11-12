import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OnboardingModal } from './components/common/OnboardingModal';
import { initAuthRealtimeListener } from './store/useAuthStore';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Men } from './pages/Men';
import { Women } from './pages/Women';
import { CollectionDetail } from './pages/CollectionDetail';
import { ProductDetail } from './pages/ProductDetail';
import { About } from './pages/About';
import { Journal } from './pages/Journal';
import { JournalArticle } from './pages/JournalArticle';
import { Search } from './pages/Search';
import { Wishlist } from './pages/Wishlist';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Shipping } from './pages/Shipping';
import { Returns } from './pages/Returns';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';
import { OrderTracking } from './pages/OrderTracking';
import { NotFound } from './pages/NotFound';

import { DocumentTitle } from './components/common/DocumentTitle';

export const App: React.FC = () => {
  useEffect(() => {
    const unsubscribe = initAuthRealtimeListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <DocumentTitle />
        <OnboardingModal />
        <Routes>
          <Route path="checkout" element={<Checkout />} />

          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="men" element={<Men />} />
            <Route path="women" element={<Women />} />
            <Route path="collections/:slug" element={<CollectionDetail />} />
            <Route path="product/:slug" element={<ProductDetail />} />
            <Route path="about" element={<About />} />
            <Route path="journal" element={<Journal />} />
            <Route path="journal/:slug" element={<JournalArticle />} />
            <Route path="blog" element={<Journal />} />
            <Route path="blog/:slug" element={<JournalArticle />} />
            <Route path="search" element={<Search />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="returns" element={<Returns />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="profile" element={<Profile />} />
            <Route path="track" element={<OrderTracking />} />
            <Route path="track/:orderId" element={<OrderTracking />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
