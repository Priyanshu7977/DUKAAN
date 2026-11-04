import React from 'react';
import { ShopCatalog } from '../components/shop/ShopCatalog';

export const Men: React.FC = () => {
  return (
    <ShopCatalog
      title="Men's Collection"
      subtitle="Clean lines, comfortable dropped shoulders, and pure breathable fabrics designed for everyday ease and understated style."
      initialGender="men"
      showGenderFilter={false}
      breadcrumbs={[{ label: 'Shop', href: '/shop' }, { label: "Men's Collection" }]}
    />
  );
};
