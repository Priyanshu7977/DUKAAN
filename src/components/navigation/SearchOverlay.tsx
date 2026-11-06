import React, { useState, useEffect, useRef } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { AnimatePresence } from 'framer-motion';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      return;
    }
    const filtered = PRODUCTS.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(trimmed) ||
        (p.subtitle || '').toLowerCase().includes(trimmed) ||
        (p.category || '').toLowerCase().includes(trimmed) ||
        (p.tags || []).some((t) => (t || '').toLowerCase().includes(trimmed)) ||
        (p.collection || '').toLowerCase().includes(trimmed)
    );
    setResults(filtered);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      closeSearch();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
  };

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-start bg-white/98 backdrop-blur-md">
        <div className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between border-b border-[#141414]/8">
          <span className="font-serif text-lg tracking-[0.25em] text-[#141414] uppercase font-medium">
            DUKAAN
          </span>
          <button
            onClick={closeSearch}
            className="p-1.5 text-[#141414] hover:text-[#A7654A] transition-colors flex items-center gap-1.5 text-xs uppercase tracking-widest"
            aria-label="Close search overlay"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-w-4xl w-full mx-auto px-6 pt-10 pb-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              ref={inputRef}
              type="text"
              id="global-search-input"
              name="query"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search garments, textures, collections..."
              className="w-full bg-transparent border-b-2 border-[#141414]/20 pb-3 text-xl sm:text-3xl font-serif text-[#141414] placeholder:text-[#73706B]/50 focus:outline-none focus:border-[#141414] transition-colors"
            />
            <button
              type="submit"
              className="absolute right-0 bottom-3 text-[#141414] hover:text-[#A7654A] transition-colors p-1"
              aria-label="Submit search"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>

          {!query && (
            <div className="mt-6">
              <span className="text-[10px] uppercase tracking-widest text-[#73706B] block mb-2 font-medium">
                Suggested Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Linen Shirt',
                  'Pleated Trouser',
                  'Co-ord Set',
                  'Overshirt',
                  'Knitwear',
                  'Solstice Edition',
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleTagClick(item)}
                    className="px-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#141414]/10 hover:bg-[#141414] hover:text-white transition-all text-[#141414]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && (
            <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#141414]/8 text-xs uppercase tracking-widest text-[#73706B]">
                <span>Results ({results.length})</span>
                {results.length > 0 && (
                  <Link
                    to={`/search?q=${encodeURIComponent(query)}`}
                    onClick={closeSearch}
                    className="hover:text-[#141414] flex items-center gap-1 font-medium"
                  >
                    <span>View all in search page</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {results.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-serif text-lg text-[#141414]">No pieces found for "{query}"</p>
                  <p className="text-xs text-[#73706B] mt-1.5 font-light">
                    Try searching for linen, shirts, trousers, knitwear or co-ords.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  {results.slice(0, 6).map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={closeSearch}
                      className="group flex gap-3 items-center bg-[#FAF9F6] border border-[#141414]/8 p-2.5 hover:border-[#141414]/20 transition-all"
                    >
                      <div className="w-14 h-18 shrink-0 overflow-hidden bg-[#ECE7DD]">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase tracking-widest text-[#A7654A] font-medium block truncate">
                          {product.category}
                        </span>
                        <h4 className="font-serif text-xs text-[#141414] group-hover:text-[#A7654A] transition-colors truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-[#141414] font-medium mt-0.5">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
