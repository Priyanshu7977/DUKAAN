import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  showQuickView?: boolean;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  columns = 3,
  showQuickView = true,
  emptyMessage = 'No garments match your selected criteria.',
}) => {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <h3 className="font-serif text-2xl text-[#211E1A] mb-2">No Pieces Found</h3>
        <p className="text-sm text-[#777765] max-w-md mx-auto font-light">
          {emptyMessage}
        </p>
      </div>
    );
  }

  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${colClass} gap-x-6 gap-y-12`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showQuickView={showQuickView}
        />
      ))}
    </div>
  );
};
