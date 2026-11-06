import React, { useState } from 'react';
import { FAQ_DATA } from '../data/faq';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Accordion } from '../components/common/Accordion';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterQuery, setFilterQuery] = useState<string>('');

  const categories = [
    'all',
    'Orders & Delivery',
    'Sizes & Fit',
    'Fabrics & Washing',
    'Returns & Exchanges',
    'Payments',
  ];

  const filteredItems = FAQ_DATA.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      !filterQuery ||
      item.question.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const accordionItems = filteredItems.map((item, index) => ({
    id: `faq-${index}`,
    title: item.question,
    subtitle: item.category,
    content: item.answer,
  }));

  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      <section className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-[#FAF8F5] border-b border-[#141414]/8 mb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Help & FAQs' }]} className="mb-3" />
          <div className="max-w-3xl space-y-2 mb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              Client Care
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal tracking-tight leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
              Everything you need to know about delivery across India, sizes & fit, natural fabrics, payments, and 7-day easy returns.
            </p>
          </div>

          <div className="relative max-w-xl">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter topics (e.g., shipping, linen, returns, sizes)..."
              className="w-full bg-[#FAF9F6] border border-[#141414]/15 rounded-full py-2.5 pl-4 pr-10 text-xs sm:text-sm text-[#141414] placeholder:text-[#73706B]/50 focus:outline-none focus:border-[#141414] shadow-xs"
            />
            <Search className="w-4 h-4 text-[#73706B] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`h-9 px-4 text-xs uppercase tracking-wider font-semibold rounded-full transition-all flex items-center justify-center ${
                  activeCategory === cat
                    ? 'bg-[#141414] text-white shadow-xs ring-1 ring-[#141414]'
                    : 'bg-[#FAF8F5] border border-[#141414]/15 text-[#73706B] hover:text-[#141414] hover:border-[#141414]/40'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-[#FAF8F5] p-6 border border-[#141414]/8">
            <h3 className="font-serif text-lg text-[#141414]">No entries located</h3>
            <p className="text-xs text-[#73706B] max-w-sm mx-auto font-light">
              We couldn't locate any questions matching "{filterQuery}". Please clear your search or message our concierge.
            </p>
            <button
              onClick={() => {
                setFilterQuery('');
                setActiveCategory('all');
              }}
              className="h-10 px-6 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bg-[#FAF8F5] border border-[#141414]/8 p-4 sm:p-6 rounded-2xl shadow-xs">
            <Accordion items={accordionItems} />
          </div>
        )}

        <div className="mt-8 p-5 bg-[#FAF8F5] border border-[#141414]/8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div>
            <h4 className="font-serif text-base text-[#141414]">Have an unlisted inquiry?</h4>
            <p className="text-xs text-[#73706B] font-light">
              Our concierge desk is at your disposal 24/7 for bespoke styling and orders: +91 7977641125 / priyanshubipin2006@gmail.com
            </p>
          </div>
          <Link
            to="/contact"
            className="h-12 px-8 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-md flex items-center justify-center shrink-0 transition-all active:scale-[0.99]"
          >
            Connect With Concierge
          </Link>
        </div>
      </section>
    </div>
  );
};
