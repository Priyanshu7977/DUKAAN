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
      <HeroCampaign />

      <SignatureProducts />

      <EditorialSplitBanners />

      <FeaturedCategories />

      <LookbookMasonry />

      <BrandPhilosophy />

      <JournalPreview />
    </div>
  );
};
