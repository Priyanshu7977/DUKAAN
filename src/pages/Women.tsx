import React from 'react';
import { ShopCatalog } from '../components/shop/ShopCatalog';

export const Women: React.FC = () => {
  return (
    <ShopCatalog
      title="Women's Collection"
      subtitle="Effortless drape shirts, wide pleated trousers, and breathable linen sets designed for natural comfort and elegance."
      bannerImage="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/Amethyst-DrapeShirt_1.jpg?v=1790957049"
      initialGender="women"
      showGenderFilter={false}
      breadcrumbs={[{ label: 'Shop', href: '/shop' }, { label: 'Women' }]}
    />
  );
};
