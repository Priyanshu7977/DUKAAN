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
      {/* Header */}
      <section className="pt-4 pb-5 bg-white border-b border-[#141414]/8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={[{ label: 'Help & FAQs' }]} className="mb-2" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
            Help Center
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl text-[#141414] font-normal">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-[#73706B] max-w-xl font-light mt-1 leading-relaxed">
            Everything you need to know about delivery across India, sizes & fit, natural fabrics, payments, and 7-day easy returns.
          </p>

          {/* Search filter input */}
          <div className="mt-3.5 relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter topics (e.g., shipping, linen, returns, sizes)..."
              className="w-full bg-[#FAF9F6] border border-[#141414]/15 py-2 pl-3.5 pr-10 text-xs sm:text-sm text-[#141414] placeholder:text-[#73706B]/50 focus:outline-none focus:border-[#141414]"
            />
            <Search className="w-4 h-4 text-[#73706B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#141414] text-white'
                    : 'bg-[#EAE7DF] text-[#73706B] hover:text-[#141414]'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Accordion List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-white p-6 border border-[#141414]/8">
            <h3 className="font-serif text-lg text-[#141414]">No entries located</h3>
            <p className="text-xs text-[#73706B] max-w-sm mx-auto font-light">
              We couldn't locate any questions matching "{filterQuery}". Please clear your search or message our concierge.
            </p>
            <button
              onClick={() => {
                setFilterQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 bg-[#141414] text-white text-[10px] uppercase tracking-widest font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bg-white border border-[#141414]/8 p-4 sm:p-6">
            <Accordion items={accordionItems} />
          </div>
        )}

        {/* Concierge Banner */}
        <div className="mt-8 p-5 bg-white border border-[#141414]/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-base text-[#141414]">Have an unlisted inquiry?</h4>
            <p className="text-xs text-[#73706B] font-light">
              Our concierge desk is at your disposal 24/7 for bespoke styling and orders: +91 7977641125 / priyanshubipin2006@gmail.com
            </p>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-[#141414] text-white text-[10px] uppercase tracking-widest font-medium hover:bg-[#A7654A] transition-colors shrink-0"
          >
            Connect With Concierge
          </Link>
        </div>
      </section>
    </div>
  );
};
