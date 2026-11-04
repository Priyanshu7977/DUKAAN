import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-[#EAE7DF] rounded-sm ${className}`}
      aria-hidden="true"
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Thumbnail Aspect Ratio 3:4 */}
      <Skeleton className="aspect-[3/4] w-full" />
      {/* Title */}
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      {/* Price */}
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};
