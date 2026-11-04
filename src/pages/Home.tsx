import React from 'react';
import { HeroCampaign } from '../sections/HeroCampaign';
import { SignatureProducts } from '../sections/SignatureProducts';
import { EditorialSplitBanners } from '../sections/EditorialSplitBanners';
import { FeaturedCategories } from '../sections/FeaturedCategories';
import { LookbookMasonry } from '../sections/LookbookMasonry';
import { BrandPhilosophy } from '../sections/BrandPhilosophy';
import { JournalPreview } from '../sections/JournalPreview';

export const Home: React.FC = () => {
  return (
    <div className="w-full">
      {/* 1. Pure Full-Bleed Video Hero (Unobstructed cinematic video with subtle bottom CTA) */}
      <HeroCampaign />

      {/* 2. Curated Wardrobe Objects (Real 5feet11 Best Sellers with category tabs) */}
      <SignatureProducts />

      {/* 4. Editorial Split Banners (The Vacation Edit & Architectural Linen Luxe) */}
      <EditorialSplitBanners />

      {/* 5. Wardrobe Categories Gateway (5-column interactive grid) */}
      <FeaturedCategories />

      {/* 6. Campaign Lookbook Studies & Ensembles */}
      <LookbookMasonry />

      {/* 7. Brand Foundations (Flax materiality & geometry) */}
      <BrandPhilosophy />

      {/* 8. Gazette & Editorial Journal Dispatches */}
      <JournalPreview />
    </div>
  );
};
