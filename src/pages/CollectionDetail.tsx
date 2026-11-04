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

  // Pagination state: Desktop = 16 images, Mobile = 8 images
  const [currentPage, setCurrentPage] = useState(1);
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

  // Reset page when collection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [collection.slug]);

  const pageSize = isMobile ? 8 : 16;
  const totalPages = Math.max(1, Math.ceil(collectionProducts.length / pageSize));

  // Ensure current page does not exceed total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, collectionProducts.length);
  const paginatedProducts = useMemo(
    () => collectionProducts.slice(startIndex, endIndex),
    [collectionProducts, startIndex, endIndex]
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
      {/* Hero Header - Compact */}
      <section className="relative overflow-hidden min-h-[24vh] sm:min-h-[30vh] max-h-[340px] flex items-end pb-6 sm:pb-8 bg-[#141414] mb-4">
        <ImageWithFallback
          src={collection.heroImage}
          alt={collection.title}
          aspectRatioClass="w-full h-full"
          wrapperClassName="absolute inset-0"
          className="opacity-75 object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/90 via-[#141414]/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
          <Breadcrumbs
            items={[
              { label: 'Collections', href: '/collections/solstice-atelier' },
              { label: collection.title },
            ]}
            className="mb-2 text-white/70"
          />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
            {collection.season} • {collection.year}
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl text-white font-normal leading-tight max-w-3xl">
            {collection.title}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl font-light mt-1 leading-relaxed">
            {collection.tagline}
          </p>
        </div>
      </section>

      {/* Editorial Narrative & Color Palette Strip */}
      <section className="py-8 sm:py-10 bg-white border-b border-[#141414]/8">
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

              {/* Palette swatches */}
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

            {/* Editorial Secondary Image */}
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

      {/* Collection Garments Grid with Desktop (16) & Mobile (8) Pagination */}
      <section ref={gridRef} className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-6 pb-3 border-b border-[#141414]/8">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block">
              Curated Selection
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#141414] mt-0.5 font-normal">
              Objects in this Edition ({collectionProducts.length})
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#73706B]">
            <span>
              Showing {collectionProducts.length > 0 ? startIndex + 1 : 0}–{endIndex} of {collectionProducts.length} pieces
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

        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Luxury Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 sm:mt-12 pt-6 border-t border-[#141414]/8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#73706B]">
                  Page {currentPage} of {totalPages} ({collectionProducts.length} total garments)
                </span>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 sm:px-3 sm:py-2 border border-[#141414]/15 rounded-sm text-xs text-[#141414] hover:bg-[#141414] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline text-[11px] uppercase tracking-wider">Prev</span>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isCurrent = pageNum === currentPage;
                    // For many pages, show current, first, last, and immediate siblings
                    if (
                      totalPages > 7 &&
                      pageNum !== 1 &&
                      pageNum !== totalPages &&
                      Math.abs(pageNum - currentPage) > 1
                    ) {
                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return (
                          <span key={pageNum} className="px-1 text-xs text-[#73706B]">
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
                        className={`w-8 h-8 sm:w-9 sm:h-9 text-xs font-mono font-medium rounded-sm transition-all ${
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

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 sm:px-3 sm:py-2 border border-[#141414]/15 rounded-sm text-xs text-[#141414] hover:bg-[#141414] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
                    aria-label="Next page"
                  >
                    <span className="hidden sm:inline text-[11px] uppercase tracking-wider">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-[#73706B] py-12 text-center">
            Additional garments for this collection are undergoing finishing in our atelier.
          </p>
        )}
      </section>

      {/* Explore Other Collections */}
      <section className="border-t border-[#141414]/8 bg-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#73706B] font-semibold block">
              Atelier Archive
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
                className="group block bg-[#FAF9F6] border border-[#141414]/8 overflow-hidden rounded-sm"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#ECE7DD]">
                  <img
                    src={col.heroImage}
                    alt={col.title}
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
