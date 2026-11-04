import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowRight } from 'lucide-react';

export const SignatureProducts: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'shirts' | 'co-ords' | 'trousers' | 'knitwear'>('all');

  const displayedItems = useMemo(() => {
    if (filter === 'all') {
      return PRODUCTS.slice(0, 8);
    }
    const filtered = PRODUCTS.filter((p) => p.category === filter);
    return filtered.length > 0 ? filtered.slice(0, 8) : PRODUCTS.slice(0, 8);
  }, [filter]);

  const tabs: Array<{ id: 'all' | 'shirts' | 'co-ords' | 'trousers' | 'knitwear'; label: string }> = [
    { id: 'all', label: 'All Items' },
    { id: 'shirts', label: 'Shirts' },
    { id: 'co-ords', label: 'Co-Ord Sets' },
    { id: 'trousers', label: 'Trousers' },
    { id: 'knitwear', label: 'Knitwear' },
  ];

  return (
    <section className="py-8 sm:py-12 bg-[#FAF9F6] border-b border-[#141414]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-7 gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
              Customer Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#141414] font-normal">
              Best Selling Styles
            </h2>
          </div>

          {/* Minimal Luxury Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`h-10 px-5 text-xs uppercase tracking-wider font-semibold rounded-full transition-all flex items-center justify-center ${
                  filter === tab.id
                    ? 'bg-[#141414] text-white shadow-sm ring-1 ring-[#141414]'
                    : 'bg-white border border-[#141414]/15 text-[#73706B] hover:text-[#141414] hover:border-[#141414]/40 hover:bg-[#FAF9F6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Desktop / 2-Column Mobile Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-6 sm:gap-y-8">
          {displayedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2.5 h-12 px-9 border-2 border-[#141414] hover:bg-[#141414] hover:text-white text-[#141414] text-xs uppercase tracking-[0.2em] font-semibold transition-all rounded-lg shadow-sm active:scale-[0.99]"
          >
            <span>View All {PRODUCTS.length} Wardrobe Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
