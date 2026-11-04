import React, { useState } from 'react';
import { JOURNAL_ARTICLES } from '../data/journal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const Journal: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Materiality', 'Conversations', 'Campaign'];

  const filteredArticles = selectedCategory === 'all'
    ? JOURNAL_ARTICLES
    : JOURNAL_ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      {/* Header - Editorial Masthead */}
      <section className="pt-6 sm:pt-8 pb-6 bg-white border-b border-[#141414]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Journal' }]} className="mb-3" />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
                ✦ DUKAAN Notes & Monographs
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal tracking-tight">
                The Atelier Journal
              </h1>
              <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
                Curated investigations into textile botany, European flax harvesting, and modern relaxed proportions.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 bg-[#FAF8F5] border border-[#141414]/10 rounded-full text-[11px] uppercase tracking-wider text-[#141414] font-medium tabular-nums">
                {filteredArticles.length} Dispatches
              </span>
            </div>
          </div>

          {/* Filter categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#141414]/6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`h-10 px-4 inline-flex items-center text-[11px] uppercase tracking-wider font-medium rounded-sm transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#141414] text-white'
                    : 'bg-[#FAF8F5] border border-[#141414]/10 text-[#73706B] hover:text-[#141414]'
                }`}
              >
                {cat === 'all' ? 'All Dispatches' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {filteredArticles.map((article) => (
            <article key={article.id} className="group flex flex-col justify-between bg-white border border-[#141414]/8 p-4">
              <div>
                <Link
                  to={`/journal/${article.slug}`}
                  className="block overflow-hidden bg-[#ECE7DD] aspect-[16/10] mb-3 relative"
                >
                  <ImageWithFallback
                    src={article.coverImage}
                    alt={article.title}
                    aspectRatioClass="w-full h-full"
                    className="group-hover:scale-105 transition-transform duration-500 ease-out object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#141414] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-medium">
                    {article.category}
                  </span>
                </Link>

                <div className="flex items-center gap-2 text-[10px] text-[#73706B] mb-1 font-light">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                <Link to={`/journal/${article.slug}`}>
                  <h3 className="font-serif text-base sm:text-lg text-[#141414] group-hover:text-[#A7654A] transition-colors leading-snug font-normal">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-xs text-[#73706B] font-light mt-1.5 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#141414]/8 flex items-center justify-between text-xs text-[#73706B]">
                <span className="text-[11px]">By {article.author.name}</span>
                <Link
                  to={`/journal/${article.slug}`}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#141414] group-hover:text-[#A7654A] font-medium"
                >
                  <span>Read Dispatch</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
