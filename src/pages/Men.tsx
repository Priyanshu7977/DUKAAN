import React from 'react';
import { ShopCatalog } from '../components/shop/ShopCatalog';

export const Men: React.FC = () => {
  return (
    <ShopCatalog
      title="Men's Collection"
      subtitle="Clean lines, comfortable dropped shoulders, and pure breathable fabrics designed for everyday ease and understated style."
      bannerImage="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80"
      initialGender="men"
      showGenderFilter={false}
      breadcrumbs={[{ label: 'Shop', href: '/shop' }, { label: 'Men' }]}
    />
  );
};
