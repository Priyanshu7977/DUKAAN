import React from 'react';
import { ShopCatalog } from '../components/shop/ShopCatalog';

export const Shop: React.FC = () => {
  return (
    <ShopCatalog
      title="All Clothes"
      subtitle="Explore our complete collection. Crafted with 100% pure European linen, soft cotton gauze, and comfortable relaxed fits."
      breadcrumbs={[{ label: 'Shop', href: '/shop' }, { label: 'All Clothes' }]}
    />
  );
};
