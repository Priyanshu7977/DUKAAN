import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import { Product, Category, Gender } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { X, ChevronDown, Check, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface ShopCatalogProps {
  title: string;
  subtitle: string;
  bannerImage?: string;
  initialGender?: Gender;
  initialCategory?: Category;
  showGenderFilter?: boolean;
  breadcrumbs: Array<{ label: string; href?: string }>;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({
  title,
  subtitle,
  bannerImage,
  initialGender = 'all',
  initialCategory = 'all',
  showGenderFilter = true,
  breadcrumbs,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramCategory = (searchParams.get('category') as Category) || initialCategory;
  const paramGender = (searchParams.get('gender') as Gender) || initialGender;
  const paramPage = parseInt(searchParams.get('page') || '1', 10);

  const [selectedCategory, setSelectedCategory] = useState<Category>(paramCategory);
  const [selectedGender, setSelectedGender] = useState<Gender>(paramGender);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(7500);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(isNaN(paramPage) || paramPage < 1 ? 1 : paramPage);
  const [pageSize, setPageSize] = useState<number>(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 16
  );
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') as Category);
    }
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    if (!isNaN(pageFromUrl) && pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedGender, selectedSizes, selectedColors, inStockOnly, priceRange, sortBy]);

  const allSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    PRODUCTS.forEach((p) => p.sizes.forEach((s) => sizeSet.add(s.size)));
    return Array.from(sizeSet);
  }, []);

  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    PRODUCTS.forEach((p) =>
      p.colors.forEach((c) => {
        if (!map.has(c.name)) map.set(c.name, c.hex);
      })
    );
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (selectedGender !== 'all') {
        if (product.gender !== selectedGender && product.gender !== 'unisex') {
          return false;
        }
      }
      if (product.price > priceRange) {
        return false;
      }
      if (inStockOnly) {
        const hasStock = product.sizes.some((s) => s.inStock);
        if (!hasStock) return false;
      }
      if (selectedSizes.length > 0) {
        const hasMatchingSize = product.sizes.some(
          (s) => s.inStock && selectedSizes.includes(s.size)
        );
        if (!hasMatchingSize) return false;
      }
      if (selectedColors.length > 0) {
        const hasMatchingColor = product.colors.some((c) =>
          selectedColors.includes(c.name)
        );
        if (!hasMatchingColor) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    selectedCategory,
    selectedGender,
    selectedSizes,
    selectedColors,
    inStockOnly,
    priceRange,
    sortBy,
  ]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    if (showGenderFilter) setSelectedGender('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setInStockOnly(false);
    setPriceRange(7500);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    (showGenderFilter && selectedGender !== 'all') ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    inStockOnly ||
    priceRange < 7500;

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === validPage) return;
    setCurrentPage(newPage);
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    if (gridTopRef.current) {
      const topOffset = gridTopRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (validPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', validPage - 1, validPage, validPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const categories: Array<{ id: Category; label: string }> = [
    { id: 'all', label: 'All Objects' },
    { id: 'shirts', label: 'Linen Shirts' },
    { id: 'trousers', label: 'Trousers' },
    { id: 'co-ords', label: 'Co-Ords' },
    { id: 'outerwear', label: 'Overshirts' },
    { id: 'knitwear', label: 'Knitwear' },
  ];

  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      <div className="pt-6 sm:pt-8 pb-6 sm:pb-8 border-b border-[#141414]/8 bg-[#FAF8F5] mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
            <Breadcrumbs items={breadcrumbs} className="min-w-0" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] border border-[#141414]/10 rounded-full text-[10px] sm:text-[11px] uppercase tracking-wider text-[#141414] font-semibold tabular-nums shrink-0 whitespace-nowrap self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
              <span className="whitespace-nowrap">{filteredProducts.length} {filteredProducts.length === 1 ? 'Garment' : 'Garments'}</span>
            </span>
          </div>
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              Wardrobe Curation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed pt-1">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-[#141414]/8 gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (cat.id === 'all') {
                    searchParams.delete('category');
                  } else {
                    searchParams.set('category', cat.id);
                  }
                  setSearchParams(searchParams);
                }}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#141414] text-white'
                    : 'bg-[#EAE7DF] text-[#73706B] hover:text-[#141414]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-[#141414]/20 bg-[#FAF8F5] text-[11px] uppercase tracking-wider text-[#141414] font-medium"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#A7654A]" />
              <span>Filters {hasActiveFilters && '• Active'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#73706B] uppercase tracking-wider text-[10px] hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-[#FAF8F5] border border-[#141414]/15 pl-3 pr-7 py-1 text-xs text-[#141414] font-medium focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Latest Release</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Alphabetical: A - Z</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#73706B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="py-2.5 flex flex-wrap items-center gap-1.5 border-b border-[#141414]/8 text-xs">
            <span className="text-[#73706B] uppercase tracking-wider text-[10px] mr-1">Active:</span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#141414] text-white text-[10px]">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')} aria-label="Remove category filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {showGenderFilter && selectedGender !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#141414] text-white text-[10px]">
                <span>Gender: {selectedGender}</span>
                <button onClick={() => setSelectedGender('all')} aria-label="Remove gender filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSizes.map((size) => (
              <span key={size} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#141414] text-white text-[10px]">
                <span>Size: {size}</span>
                <button onClick={() => toggleSize(size)} aria-label={`Remove size ${size}`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedColors.map((color) => (
              <span key={color} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#141414] text-white text-[10px]">
                <span>Color: {color}</span>
                <button onClick={() => toggleColor(color)} aria-label={`Remove color ${color}`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#141414] text-white text-[10px]">
                <span>Immediate Dispatch Only</span>
                <button onClick={() => setInStockOnly(false)} aria-label="Clear stock filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {priceRange < 7500 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#141414] text-white text-[10px]">
                <span>Up to {formatPrice(priceRange)}</span>
                <button onClick={() => setPriceRange(7500)} aria-label="Clear price filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-[#A7654A] underline hover:text-[#141414] uppercase text-[10px] font-semibold ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 pt-4">
          <aside className="hidden lg:block lg:col-span-3 space-y-5 pr-4 border-r border-[#141414]/8 text-xs">
            {showGenderFilter && (
              <div className="space-y-2">
                <span className="font-serif text-xs uppercase tracking-wider text-[#141414] block font-semibold">Silhouette</span>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'All Silhouettes' },
                    { id: 'men', label: 'Men' },
                    { id: 'women', label: 'Women' },
                    { id: 'unisex', label: 'Unisex Foundation' },
                  ].map((g) => (
                    <label key={g.id} className="flex items-center gap-2 cursor-pointer text-[#73706B] hover:text-[#141414]">
                      <input
                        type="radio"
                        name="genderFilter"
                        checked={selectedGender === g.id}
                        onChange={() => setSelectedGender(g.id as any)}
                        className="accent-[#141414]"
                      />
                      <span className="text-[11px]">{g.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 pt-4 border-t border-[#141414]/8">
              <div className="flex justify-between items-center">
                <span className="font-serif text-xs uppercase tracking-wider text-[#141414] font-semibold">Max Price</span>
                <span className="text-xs font-semibold tabular-nums text-[#141414]">{formatPrice(priceRange)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="7500"
                step="250"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#141414] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#73706B]">
                <span>₹1,000</span>
                <span>₹7,500+</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#141414]/8">
              <span className="font-serif text-xs uppercase tracking-wider text-[#141414] block font-semibold">Sizes</span>
              <div className="grid grid-cols-4 gap-1">
                {allSizes.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`h-9 text-xs font-medium tabular-nums border transition-all flex items-center justify-center ${
                        isSelected
                          ? 'border-[#141414] bg-[#141414] text-white'
                          : 'border-[#141414]/15 text-[#141414] hover:border-[#141414] bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#141414]/8">
              <span className="font-serif text-xs uppercase tracking-wider text-[#141414] block font-semibold">Color Palette</span>
              <div className="space-y-1">
                {allColors.map((color) => {
                  const isSelected = selectedColors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className="flex items-center justify-between w-full text-left py-0.5 group"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/15 inline-block shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className={`text-[11px] ${isSelected ? 'font-semibold text-[#141414]' : 'text-[#73706B] group-hover:text-[#141414]'}`}>
                          {color.name}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3 h-3 text-[#A7654A]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#141414]/8">
              <label className="flex items-center gap-2 cursor-pointer text-[#141414]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#141414]"
                />
                <span className="text-[11px]">Immediate Dispatch Only</span>
              </label>
            </div>
          </aside>

          <main className="lg:col-span-9" ref={gridTopRef}>
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center space-y-2 bg-white p-6 border border-dashed border-[#141414]/15">
                <h3 className="font-serif text-lg text-[#141414]">No pieces found</h3>
                <p className="text-xs text-[#73706B] max-w-sm mx-auto font-light">
                  There are no garments matching your selected filter combination.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-1.5 bg-[#141414] text-white text-[10px] uppercase tracking-widest font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-5 gap-y-6 sm:gap-y-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="mt-8 sm:mt-10 pt-5 border-t border-[#141414]/8 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#73706B]">
                    Showing <strong className="text-[#141414] font-medium">{startIndex + 1}–{endIndex}</strong> of{' '}
                    <strong className="text-[#141414] font-medium">{filteredProducts.length}</strong> garments
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePageChange(validPage - 1)}
                        disabled={validPage === 1}
                        aria-label="Previous Page"
                        className="w-9 h-9 sm:w-10 sm:h-10 border border-[#141414]/15 flex items-center justify-center text-[#141414] hover:bg-[#141414] hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      {getPageNumbers().map((p, idx) => (
                        typeof p === 'number' ? (
                          <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 text-xs font-semibold tabular-nums transition-colors flex items-center justify-center ${
                              validPage === p
                                ? 'bg-[#141414] text-white font-semibold'
                                : 'border border-[#141414]/15 text-[#141414] hover:bg-[#EAE7DF]'
                            }`}
                          >
                            {p}
                          </button>
                        ) : (
                          <span key={`dots-${idx}`} className="w-4 text-center text-[#73706B] text-xs font-semibold tabular-nums">
                            ...
                          </span>
                        )
                      ))}

                      <button
                        onClick={() => handlePageChange(validPage + 1)}
                        disabled={validPage === totalPages}
                        aria-label="Next Page"
                        className="w-9 h-9 sm:w-10 sm:h-10 border border-[#141414]/15 flex items-center justify-center text-[#141414] hover:bg-[#141414] hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-[#73706B]">
                    <span className="uppercase tracking-wider text-[10px]">Show:</span>
                    {[8, 16, 32].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setPageSize(size);
                          setCurrentPage(1);
                        }}
                        className={`h-9 px-3 text-xs font-medium tabular-nums transition-colors flex items-center justify-center ${
                          pageSize === size
                            ? 'bg-[#141414] text-white font-medium'
                            : 'bg-white border border-[#141414]/15 text-[#73706B] hover:text-[#141414]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs bg-[#FAF9F6] h-full flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#141414]/10">
              <h3 className="font-serif text-base text-[#141414]">Filter Pieces</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-[#141414]"
                aria-label="Close mobile filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 flex-1 text-xs">
              <div>
                <span className="font-serif text-xs text-[#141414] block mb-1.5 font-semibold">Category</span>
                <div className="flex flex-wrap gap-1">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-2.5 py-1 text-[11px] uppercase ${
                        selectedCategory === c.id ? 'bg-[#141414] text-white' : 'bg-[#EAE7DF] text-[#73706B]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-xs text-[#141414] font-semibold">Max Price</span>
                  <span className="text-xs font-semibold tabular-nums">{formatPrice(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="7500"
                  step="250"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#141414]"
                />
              </div>

              <div>
                <span className="font-serif text-xs text-[#141414] block mb-1.5 font-semibold">Sizes</span>
                <div className="grid grid-cols-4 gap-1">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`h-10 text-xs font-medium tabular-nums border flex items-center justify-center ${
                        selectedSizes.includes(size)
                          ? 'bg-[#141414] text-white border-[#141414]'
                          : 'border-[#141414]/20 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#141414]"
                />
                <span className="text-xs">Immediate Dispatch Only</span>
              </label>
            </div>

            <div className="pt-3 border-t border-[#141414]/10 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="w-1/2 py-2 border border-[#141414]/20 text-[11px] uppercase tracking-wider text-[#73706B]"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-2 bg-[#141414] text-white text-[11px] uppercase tracking-wider font-medium"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
