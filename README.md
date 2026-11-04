# DUKAAN — Contemporary Luxury Wardrobe

> Production-grade editorial luxury fashion e-commerce experience featuring 180+ curated products, full-bleed campaign banners, Indian currency (₹), and dedicated checkout.

---

## Brand Identity & Aesthetic

- **Brand**: DUKAAN
- **Tagline**: Objects of Everyday Expression.
- **Positioning**: Contemporary unisex clothing crafted from breathable natural fabrics: linen, double-crinkle cotton, and corduroy.
- **Currency**: Indian Rupees (₹ INR)
- **Contact**: +91 7977641125 • priyanshubipin2006@gmail.com
- **Design Tokens**:
  - Warm Studio Background: `#FAF9F6` / `#F3EEEB`
  - Deep Charcoal: `#141414`
  - Warm Terracotta: `#A7654A`
  - Editorial Serifs: `Bodoni Moda`
  - Sans-Serif: `DM Sans`

---

## Architecture & Routes

| Route | Page / Experience | Key Functionality |
|---|---|---|
| `/` | **Homepage** | Floating capsule navbar, full-bleed paired campaign hero, trust badges, curated best-sellers, category gateway, campaign lookbook, brand philosophy, and journal dispatches |
| `/shop` | **Shop Wardrobe** | 180+ products, real-time category filters, silhouette filters, color swatches, price filtering, sorting, and pagination |
| `/men` | **Men's Collection** | Tailored edit of masculine dropped-shoulder shirts, relaxed trousers, and corduroy pull-ons |
| `/women` | **Women's Collection** | Fluid silhouettes, botanical sets, and breathable resort wear |
| `/collections/:slug` | **Collection Lookbook** | Curated seasonal capsule lookbooks with full ensembles and look cards |
| `/product/:slug` | **Product Details** | High-res gallery, size matrix, live stock status, express checkout, sizing guide modal |
| `/checkout` | **Dedicated Checkout** | Distraction-free full-page checkout with COD (+₹99 extra charge) and Prepaid options |
| `/journal` | **Journal / Gazette** | Editorial dispatches on raw European flax, unstructured tailoring, and coastal aesthetics |
| `/wishlist` | **Wishlist** | LocalStorage-persisted saved pieces with one-click transfer to cart |

---

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: Zustand
- **Animations**: Framer Motion + GSAP
- **Icons**: Lucide React
- **Routing**: React Router v6

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```
