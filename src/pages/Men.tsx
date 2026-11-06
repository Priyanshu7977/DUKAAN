import React from 'react';
import { ShopCatalog } from '../components/shop/ShopCatalog';

export const Men: React.FC = () => {
  return (
    <ShopCatalog
      title="Men's Collection"
      subtitle="Clean lines, comfortable dropped shoulders, and pure breathable fabrics designed for everyday ease and understated style."
      bannerImage="https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE733-scaled.jpg?v=1740307050"
      initialGender="men"
      showGenderFilter={false}
      breadcrumbs={[{ label: 'Shop', href: '/shop' }, { label: 'Men' }]}
    />
  );
};
