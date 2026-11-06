import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const FeaturedCategories: React.FC = () => {
  const categories = [
    {
      title: 'Linen Shirts',
      slug: 'shirts',
      count: '70+ Styles',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Pleated Trousers',
      slug: 'trousers',
      count: '35+ Styles',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Co-Ord Sets',
      slug: 'co-ords',
      count: '45+ Sets',
      image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Jackets & Overshirts',
      slug: 'outerwear',
      count: '15+ Styles',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Textured Knitwear',
      slug: 'knitwear',
      count: '15+ Styles',
      image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="py-7 sm:py-14 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-7 gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
              Categories
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#141414] font-normal">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-[11px] uppercase tracking-widest text-[#141414] hover:text-[#A7654A] transition-colors font-medium underline"
          >
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className={`group block relative bg-[#FAF8F5] border border-[#141414]/8 overflow-hidden rounded-lg sm:rounded-none shadow-2xs ${
                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <div className={`overflow-hidden bg-[#ECE7DD] ${idx === 4 ? 'aspect-[16/9] sm:aspect-[3/4]' : 'aspect-[3/4]'}`}>
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.title}
                  aspectRatioClass="w-full h-full"
                  className="group-hover:scale-105 transition-transform duration-500 ease-out object-cover"
                />
              </div>

              <div className="p-2.5 sm:p-3 bg-[#FAF8F5] flex items-center justify-between border-t border-[#141414]/6 min-h-[52px] sm:min-h-[58px]">
                <div className="min-w-0 pr-1">
                  <h3 className="font-serif text-xs sm:text-sm text-[#141414] group-hover:text-[#A7654A] transition-colors leading-tight truncate">
                    {cat.title}
                  </h3>
                  <span className="text-[10px] text-[#73706B] uppercase tracking-wider block mt-0.5 tabular-nums font-medium">
                    {cat.count}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#73706B] group-hover:text-[#A7654A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
