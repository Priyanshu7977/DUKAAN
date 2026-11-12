import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import { COLLECTIONS } from '../../data/collections';

const BASE_URL = 'https://dukaan-j5l5.vercel.app';

export const DocumentTitle: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'DUKAAN — Objects of Everyday Expression';
    let description = 'Contemporary unisex clothing crafted with pure organic linen, breathable cotton, and timeless silhouettes.';

    if (path === '/') {
      title = 'DUKAAN — Objects of Everyday Expression';
      description = 'Contemporary unisex clothing engineered with pure European linen, soft cotton gauze, and timeless comfortable silhouettes.';
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
      description = col ? col.description : 'Curated seasonal collection crafted with pure natural fibers.';
    } else if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '').split('/')[0];
      const prod = PRODUCTS.find((p) => p.slug === slug);
      title = prod ? `${prod.name} — DUKAAN` : 'Garment Detail — DUKAAN';
      description = prod ? prod.description : 'Pure natural fiber garment designed for comfort and longevity.';
    } else if (path.startsWith('/track')) {
      title = 'Live Order Tracking & Shipment — DUKAAN';
      description = 'Track your DUKAAN garment shipment in real time across India.';
    } else if (path === '/returns') {
      title = '7-Day Easy Returns & Size Exchanges — DUKAAN';
      description = 'Complimentary doorstep size exchanges and 7-day hassle-free returns.';
    } else if (path === '/shipping') {
      title = 'Nationwide Shipping & Delivery Policy — DUKAAN';
      description = 'Free express air delivery across India on orders above ₹1,999.';
    } else if (path === '/contact') {
      title = 'Concierge & Client Care — DUKAAN';
      description = 'Reach DUKAAN concierge for sizing consultations and bespoke inquiries.';
    } else if (path === '/about') {
      title = 'Brand Philosophy & Materiality — DUKAAN';
      description = 'Slow fashion, European flax traceability, and deconstructed tailoring.';
    } else if (path === '/journal' || path === '/blog') {
      title = 'Editorial Journal & Essays — DUKAAN';
      description = 'Curated investigations into textile botany, architectural silhouette geometries, and linen care manuals.';
    } else if (path === '/profile') {
      title = 'Patron Profile & Orders — DUKAAN';
    } else if (path === '/checkout') {
      title = 'Secure Express Checkout — DUKAAN';
    } else if (path === '/wishlist') {
      title = 'Curated Wishlist — DUKAAN';
    } else if (path === '/faq') {
      title = 'Frequently Asked Questions — DUKAAN';
      description = 'Answers about sizing, European flax linen, UPI payments, and shipping.';
    }

    document.title = title;

    const fullUrl = `${BASE_URL}${path}`;

    const setMeta = (selector: string, attr: string, val: string, createName?: string) => {
      let el = document.querySelector(selector);
      if (!el && createName) {
        el = document.createElement('meta');
        if (createName.startsWith('og:')) {
          el.setAttribute('property', createName);
        } else {
          el.setAttribute('name', createName);
        }
        document.head.appendChild(el);
      }
      if (el) el.setAttribute(attr, val);
    };

    setMeta('meta[property="og:title"]', 'content', title, 'og:title');
    setMeta('meta[name="twitter:title"]', 'content', title, 'twitter:title');
    setMeta('meta[name="description"]', 'content', description, 'description');
    setMeta('meta[property="og:description"]', 'content', description, 'og:description');
    setMeta('meta[name="twitter:description"]', 'content', description, 'twitter:description');
    setMeta('meta[property="og:url"]', 'content', fullUrl, 'og:url');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);
  }, [location.pathname]);

  return null;
};
