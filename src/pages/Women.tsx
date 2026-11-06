import React from 'react';
import { ShopCatalog } from '../components/shop/ShopCatalog';

export const Women: React.FC = () => {
  return (
    <ShopCatalog
      title="Women's Collection"
      subtitle="Effortless drape shirts, wide pleated trousers, and breathable linen sets designed for natural comfort and elegance."
      bannerImage="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
      initialGender="women"
      showGenderFilter={false}
      breadcrumbs={[{ label: 'Shop', href: '/shop' }, { label: 'Women' }]}
    />
  );
};
