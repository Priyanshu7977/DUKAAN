import React, { useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { JOURNAL_ARTICLES } from '../data/journal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Clock, ArrowRight, Search, X, Tag } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { SEOHead } from '../components/seo/SEOHead';

export const Journal: React.FC = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/blog') ? '/blog' : '/journal';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const categories = ['all', 'Materiality', 'Style Guide', 'Care Guide', 'Conversations', 'Campaign'];

  const allTags = useMemo(() => {
    const set = new Set<string>();
    JOURNAL_ARTICLES.forEach((a) => {
      if (a.tags) {
        a.tags.forEach((t) => set.add(t));
      }
    });
    return Array.from(set);
  }, []);

  const filteredArticles = useMemo(() => {
    return JOURNAL_ARTICLES.filter((article) => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesTag = !selectedTag || (article.tags && article.tags.includes(selectedTag));
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.subtitle.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        (article.tags && article.tags.some((t) => t.toLowerCase().includes(query)));

      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'DUKAAN Editorial Journal & Blog',
    description: 'Curated technical monographs on European linen care, double gauze breathability, tropical summer styling, and unstructured tailoring.',
    url: `https://dukaan-j5l5.vercel.app${basePath}`,
    publisher: {
      '@type': 'Organization',
      name: 'DUKAAN',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dukaan-j5l5.vercel.app/images/logo.png',
      },
    },
    blogPost: JOURNAL_ARTICLES.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt,
      datePublished: article.date,
      image: article.coverImage,
      url: `https://dukaan-j5l5.vercel.app${basePath}/${article.slug}`,
      author: {
        '@type': 'Person',
        name: article.author.name,
      },
    })),
  };

  return (
    <div className="w-full pb-16 bg-[#FAF9F6]">
      <SEOHead
        title="Editorial Journal & Blog — DUKAAN | Textile Botany & Slow Tailoring"
        description="Authoritative monographs on European linen care, double gauze breathability, tropical summer styling, and unstructured tailoring geometry."
        keywords="linen shirts India, European flax clothing, slow fashion blog, linen care guide, minimalist capsule wardrobe, double gauze cotton, tropical summer styling"
        canonicalPath={basePath}
        jsonLd={blogJsonLd}
      />

      <section className="pt-6 sm:pt-10 pb-6 sm:pb-8 bg-[#FAF8F5] border-b border-[#141414]/8 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
            <Breadcrumbs items={[{ label: 'Editorial Journal & Blog' }]} className="min-w-0" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] border border-[#141414]/10 rounded-full text-[10px] sm:text-[11px] uppercase tracking-wider text-[#141414] font-semibold tabular-nums shrink-0 whitespace-nowrap self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
              <span className="whitespace-nowrap">{filteredArticles.length} Dispatches</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-2 mb-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              Journal Notes, Monographs & Care Guides
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal tracking-tight leading-tight">
              The Journal
            </h1>
            <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed pt-1">
              Curated investigations into textile botany, thermal linen physics, capsule wardrobe engineering, and deconstructed tailoring dialogues.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#73706B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                id="blog-search-query"
                name="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by keyword, fabric, care..."
                className="w-full pl-9 pr-8 py-2 bg-[#FAF9F6] border border-[#141414]/15 rounded-full text-xs text-[#141414] placeholder:text-[#73706B]/70 focus:outline-none focus:border-[#141414] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#73706B] hover:text-[#141414]"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedTag(null);
                  }}
                  className={`h-8 px-3.5 text-[11px] uppercase tracking-wider font-semibold rounded-full transition-all flex items-center justify-center ${
                    selectedCategory === cat
                      ? 'bg-[#141414] text-white shadow-xs ring-1 ring-[#141414]'
                      : 'bg-[#FAF9F6] border border-[#141414]/15 text-[#73706B] hover:text-[#141414] hover:border-[#141414]/40'
                  }`}
                >
                  {cat === 'all' ? 'All Dispatches' : cat}
                </button>
              ))}
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-3">
              <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-medium mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Topics:
              </span>
              {allTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-colors ${
                    selectedTag === tag
                      ? 'bg-[#A7654A] text-white border-[#A7654A]'
                      : 'bg-transparent border-[#141414]/10 text-[#73706B] hover:text-[#141414] hover:border-[#141414]/25'
                  }`}
                >
                  #{tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-[10px] text-[#A7654A] underline ml-1 hover:text-[#141414]"
                >
                  Clear topic
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#FAF8F5] border border-[#141414]/8 rounded-2xl max-w-md mx-auto my-8">
            <p className="font-serif text-lg text-[#141414] mb-2">No matching dispatches found</p>
            <p className="text-xs text-[#73706B] mb-4">Try adjusting your keyword query or category filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedTag(null);
              }}
              className="px-4 py-2 bg-[#141414] text-white text-xs uppercase tracking-wider rounded-full hover:bg-[#A7654A] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between bg-[#FAF8F5] border border-[#141414]/8 rounded-2xl p-4 sm:p-5 hover:border-[#141414]/20 hover:shadow-xs transition-all"
              >
                <div>
                  <Link
                    to={`${basePath}/${article.slug}`}
                    className="block overflow-hidden bg-[#ECE7DD] aspect-[16/10] mb-3.5 relative rounded-xl"
                  >
                    <ImageWithFallback
                      src={article.coverImage}
                      alt={article.title}
                      aspectRatioClass="w-full h-full"
                      className="group-hover:scale-105 transition-transform duration-500 ease-out object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-[#141414]/90 backdrop-blur-xs text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-medium rounded-full">
                      {article.category}
                    </span>
                  </Link>

                  <div className="flex items-center gap-2 text-[10px] text-[#73706B] mb-1.5 font-light">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <Link to={`${basePath}/${article.slug}`}>
                    <h2 className="font-serif text-lg sm:text-xl text-[#141414] group-hover:text-[#A7654A] transition-colors leading-snug font-normal">
                      {article.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-[#73706B] font-light mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[9px] px-2 py-0.5 bg-[#ECE7DD]/60 text-[#73706B] rounded-full">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#141414]/8 flex items-center justify-between text-xs text-[#73706B]">
                  <span className="text-[11px] font-medium text-[#141414]">By {article.author.name}</span>
                  <Link
                    to={`${basePath}/${article.slug}`}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#141414] group-hover:text-[#A7654A] font-semibold"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
