import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COLLECTIONS } from '../data/collections';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const CollectionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const gridRef = useRef<HTMLDivElement>(null);

  const collection = COLLECTIONS.find((c) => c.slug === slug) || COLLECTIONS[0];
  const collectionProducts = useMemo(
    () => PRODUCTS.filter((p) => p.collectionSlug === collection.slug),
    [collection.slug]
  );
  const otherCollections = COLLECTIONS.filter((c) => c.slug !== collection.slug);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [collection.slug, selectedCategory, sortBy]);

  const filteredAndSortedProducts = useMemo(() => {
    let list = collectionProducts;
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    const copy = [...list];
    if (sortBy === 'price-asc') copy.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') copy.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc') copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  }, [collectionProducts, selectedCategory, sortBy]);

  const pageSize = isMobile ? 8 : 16;
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredAndSortedProducts.length);
  const paginatedProducts = useMemo(
    () => filteredAndSortedProducts.slice(startIndex, endIndex),
    [filteredAndSortedProducts, startIndex, endIndex]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (gridRef.current) {
      const topOffset = gridRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full pb-12 bg-[#FAF9F6]">
      <section className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-[#FAF8F5] border-b border-[#141414]/8 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
            <Breadcrumbs
              items={[
                { label: 'Collections', href: '/collections/solstice-edition' },
                { label: collection.title },
              ]}
              className="min-w-0"
            />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] border border-[#141414]/10 rounded-full text-[10px] sm:text-[11px] uppercase tracking-wider text-[#141414] font-semibold tabular-nums shrink-0 whitespace-nowrap self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
              <span className="whitespace-nowrap">{collectionProducts.length} Curated Looks</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              {collection.season} • {collection.year}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141414] font-normal tracking-tight leading-tight">
              {collection.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed pt-1">
              {collection.tagline}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 bg-[#FAF8F5] border-b border-[#141414]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#73706B] font-semibold block">
                The Narrative
              </span>
              <p className="font-serif text-lg sm:text-2xl text-[#141414] leading-relaxed">
                "{collection.featuredQuote}"
              </p>
              <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
                {collection.story}
              </p>
              <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
                {collection.description}
              </p>

              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-widest text-[#73706B] block mb-1.5 font-medium">
                  Material Color Spectrum
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {collection.palette.map((p) => (
                    <div key={p.name} className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-black/15 inline-block"
                        style={{ backgroundColor: p.hex }}
                      />
                      <span className="text-xs text-[#141414] font-medium">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden bg-[#ECE7DD] aspect-[3/4] max-h-[380px] rounded-sm">
                <ImageWithFallback
                  src={collection.editorialImage}
                  alt={`${collection.title} editorial vignette`}
                  aspectRatioClass="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={gridRef} className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-4 pb-3 border-b border-[#141414]/8">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block">
              Curated Selection
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#141414] mt-0.5 font-normal">
              Objects in this Edition ({filteredAndSortedProducts.length})
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#73706B]">
            <span>
              Showing {filteredAndSortedProducts.length > 0 ? startIndex + 1 : 0} to {endIndex} of {filteredAndSortedProducts.length} pieces
            </span>
            <span className="hidden sm:inline text-[#141414]/20">•</span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-[#141414] font-medium bg-[#ECE7DD] px-2 py-0.5 rounded-sm">
              {pageSize} Per Page
            </span>
            <Link
              to="/shop"
              className="text-[11px] uppercase tracking-wider text-[#141414] hover:text-[#A7654A] transition-colors ml-auto font-medium"
            >
              View Full Catalog →
            </Link>
          </div>
        </div>

        
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#FAF8F5] p-3 rounded-xl border border-[#141414]/8">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'shirts', 'trousers', 'co-ords', 'outerwear'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-8 px-3.5 text-[11px] uppercase tracking-wider rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#141414] text-white shadow-xs'
                    : 'bg-[#FAF9F6] text-[#73706B] hover:text-[#141414] border border-[#141414]/10'
                }`}
              >
                {cat === 'all' ? 'All Pieces' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#73706B] ml-auto">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#141414]">Sort:</span>
            <select
              id="collection-sort-select"
              name="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-8 px-2.5 bg-[#FAF9F6] border border-[#141414]/15 rounded-lg text-xs text-[#141414] focus:outline-none"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A to Z)</option>
            </select>
          </div>
        </div>

        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 sm:mt-12 pt-6 border-t border-[#141414]/8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#73706B]">
                  Page {currentPage} of {totalPages} ({collectionProducts.length} total garments)
                </span>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-10 px-3.5 border border-[#141414]/15 rounded-sm text-xs text-[#141414] hover:bg-[#141414] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-medium">Prev</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isCurrent = pageNum === currentPage;
                    if (
                      totalPages > 7 &&
                      pageNum !== 1 &&
                      pageNum !== totalPages &&
                      Math.abs(pageNum - currentPage) > 1
                    ) {
                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return (
                          <span key={pageNum} className="w-6 text-center text-xs text-[#73706B] font-medium">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 text-xs font-semibold rounded-sm transition-all tabular-nums flex items-center justify-center active:scale-[0.98] ${
                          isCurrent
                            ? 'bg-[#141414] text-white shadow-xs'
                            : 'border border-[#141414]/15 text-[#141414] hover:bg-[#FAF8F5]'
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={isCurrent ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-10 px-3.5 border border-[#141414]/15 rounded-sm text-xs text-[#141414] hover:bg-[#141414] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
                    aria-label="Next page"
                  >
                    <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-medium">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-[#73706B] py-12 text-center">
            Additional garments for this collection are undergoing finishing in our studio.
          </p>
        )}
      </section>

      <section className="border-t border-[#141414]/8 bg-[#FAF8F5] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#73706B] font-semibold block">
              Collection Archive
            </span>
            <h3 className="font-serif text-lg sm:text-xl text-[#141414]">
              Explore Other Editions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherCollections.map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.slug}`}
                className="group block bg-[#FAF8F5] border border-[#141414]/8 overflow-hidden rounded-xl shadow-xs"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#ECE7DD]">
                  <ImageWithFallback
                    src={col.heroImage}
                    alt={col.title}
                    aspectRatioClass="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3.5">
                  <span className="text-[9px] text-[#A7654A] uppercase tracking-widest block font-medium">
                    {col.season} {col.year}
                  </span>
                  <h4 className="font-serif text-sm text-[#141414] group-hover:text-[#A7654A] transition-colors mt-0.5">
                    {col.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#73706B] group-hover:text-[#141414]">
                    <span>View Edition</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
