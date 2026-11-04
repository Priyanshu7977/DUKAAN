import React, { useState } from 'react';
import { cn } from '../../utils/formatters';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatioClass?: string;
  wrapperClassName?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=85&w=1200';

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'DUKAAN garment',
  className,
  wrapperClassName,
  aspectRatioClass = 'aspect-[3/4]',
  fallbackSrc = DEFAULT_FALLBACK,
  loading = 'lazy',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const finalSrc = hasError || !src ? fallbackSrc : src;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[#E8E3D9]',
        aspectRatioClass,
        wrapperClassName
      )}
    >
      {/* Skeleton / Placeholder shimmer */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#E8E3D9] animate-pulse pointer-events-none" />
      )}

      <img
        src={finalSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={cn(
          'w-full h-full object-cover object-center transition-all duration-700 ease-out',
          !isLoaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
          className
        )}
        {...props}
      />
    </div>
  );
};
