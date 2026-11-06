import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const LookbookMasonry: React.FC = () => {
  const looks = [
    {
      title: 'Botanical Palm Print Robe',
      category: 'Study 01',
      image: 'https://www.5feet11.com/cdn/shop/files/desktopbn7.png',
      link: '/collections/solstice-atelier',
    },
    {
      title: 'Washed Denim & Sun Shirt',
      category: 'Study 02',
      image: 'https://www.5feet11.com/cdn/shop/files/desktopbn8.png',
      link: '/shop',
    },
    {
      title: 'Striped Cotton Knit Pullover',
      category: 'Study 03',
      image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/FFE136_229f120e-3e5c-486f-965a-654277cd60dc.jpg?v=1775042151',
      link: '/shop?category=knitwear',
    },
    {
      title: 'Apricot Flannel Overshirt',
      category: 'Study 04',
      image: 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/Apricot_BrownCheckeredFlannelShirt_8.jpg?v=1767087850',
      link: '/shop?category=outerwear',
    },
  ];

  return (
    <section className="py-7 sm:py-14 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 gap-2">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5 sm:mb-1">
              Lookbook Archive
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#141414] font-normal">
              Campaign & Silhouette Studies
            </h2>
          </div>
          <Link
            to="/collections/solstice-atelier"
            className="text-[11px] uppercase tracking-wider text-[#141414] hover:text-[#A7654A] transition-colors font-medium underline flex items-center gap-1"
          >
            <span>Explore Complete Lookbook</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {looks.map((look) => (
            <Link
              key={look.category}
              to={look.link}
              className="group block relative overflow-hidden bg-[#ECE7DD] rounded-lg sm:rounded-none border border-[#141414]/8 shadow-2xs"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <ImageWithFallback
                  src={look.image}
                  alt={look.title}
                  aspectRatioClass="w-full h-full"
                  className="group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
                />
              </div>
              <div className="p-2.5 sm:p-3 bg-[#FAF8F5] border-t border-[#141414]/6 flex items-center justify-between min-h-[50px] sm:min-h-[56px]">
                <div className="min-w-0 flex-1 pr-1.5">
                  <span className="text-[9px] uppercase tracking-widest text-[#73706B] block font-medium">
                    {look.category}
                  </span>
                  <h3 className="font-serif text-[11px] sm:text-sm text-[#141414] group-hover:text-[#A7654A] transition-colors truncate leading-tight">
                    {look.title}
                  </h3>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#73706B] group-hover:text-[#A7654A] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
