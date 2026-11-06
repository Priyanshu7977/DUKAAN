import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import { COLLECTIONS } from '../../data/collections';

export const DocumentTitle: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'DUKAAN — Objects of Everyday Expression';
    let description = 'Contemporary unisex clothing crafted with pure organic linen, breathable cotton, and timeless silhouettes.';

    if (path === '/') {
      title = 'DUKAAN — Objects of Everyday Expression';
    } else if (path === '/shop') {
      title = 'Complete Wardrobe — DUKAAN';
      description = 'Explore foundational organic shirts, pleated trousers, and co-ords.';
    } else if (path === '/men') {
      title = "Men's Edit — DUKAAN";
      description = 'Architectural unisex shirts, relaxed trousers, and pure linen shirts.';
    } else if (path === '/women') {
      title = "Women's Edit — DUKAAN";
      description = 'Effortless fluid dresses, oversized linen shirts, and breathable gauze tops.';
    } else if (path.startsWith('/collections/')) {
      const slug = path.replace('/collections/', '').split('/')[0];
      const col = COLLECTIONS.find((c) => c.slug === slug);
      title = col ? `${col.title} Edition — DUKAAN` : 'Curated Collection — DUKAAN';
    } else if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '').split('/')[0];
      const prod = PRODUCTS.find((p) => p.slug === slug);
      title = prod ? `${prod.name} — DUKAAN` : 'Garment Detail — DUKAAN';
    } else if (path.startsWith('/track')) {
      title = 'Live Order Tracking & Shipment — DUKAAN';
    } else if (path === '/returns') {
      title = '7-Day Easy Returns & Size Exchanges — DUKAAN';
    } else if (path === '/shipping') {
      title = 'Nationwide Shipping & Delivery Policy — DUKAAN';
    } else if (path === '/contact') {
      title = 'Concierge & Client Care — DUKAAN';
    } else if (path === '/about') {
      title = 'Brand Philosophy & Materiality — DUKAAN';
    } else if (path === '/journal') {
      title = 'Editorial Journal & Essays — DUKAAN';
    } else if (path === '/profile') {
      title = 'Patron Profile & Orders — DUKAAN';
    } else if (path === '/checkout') {
      title = 'Secure Express Checkout — DUKAAN';
    } else if (path === '/wishlist') {
      title = 'Curated Wishlist — DUKAAN';
    } else if (path === '/faq') {
      title = 'Frequently Asked Questions — DUKAAN';
    }

    document.title = title;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
  }, [location.pathname]);

  return null;
};
