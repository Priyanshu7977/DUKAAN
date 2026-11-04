import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { COLLECTIONS } from '../data/collections';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const CollectionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const collection = COLLECTIONS.find((c) => c.slug === slug) || COLLECTIONS[0];
  const collectionProducts = PRODUCTS.filter((p) => p.collectionSlug === collection.slug);
  const otherCollections = COLLECTIONS.filter((c) => c.slug !== collection.slug);

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

      {/* Editorial Narrative & Color Palette Strip - Compact */}
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
              <div className="overflow-hidden bg-[#ECE7DD] aspect-[3/4] max-h-[380px]">
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

      {/* Collection Garments Grid - Compact */}
      <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-5 pb-2 border-b border-[#141414]/8">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block">
              Curated Selection
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#141414] mt-0.5 font-normal">
              Objects in this Edition ({collectionProducts.length})
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-[11px] uppercase tracking-wider text-[#73706B] hover:text-[#141414] transition-colors"
          >
            View All Catalogue
          </Link>
        </div>

        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#73706B] py-8 text-center">
            Additional garments for this collection are undergoing finishing in our atelier.
          </p>
        )}
      </section>

      {/* Explore Other Collections - Compact */}
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
                className="group block bg-[#FAF9F6] border border-[#141414]/8 overflow-hidden"
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
