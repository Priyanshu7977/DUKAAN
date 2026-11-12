import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OnboardingModal } from './components/common/OnboardingModal';
import { initAuthRealtimeListener } from './store/useAuthStore';
import { DocumentTitle } from './components/common/DocumentTitle';

import { Home } from './pages/Home';

const Shop = lazy(() => import('./pages/Shop').then((m) => ({ default: m.Shop })));
const Men = lazy(() => import('./pages/Men').then((m) => ({ default: m.Men })));
const Women = lazy(() => import('./pages/Women').then((m) => ({ default: m.Women })));
const CollectionDetail = lazy(() => import('./pages/CollectionDetail').then((m) => ({ default: m.CollectionDetail })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then((m) => ({ default: m.ProductDetail })));
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Journal = lazy(() => import('./pages/Journal').then((m) => ({ default: m.Journal })));
const JournalArticle = lazy(() => import('./pages/JournalArticle').then((m) => ({ default: m.JournalArticle })));
const Search = lazy(() => import('./pages/Search').then((m) => ({ default: m.Search })));
const Wishlist = lazy(() => import('./pages/Wishlist').then((m) => ({ default: m.Wishlist })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const FAQ = lazy(() => import('./pages/FAQ').then((m) => ({ default: m.FAQ })));
const Shipping = lazy(() => import('./pages/Shipping').then((m) => ({ default: m.Shipping })));
const Returns = lazy(() => import('./pages/Returns').then((m) => ({ default: m.Returns })));
const Privacy = lazy(() => import('./pages/Privacy').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then((m) => ({ default: m.Terms })));
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })));
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })));
const OrderTracking = lazy(() => import('./pages/OrderTracking').then((m) => ({ default: m.OrderTracking })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

const RouteFallback: React.FC = () => (
  <div className="w-full min-h-[50vh] flex items-center justify-center bg-[#FAF9F6]">
    <div className="w-5 h-5 rounded-full border-2 border-[#141414] border-t-transparent animate-spin" />
  </div>
);

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
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
