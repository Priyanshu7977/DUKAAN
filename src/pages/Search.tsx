import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Search as SearchIcon } from 'lucide-react';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  const filteredProducts = PRODUCTS.filter((product) => {
    const q = queryParam.toLowerCase().trim();
    if (!q) return true;

    const matchesQuery =
      (product.name || '').toLowerCase().includes(q) ||
      (product.subtitle || '').toLowerCase().includes(q) ||
      (product.description || '').toLowerCase().includes(q) ||
      (product.category || '').toLowerCase().includes(q) ||
      (product.collection || '').toLowerCase().includes(q) ||
      (product.tags || []).some((t) => (t || '').toLowerCase().includes(q));

    const matchesCategory =
      activeCategory === 'all' || product.category === activeCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      <section className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-[#FAF8F5] border-b border-[#141414]/8 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Search Wardrobe' }]} className="mb-3" />

          <div className="max-w-3xl space-y-2 mb-5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              Catalog Archive Search
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal tracking-tight leading-tight">
              Search Catalogue
            </h1>
          </div>

          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shirts, linen, trousers, corduroy, co-ords..."
              className="w-full bg-[#FAF9F6] border border-[#141414]/20 rounded-full py-3.5 pl-5 pr-14 text-sm text-[#141414] placeholder:text-[#73706B]/60 focus:outline-none focus:border-[#141414] shadow-xs transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#141414] text-white hover:bg-black transition-all flex items-center justify-center shadow-xs active:scale-95"
              aria-label="Search"
            >
              <SearchIcon className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#73706B] uppercase tracking-wider text-[10px] mr-1 font-semibold">Popular:</span>
            {['Linen', 'Corduroy', 'Trousers', 'Gauze', 'Pullover', 'Solstice', 'Co-ord'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchTerm(tag);
                  setSearchParams({ q: tag });
                }}
                className="h-8 px-4 rounded-full bg-[#FAF8F5] hover:bg-[#141414] hover:text-white transition-all text-xs text-[#141414] border border-[#141414]/15 inline-flex items-center justify-center font-medium shadow-xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-5 border-b border-[#141414]/8 gap-3 text-xs">
          <div>
            {queryParam ? (
              <p className="font-serif text-base sm:text-lg text-[#141414]">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'object' : 'objects'} for{' '}
                <span className="italic font-normal">"{queryParam}"</span>
              </p>
            ) : (
              <p className="font-serif text-base sm:text-lg text-[#141414]">
                Complete Catalogue ({PRODUCTS.length} Objects)
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'shirts', 'trousers', 'co-ords', 'outerwear', 'knitwear'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`h-9 px-3.5 text-[11px] uppercase tracking-wider transition-all rounded-sm whitespace-nowrap inline-flex items-center justify-center font-medium ${
                  activeCategory === cat
                    ? 'bg-[#141414] text-white shadow-xs'
                    : 'bg-white border border-[#141414]/10 text-[#73706B] hover:text-[#141414]'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-white p-8 border border-dashed border-[#141414]/15">
            <h3 className="font-serif text-lg text-[#141414]">No matches found</h3>
            <p className="text-xs text-[#73706B] max-w-sm mx-auto font-light">
              We couldn't locate any garments matching "{queryParam}". Try searching for linen, shirts, trousers, or explore our full collection.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchParams({});
                setActiveCategory('all');
              }}
              className="h-11 px-8 bg-[#141414] text-white text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#A7654A] transition-colors rounded-sm inline-flex items-center justify-center"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
