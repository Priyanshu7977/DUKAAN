import React from 'react';
import { ShopCatalog } from '../components/shop/ShopCatalog';

export const Women: React.FC = () => {
  return (
    <ShopCatalog
      title="Women's Collection"
      subtitle="Effortless drape shirts, wide pleated trousers, and breathable linen sets designed for natural comfort and elegance."
      initialGender="women"
      showGenderFilter={false}
      breadcrumbs={[{ label: 'Shop', href: '/shop' }, { label: "Women's Collection" }]}
    />
  );
};
